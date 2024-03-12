package com.local.rkb.repository;

import com.local.rkb.domain.HealthAndVersion;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the HealthAndVersion entity.
 */
@Repository
public interface HealthAndVersionRepository extends JpaRepository<HealthAndVersion, Long> {}
