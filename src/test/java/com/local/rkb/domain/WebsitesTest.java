package com.local.rkb.domain;

import static com.local.rkb.domain.WebsitesTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.local.rkb.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class WebsitesTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Websites.class);
        Websites websites1 = getWebsitesSample1();
        Websites websites2 = new Websites();
        assertThat(websites1).isNotEqualTo(websites2);

        websites2.setId(websites1.getId());
        assertThat(websites1).isEqualTo(websites2);

        websites2 = getWebsitesSample2();
        assertThat(websites1).isNotEqualTo(websites2);
    }
}
