package com.local.rkb.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class InstanaTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Instana getInstanaSample1() {
        return new Instana().id(1L).apitoken("apitoken1").baseurl("baseurl1");
    }

    public static Instana getInstanaSample2() {
        return new Instana().id(2L).apitoken("apitoken2").baseurl("baseurl2");
    }

    public static Instana getInstanaRandomSampleGenerator() {
        return new Instana().id(longCount.incrementAndGet()).apitoken(UUID.randomUUID().toString()).baseurl(UUID.randomUUID().toString());
    }
}
