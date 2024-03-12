package com.local.rkb.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class AgentIssuesTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static AgentIssues getAgentIssuesSample1() {
        return new AgentIssues()
            .id(1L)
            .type("type1")
            .state("state1")
            .problem("problem1")
            .detail("detail1")
            .severity("severity1")
            .entityName("entityName1")
            .entityLabel("entityLabel1")
            .entityType("entityType1")
            .fix("fix1");
    }

    public static AgentIssues getAgentIssuesSample2() {
        return new AgentIssues()
            .id(2L)
            .type("type2")
            .state("state2")
            .problem("problem2")
            .detail("detail2")
            .severity("severity2")
            .entityName("entityName2")
            .entityLabel("entityLabel2")
            .entityType("entityType2")
            .fix("fix2");
    }

    public static AgentIssues getAgentIssuesRandomSampleGenerator() {
        return new AgentIssues()
            .id(longCount.incrementAndGet())
            .type(UUID.randomUUID().toString())
            .state(UUID.randomUUID().toString())
            .problem(UUID.randomUUID().toString())
            .detail(UUID.randomUUID().toString())
            .severity(UUID.randomUUID().toString())
            .entityName(UUID.randomUUID().toString())
            .entityLabel(UUID.randomUUID().toString())
            .entityType(UUID.randomUUID().toString())
            .fix(UUID.randomUUID().toString());
    }
}
