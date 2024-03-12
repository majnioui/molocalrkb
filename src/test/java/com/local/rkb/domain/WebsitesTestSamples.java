package com.local.rkb.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class WebsitesTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Websites getWebsitesSample1() {
        return new Websites().id(1L).website("website1").websiteId("websiteId1");
    }

    public static Websites getWebsitesSample2() {
        return new Websites().id(2L).website("website2").websiteId("websiteId2");
    }

    public static Websites getWebsitesRandomSampleGenerator() {
        return new Websites().id(longCount.incrementAndGet()).website(UUID.randomUUID().toString()).websiteId(UUID.randomUUID().toString());
    }
}
