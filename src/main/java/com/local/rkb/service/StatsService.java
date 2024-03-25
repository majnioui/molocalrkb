package com.local.rkb.service;

import com.local.rkb.domain.AgentIssues;
import com.local.rkb.domain.AppServices;
import com.local.rkb.domain.Instana;
import com.local.rkb.repository.AgentIssuesRepository;
import com.local.rkb.repository.AppServicesRepository;
import com.local.rkb.repository.InstanaRepository;
import jakarta.annotation.PostConstruct;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.Instant;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

@Service
public class StatsService {

    private static final Logger log = LoggerFactory.getLogger(StatsService.class); // TODO : remove when done

    @Autowired
    private RestTemplate restTemplate;

    private String apiToken = "";

    @Value("${BASE_URL:}")
    private String baseUrl;

    @Value("${INSTANA_API_KEY:}")
    private String instanaApiKey;

    @Value("${settings.hcl.path:/home}")
    private String settingsHclSearchPath;

    @Autowired
    private InstanaRepository InstanaRepository;

    @Autowired
    private AgentIssuesRepository agentIssuesRepository;

    @Autowired
    private AppServicesRepository appServicesRepository;

    @PostConstruct
    public void init() {
        // Check if the INSTANA_API_KEY is provided via environment variable, use it if available
        if (!instanaApiKey.isEmpty()) {
            this.apiToken = instanaApiKey;
        } else {
            // Retrieve the latest Instana from the database
            Instana Instana = InstanaRepository.findTopByOrderByIdDesc();
            if (Instana != null) {
                this.apiToken = Instana.getApitoken();
            }
        }

        // Only find and extract baseUrl if it's not already set via environment variable
        if (this.baseUrl.isEmpty()) {
            String settingsFilePath = findSettingsHclFilePath();
            if (settingsFilePath == null || settingsFilePath.isEmpty()) {
                // Fallback to URL from Instana if available and no settings file found
                Instana Instana = InstanaRepository.findTopByOrderByIdDesc();
                if (Instana != null) {
                    this.baseUrl = Instana.getBaseurl();
                }
            } else {
                this.baseUrl = extractBaseUrlFromSettingsHcl(settingsFilePath);
            }
        }
    }

