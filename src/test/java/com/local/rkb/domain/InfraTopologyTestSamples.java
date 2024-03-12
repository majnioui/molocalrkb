package com.local.rkb.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class InfraTopologyTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static InfraTopology getInfraTopologySample1() {
        return new InfraTopology().id(1L).plugin("plugin1").label("label1").pluginId("pluginId1");
    }

    public static InfraTopology getInfraTopologySample2() {
        return new InfraTopology().id(2L).plugin("plugin2").label("label2").pluginId("pluginId2");
    }

    public static InfraTopology getInfraTopologyRandomSampleGenerator() {
        return new InfraTopology()
            .id(longCount.incrementAndGet())
            .plugin(UUID.randomUUID().toString())
            .label(UUID.randomUUID().toString())
            .pluginId(UUID.randomUUID().toString());
    }
}
