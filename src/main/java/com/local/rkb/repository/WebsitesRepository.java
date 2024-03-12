package com.local.rkb.repository;

import com.local.rkb.domain.Websites;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Websites entity.
 */
@SuppressWarnings("unused")
@Repository
public interface WebsitesRepository extends JpaRepository<Websites, Long> {}
