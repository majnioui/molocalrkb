package com.local.rkb.domain;

import static com.local.rkb.domain.HealthAndVersionTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.local.rkb.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class HealthAndVersionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(HealthAndVersion.class);
        HealthAndVersion healthAndVersion1 = getHealthAndVersionSample1();
        HealthAndVersion healthAndVersion2 = new HealthAndVersion();
        assertThat(healthAndVersion1).isNotEqualTo(healthAndVersion2);

        healthAndVersion2.setId(healthAndVersion1.getId());
        assertThat(healthAndVersion1).isEqualTo(healthAndVersion2);

        healthAndVersion2 = getHealthAndVersionSample2();
        assertThat(healthAndVersion1).isNotEqualTo(healthAndVersion2);
    }
}
