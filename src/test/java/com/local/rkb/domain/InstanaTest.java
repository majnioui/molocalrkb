package com.local.rkb.domain;

import static com.local.rkb.domain.InstanaTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.local.rkb.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class InstanaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Instana.class);
        Instana instana1 = getInstanaSample1();
        Instana instana2 = new Instana();
        assertThat(instana1).isNotEqualTo(instana2);

        instana2.setId(instana1.getId());
        assertThat(instana1).isEqualTo(instana2);

        instana2 = getInstanaSample2();
        assertThat(instana1).isNotEqualTo(instana2);
    }
}
