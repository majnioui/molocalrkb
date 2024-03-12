package com.local.rkb.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class InstalledSoftwareTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static InstalledSoftware getInstalledSoftwareSample1() {
        return new InstalledSoftware().id(1L).name("name1").version("version1").type("type1").usedBy("usedBy1");
    }

    public static InstalledSoftware getInstalledSoftwareSample2() {
        return new InstalledSoftware().id(2L).name("name2").version("version2").type("type2").usedBy("usedBy2");
    }

    public static InstalledSoftware getInstalledSoftwareRandomSampleGenerator() {
        return new InstalledSoftware()
            .id(longCount.incrementAndGet())
            .name(UUID.randomUUID().toString())
            .version(UUID.randomUUID().toString())
            .type(UUID.randomUUID().toString())
            .usedBy(UUID.randomUUID().toString());
    }
}