    private String findSettingsHclFilePath() {
        try {
            Process process = new ProcessBuilder(
                "/bin/sh",
                "-c",
                "find " +
                settingsHclSearchPath +
                " -type f -name \"settings.hcl\" 2>/dev/null | awk '{print length, $0}' | sort -n | cut -d\" \" -f2- | head -n 1"
            )
                .start();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                return reader.readLine();
            }
        } catch (Exception e) {
            return "";
        }
    }

    private String extractBaseUrlFromSettingsHcl(String filePath) {
        try {
            Process process = new ProcessBuilder("/bin/sh", "-c", "grep 'host_name' " + filePath + " | cut -d'=' -f2 | tr -d '\" '")
                .start();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()))) {
                return reader.readLine();
            }
        } catch (Exception e) {
            return "";
        }
    }

    // General method for making GET requests
    private String makeGetRequest(String endpoint) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "apiToken " + this.apiToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);
        try {
            ResponseEntity<String> response = restTemplate.exchange(this.baseUrl + endpoint, HttpMethod.GET, entity, String.class);
            return response.getBody();
        } catch (HttpClientErrorException e) {
            return "{}";
        }
    }

    // Method for making POST requests
    private String makePostRequest(String endpoint, String jsonPayload) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "apiToken " + this.apiToken);
        HttpEntity<String> entity = new HttpEntity<>(jsonPayload, headers);
        try {
            ResponseEntity<String> response = restTemplate.postForEntity(this.baseUrl + endpoint, entity, String.class);
            return response.getBody();
        } catch (HttpClientErrorException e) {
            return "{}"; // Return empty JSON in case of errors
        }
    }

    // method to fetch host agent details
    public String getHostAgentDetails() {
        try {
            String hostAgentListUrl = "/api/host-agent/";
            String response = makeGetRequest(hostAgentListUrl);
            JSONObject jsonResponse = new JSONObject(response);
            JSONArray items = jsonResponse.getJSONArray("items");
            if (items.length() > 0) {
                JSONArray snapshotIds = new JSONArray();
                for (int i = 0; i < items.length(); i++) {
                    snapshotIds.put(items.getJSONObject(i).getString("snapshotId"));
                }
                // Construct JSON payload for POST request
                JSONObject payload = new JSONObject();
                payload.put("snapshotIds", snapshotIds);
                String detailUrl = "/api/infrastructure-monitoring/snapshots";
                // Use makePostRequest to send the POST request
                return makePostRequest(detailUrl, payload.toString());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "{}";
    }

    public String getInstalledSoftware() {
        String endpoint = "/api/infrastructure-monitoring/software/versions";
        return makeGetRequest(endpoint);
    }

    public String getInfrastructureTopology() {
        String endpoint = "/api/infrastructure-monitoring/topology";
        return makeGetRequest(endpoint);
    }

    public String getAllEvents() {
        String endpoint = "/api/events?windowSize=86400000";
        return makeGetRequest(endpoint);
    }

    public String getAgentRelaltedIssues() {
        String endpoint = "/api/events/agent-monitoring-events";
        String response = makeGetRequest(endpoint);
        try {
            JSONArray items = new JSONArray(response);
            for (int i = 0; i < items.length(); i++) {
                JSONObject item = items.getJSONObject(i);
                AgentIssues issue = new AgentIssues();
                issue.setType(item.optString("type"));
                issue.setState(item.optString("state"));
                issue.setProblem(item.optString("problem"));
                issue.setDetail(item.optString("detail"));
                issue.setSeverity(item.optString("severity"));
                issue.setEntityName(item.optString("entityName"));
                issue.setEntityLabel(item.optString("entityLabel"));
                issue.setEntityType(item.optString("entityType"));
                issue.setFix(item.optString("fixSuggestion"));
                issue.setAtTime(Instant.now());
                agentIssuesRepository.save(issue);
            }
        } catch (Exception e) {
            return "[]";
        }
        return response;
    }

    public String getInstanaVersion() {
        String endpoint = "/api/instana/version";
        return makeGetRequest(endpoint);
    }

    public String getInstanaHealth() {
        String endpoint = "/api/instana/health";
        return makeGetRequest(endpoint);
    }

    public String getServices() {
        String endpoint = "/api/application-monitoring/metrics/services";
        String jsonPayload =
            """
            {
                "applicationBoundaryScope": "ALL",
                "contextScope": "NONE",
                "metrics": [
                    {"aggregation": "SUM", "metric": "calls"},
                    {"aggregation": "SUM", "metric": "erroneousCalls"},
                    {"aggregation": "MEAN", "metric": "latency"},
                    {"aggregation": "DISTINCT_COUNT", "metric": "applications"},
                    {"aggregation": "DISTINCT_COUNT", "metric": "endpoints"}
                ]
            }""";
        String response = makePostRequest(endpoint, jsonPayload);
        try {
            JSONObject jsonResponse = new JSONObject(response);
            JSONArray items = jsonResponse.getJSONArray("items");
            for (int i = 0; i < items.length(); i++) {
                JSONObject item = items.getJSONObject(i);
                JSONObject service = item.getJSONObject("service");
                JSONObject metrics = item.getJSONObject("metrics");

                AppServices appService = new AppServices();
                appService.setServId(service.optString("id"));
                appService.setLabel(service.optString("label"));
                appService.setTypes(service.getJSONArray("types").toString());
                appService.setTechnologies(service.getJSONArray("technologies").toString());
                appService.setEntityType(service.optString("entityType"));

                appService.setErronCalls(metrics.getJSONArray("erroneousCalls.sum").getJSONArray(0).get(1).toString());
                appService.setCalls(metrics.getJSONArray("calls.sum").getJSONArray(0).get(1).toString());
                appService.setLatency(metrics.getJSONArray("latency.mean").getJSONArray(0).get(1).toString());
                appService.setDate(Instant.now());

                appServicesRepository.save(appService);
            }
        } catch (Exception e) {
            return "[]";
        }
        return response;
    }

    public String getWebsiteMetrics() {
        String configEndpoint = "/api/website-monitoring/config";
        log.info("Fetching website monitoring config from {}", configEndpoint);
        String configResponse = makeGetRequest(configEndpoint);
        JSONArray responseSummary = new JSONArray();
        try {
            JSONArray websites = new JSONArray(configResponse);
            log.info("Received {} websites for metrics collection", websites.length());

            for (int i = 0; i < websites.length(); i++) {
                JSONObject website = websites.getJSONObject(i);
                String websiteName = website.optString("name");
                log.info("Processing website: {}", websiteName);

                JSONObject payload = prepareMetricsPayload(websiteName);
                String metricsEndpoint = "/api/website-monitoring/v2/metrics";
                log.info("Posting metrics for website: {}", websiteName);
                String postResponse = makePostRequest(metricsEndpoint, payload.toString());
                JSONObject metricsResponse = new JSONObject(postResponse);

                log.info("Received metrics for website: {}", websiteName);
                // Compile each website's name and metrics into a structured object
                JSONObject websiteMetrics = new JSONObject();
                websiteMetrics.put("name", websiteName);
                websiteMetrics.put("metrics", metricsResponse);

                // Add to the summary array
                responseSummary.put(websiteMetrics);
            }
        } catch (Exception e) {
            log.error("Error processing website metrics", e);
            // In case of error, return an empty array or a meaningful error message as JSON
            return new JSONArray().toString();
        }
        log.info("Completed metrics collection for all websites");
        return responseSummary.toString();
    }

    private JSONObject prepareMetricsPayload(String websiteName) {
        log.info("Preparing metrics payload for website: {}", websiteName);
        String payloadTemplate =
            """
            {
            "metrics": [
                {
                "metric": "beaconDuration",
                "aggregation": "MEAN"
                },
                {
                "metric": "pageLoads",
                "aggregation": "SUM"
                },
                {
                "metric": "pageViews",
                "aggregation": "SUM"
                },
                {
                "metric": "cumulativeLayoutShift",
                "aggregation": "SUM"
                }
            ],
            "tagFilterExpression": {
                "type": "EXPRESSION",
                "logicalOperator": "AND",
                "elements": [
                {
                    "type": "TAG_FILTER",
                    "name": "beacon.website.name",
                    "operator": "EQUALS",
                    "entity": "NOT_APPLICABLE",
                    "value": "%s"
                }
                ]
            },
            "timeFrame": {
                "to": null,
                "windowSize": 3600000
            },
            "type": "PAGELOAD"
            }
            """.formatted(websiteName);

        return new JSONObject(payloadTemplate);
    }
}
