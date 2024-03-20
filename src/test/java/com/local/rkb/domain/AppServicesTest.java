package com.local.rkb.domain;

import static com.local.rkb.domain.AppServicesTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.local.rkb.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AppServicesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AppServices.class);
        AppServices appServices1 = getAppServicesSample1();
        AppServices appServices2 = new AppServices();
        assertThat(appServices1).isNotEqualTo(appServices2);

        appServices2.setId(appServices1.getId());
        assertThat(appServices1).isEqualTo(appServices2);

        appServices2 = getAppServicesSample2();
        assertThat(appServices1).isNotEqualTo(appServices2);
    }
}
