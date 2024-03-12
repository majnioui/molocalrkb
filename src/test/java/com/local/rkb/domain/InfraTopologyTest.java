package com.local.rkb.domain;

import static com.local.rkb.domain.InfraTopologyTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.local.rkb.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class InfraTopologyTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(InfraTopology.class);
        InfraTopology infraTopology1 = getInfraTopologySample1();
        InfraTopology infraTopology2 = new InfraTopology();
        assertThat(infraTopology1).isNotEqualTo(infraTopology2);

        infraTopology2.setId(infraTopology1.getId());
        assertThat(infraTopology1).isEqualTo(infraTopology2);

        infraTopology2 = getInfraTopologySample2();
        assertThat(infraTopology1).isNotEqualTo(infraTopology2);
    }
}
