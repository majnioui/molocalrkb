package com.local.rkb.repository;

import com.local.rkb.domain.AppServices;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the AppServices entity.
 */
@Repository
public interface AppServicesRepository extends JpaRepository<AppServices, Long> {}
