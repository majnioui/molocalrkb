package com.local.rkb.repository;

import com.local.rkb.domain.Instana;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Instana entity.
 */
@SuppressWarnings("unused")
@Repository
public interface InstanaRepository extends JpaRepository<Instana, Long> {}
