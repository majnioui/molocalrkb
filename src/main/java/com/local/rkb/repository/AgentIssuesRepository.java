package com.local.rkb.repository;

import com.local.rkb.domain.AgentIssues;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the AgentIssues entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AgentIssuesRepository extends JpaRepository<AgentIssues, Long> {}
