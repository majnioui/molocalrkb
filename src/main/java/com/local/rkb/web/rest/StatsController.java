package com.local.rkb.web.rest;

import com.local.rkb.service.StatsService;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class StatsController {

    @Autowired
    private StatsService statsService;

    @GetMapping("/api/host-agent")
    public String getHostAgentDetails() throws JSONException {
        return statsService.getHostAgentDetails();
    }

    @GetMapping("/api/installed-software")
    public String getInstalledSoftware() throws JSONException {
        return statsService.getInstalledSoftware();
    }

    @GetMapping("/api/infra-topology")
    public String getInfrastructureTopology() throws JSONException {
        return statsService.getInfrastructureTopology();
    }

    @GetMapping("/api/all-events")
    public String getAllEvents() throws JSONException {
        return statsService.getAllEvents();
    }

    @GetMapping("/api/services")
    public String getServices() throws JSONException {
        return statsService.getServices();
    }

    @GetMapping("/api/agent-related-issues")
    public String getAgentRelaltedIssues() throws JSONException {
        return statsService.getAgentRelaltedIssues();
    }

    @GetMapping("/api/instana-version")
    public String getInstanaVersion() throws JSONException {
        return statsService.getInstanaVersion();
    }

    @GetMapping("/api/instana-health")
    public String getInstanaHealth() throws JSONException {
        return statsService.getInstanaHealth();
    }

    @GetMapping("/api/website-metrics")
    public String getWebsiteMetrics() throws JSONException {
        return statsService.getWebsiteMetrics();
    }
}
