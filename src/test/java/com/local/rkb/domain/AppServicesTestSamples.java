package com.local.rkb.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class AppServicesTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static AppServices getAppServicesSample1() {
        return new AppServices()
            .id(1L)
            .servId("servId1")
            .label("label1")
            .types("types1")
            .technologies("technologies1")
            .entityType("entityType1")
            .erronCalls("erronCalls1")
            .calls("calls1")
            .latency("latency1");
    }

    public static AppServices getAppServicesSample2() {
        return new AppServices()
            .id(2L)
            .servId("servId2")
            .label("label2")
            .types("types2")
            .technologies("technologies2")
            .entityType("entityType2")
            .erronCalls("erronCalls2")
            .calls("calls2")
            .latency("latency2");
    }

    public static AppServices getAppServicesRandomSampleGenerator() {
        return new AppServices()
            .id(longCount.incrementAndGet())
            .servId(UUID.randomUUID().toString())
            .label(UUID.randomUUID().toString())
            .types(UUID.randomUUID().toString())
            .technologies(UUID.randomUUID().toString())
            .entityType(UUID.randomUUID().toString())
            .erronCalls(UUID.randomUUID().toString())
            .calls(UUID.randomUUID().toString())
            .latency(UUID.randomUUID().toString());
    }
}
