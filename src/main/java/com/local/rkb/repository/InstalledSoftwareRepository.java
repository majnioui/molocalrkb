package com.local.rkb.repository;

import com.local.rkb.domain.InstalledSoftware;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the InstalledSoftware entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InstalledSoftwareRepository extends JpaRepository<InstalledSoftware, Long> {}
