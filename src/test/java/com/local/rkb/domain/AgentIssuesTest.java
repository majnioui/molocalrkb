package com.local.rkb.domain;

import static com.local.rkb.domain.AgentIssuesTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.local.rkb.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AgentIssuesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AgentIssues.class);
        AgentIssues agentIssues1 = getAgentIssuesSample1();
        AgentIssues agentIssues2 = new AgentIssues();
        assertThat(agentIssues1).isNotEqualTo(agentIssues2);

        agentIssues2.setId(agentIssues1.getId());
        assertThat(agentIssues1).isEqualTo(agentIssues2);

        agentIssues2 = getAgentIssuesSample2();
        assertThat(agentIssues1).isNotEqualTo(agentIssues2);
    }
}
