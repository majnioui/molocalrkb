package com.local.rkb.domain;

import static com.local.rkb.domain.InstalledSoftwareTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.local.rkb.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class InstalledSoftwareTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(InstalledSoftware.class);
        InstalledSoftware installedSoftware1 = getInstalledSoftwareSample1();
        InstalledSoftware installedSoftware2 = new InstalledSoftware();
        assertThat(installedSoftware1).isNotEqualTo(installedSoftware2);

        installedSoftware2.setId(installedSoftware1.getId());
        assertThat(installedSoftware1).isEqualTo(installedSoftware2);

        installedSoftware2 = getInstalledSoftwareSample2();
        assertThat(installedSoftware1).isNotEqualTo(installedSoftware2);
    }
}
