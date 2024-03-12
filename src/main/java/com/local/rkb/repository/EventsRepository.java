package com.local.rkb.repository;

import com.local.rkb.domain.Events;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Events entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EventsRepository extends JpaRepository<Events, Long> {}
