package com.local.rkb.web.rest;

import com.local.rkb.domain.HealthAndVersion;
import com.local.rkb.repository.HealthAndVersionRepository;
import com.local.rkb.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.local.rkb.domain.HealthAndVersion}.
 */
@RestController
@RequestMapping("/api/health-and-versions")
@Transactional
public class HealthAndVersionResource {

    private final Logger log = LoggerFactory.getLogger(HealthAndVersionResource.class);

    private static final String ENTITY_NAME = "healthAndVersion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HealthAndVersionRepository healthAndVersionRepository;

    public HealthAndVersionResource(HealthAndVersionRepository healthAndVersionRepository) {
        this.healthAndVersionRepository = healthAndVersionRepository;
    }

    /**
     * {@code POST  /health-and-versions} : Create a new healthAndVersion.
     *
     * @param healthAndVersion the healthAndVersion to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new healthAndVersion, or with status {@code 400 (Bad Request)} if the healthAndVersion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<HealthAndVersion> createHealthAndVersion(@RequestBody HealthAndVersion healthAndVersion)
        throws URISyntaxException {
        log.debug("REST request to save HealthAndVersion : {}", healthAndVersion);
        if (healthAndVersion.getId() != null) {
            throw new BadRequestAlertException("A new healthAndVersion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        HealthAndVersion result = healthAndVersionRepository.save(healthAndVersion);
        return ResponseEntity
            .created(new URI("/api/health-and-versions/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /health-and-versions/:id} : Updates an existing healthAndVersion.
     *
     * @param id the id of the healthAndVersion to save.
     * @param healthAndVersion the healthAndVersion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated healthAndVersion,
     * or with status {@code 400 (Bad Request)} if the healthAndVersion is not valid,
     * or with status {@code 500 (Internal Server Error)} if the healthAndVersion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<HealthAndVersion> updateHealthAndVersion(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody HealthAndVersion healthAndVersion
    ) throws URISyntaxException {
        log.debug("REST request to update HealthAndVersion : {}, {}", id, healthAndVersion);
        if (healthAndVersion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, healthAndVersion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!healthAndVersionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        HealthAndVersion result = healthAndVersionRepository.save(healthAndVersion);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, healthAndVersion.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /health-and-versions/:id} : Partial updates given fields of an existing healthAndVersion, field will ignore if it is null
     *
     * @param id the id of the healthAndVersion to save.
     * @param healthAndVersion the healthAndVersion to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated healthAndVersion,
     * or with status {@code 400 (Bad Request)} if the healthAndVersion is not valid,
     * or with status {@code 404 (Not Found)} if the healthAndVersion is not found,
     * or with status {@code 500 (Internal Server Error)} if the healthAndVersion couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<HealthAndVersion> partialUpdateHealthAndVersion(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody HealthAndVersion healthAndVersion
    ) throws URISyntaxException {
        log.debug("REST request to partial update HealthAndVersion partially : {}, {}", id, healthAndVersion);
        if (healthAndVersion.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, healthAndVersion.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!healthAndVersionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<HealthAndVersion> result = healthAndVersionRepository
            .findById(healthAndVersion.getId())
            .map(existingHealthAndVersion -> {
                if (healthAndVersion.getVersion() != null) {
                    existingHealthAndVersion.setVersion(healthAndVersion.getVersion());
                }
                if (healthAndVersion.getHealth() != null) {
                    existingHealthAndVersion.setHealth(healthAndVersion.getHealth());
                }
                if (healthAndVersion.getHealthMsg() != null) {
                    existingHealthAndVersion.setHealthMsg(healthAndVersion.getHealthMsg());
                }

                return existingHealthAndVersion;
            })
            .map(healthAndVersionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, healthAndVersion.getId().toString())
        );
    }

    /**
     * {@code GET  /health-and-versions} : get all the healthAndVersions.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of healthAndVersions in body.
     */
    @GetMapping("")
    public List<HealthAndVersion> getAllHealthAndVersions() {
        log.debug("REST request to get all HealthAndVersions");
        return healthAndVersionRepository.findAll();
    }

    /**
     * {@code GET  /health-and-versions/:id} : get the "id" healthAndVersion.
     *
     * @param id the id of the healthAndVersion to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the healthAndVersion, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<HealthAndVersion> getHealthAndVersion(@PathVariable Long id) {
        log.debug("REST request to get HealthAndVersion : {}", id);
        Optional<HealthAndVersion> healthAndVersion = healthAndVersionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(healthAndVersion);
    }

    /**
     * {@code DELETE  /health-and-versions/:id} : delete the "id" healthAndVersion.
     *
     * @param id the id of the healthAndVersion to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHealthAndVersion(@PathVariable Long id) {
        log.debug("REST request to delete HealthAndVersion : {}", id);
        healthAndVersionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
