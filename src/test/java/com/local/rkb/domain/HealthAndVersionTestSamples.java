package com.local.rkb.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class HealthAndVersionTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static HealthAndVersion getHealthAndVersionSample1() {
        return new HealthAndVersion().id(1L).version("version1").health("health1").healthMsg("healthMsg1");
    }

    public static HealthAndVersion getHealthAndVersionSample2() {
        return new HealthAndVersion().id(2L).version("version2").health("health2").healthMsg("healthMsg2");
    }

    public static HealthAndVersion getHealthAndVersionRandomSampleGenerator() {
        return new HealthAndVersion()
            .id(longCount.incrementAndGet())
            .version(UUID.randomUUID().toString())
            .health(UUID.randomUUID().toString())
            .healthMsg(UUID.randomUUID().toString());
    }
}
