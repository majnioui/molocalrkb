package com.local.rkb.repository;

import com.local.rkb.domain.InfraTopology;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the InfraTopology entity.
 */
@Repository
public interface InfraTopologyRepository extends JpaRepository<InfraTopology, Long> {}
