package com.local.rkb.web.rest;

import com.local.rkb.service.StatsService;
import java.util.HashMap;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StatsController {

    @Autowired
    private StatsService statsService;

    @GetMapping("/api/hostAgent")
    public String getHostAgentDetails() throws JSONException {
        return statsService.getHostAgentDetails();
    }

    @GetMapping("/api/installedSoftware")
    public String getInstalledSoftware() throws JSONException {
        return statsService.getInstalledSoftware();
    }

    @GetMapping("/api/infraTopology")
    public String getInfrastructureTopology() throws JSONException {
        return statsService.getInfrastructureTopology();
    }

    @GetMapping("/api/allEvents")
    public String getAllEvents(@RequestParam("windowSize") long windowSize, @RequestParam("eventTypeFilters") String eventTypeFilters)
        throws JSONException {
        return statsService.getAllEvents(windowSize, eventTypeFilters);
    }

    @GetMapping("/api/services")
    public String getServices() throws JSONException {
        return statsService.getServices();
    }

    @GetMapping("/api/agentRelatedIssues")
    public String getAgentRelaltedIssues() throws JSONException {
        return statsService.getAgentRelaltedIssues();
    }

    @GetMapping("/api/instanaVersion")
    public String getInstanaVersion() throws JSONException {
        return statsService.getInstanaVersion();
    }

    @GetMapping("/api/instanaHealth")
    public String getInstanaHealth() throws JSONException {
        return statsService.getInstanaHealth();
    }

    @GetMapping("/api/websiteMetrics")
    public String getWebsiteMetrics(@RequestParam("windowSize") long windowSize) throws JSONException {
        return statsService.getWebsiteMetrics(windowSize);
    }

    @GetMapping("/api/snapshotDetails")
    public ResponseEntity<String> fetchSnapshotDetails() throws JSONException {
        JSONArray detailedSnapshots = statsService.fetchSnapshotDetails();
        return ResponseEntity.ok(detailedSnapshots.toString());
    }

    @GetMapping("/api/config")
    public ResponseEntity<Map<String, Object>> getConfiguration() {
        Map<String, Object> configs = new HashMap<>();
        String baseUrl = statsService.getBaseUrl();
        configs.put("baseUrl", baseUrl);
        return ResponseEntity.ok(configs);
    }
}
