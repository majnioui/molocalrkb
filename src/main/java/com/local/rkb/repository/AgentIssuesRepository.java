package com.local.rkb.repository;

import com.local.rkb.domain.AgentIssues;
import java.time.Instant;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the AgentIssues entity.
 */
@Repository
public interface AgentIssuesRepository extends JpaRepository<AgentIssues, Long> {
    @Query("SELECT MAX(a.atTime) FROM AgentIssues a")
    Instant findMostRecentAtTime();
}
