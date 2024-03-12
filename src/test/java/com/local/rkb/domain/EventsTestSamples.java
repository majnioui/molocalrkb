package com.local.rkb.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class EventsTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Events getEventsSample1() {
        return new Events()
            .id(1L)
            .type("type1")
            .state("state1")
            .problem("problem1")
            .detail("detail1")
            .severity("severity1")
            .entityName("entityName1")
            .entityLabel("entityLabel1")
            .entityType("entityType1")
            .fix("fix1");
    }

    public static Events getEventsSample2() {
        return new Events()
            .id(2L)
            .type("type2")
            .state("state2")
            .problem("problem2")
            .detail("detail2")
            .severity("severity2")
            .entityName("entityName2")
            .entityLabel("entityLabel2")
            .entityType("entityType2")
            .fix("fix2");
    }

    public static Events getEventsRandomSampleGenerator() {
        return new Events()
            .id(longCount.incrementAndGet())
            .type(UUID.randomUUID().toString())
            .state(UUID.randomUUID().toString())
            .problem(UUID.randomUUID().toString())
            .detail(UUID.randomUUID().toString())
            .severity(UUID.randomUUID().toString())
            .entityName(UUID.randomUUID().toString())
            .entityLabel(UUID.randomUUID().toString())
            .entityType(UUID.randomUUID().toString())
            .fix(UUID.randomUUID().toString());
    }
}
