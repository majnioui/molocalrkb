package com.local.rkb.web.rest;

import com.local.rkb.domain.InstalledSoftware;
import com.local.rkb.repository.InstalledSoftwareRepository;
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
 * REST controller for managing {@link com.local.rkb.domain.InstalledSoftware}.
 */
@RestController
@RequestMapping("/api/installed-softwares")
@Transactional
public class InstalledSoftwareResource {

    private final Logger log = LoggerFactory.getLogger(InstalledSoftwareResource.class);

    private static final String ENTITY_NAME = "installedSoftware";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InstalledSoftwareRepository installedSoftwareRepository;

    public InstalledSoftwareResource(InstalledSoftwareRepository installedSoftwareRepository) {
        this.installedSoftwareRepository = installedSoftwareRepository;
    }

    /**
     * {@code POST  /installed-softwares} : Create a new installedSoftware.
     *
     * @param installedSoftware the installedSoftware to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new installedSoftware, or with status {@code 400 (Bad Request)} if the installedSoftware has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<InstalledSoftware> createInstalledSoftware(@RequestBody InstalledSoftware installedSoftware)
        throws URISyntaxException {
        log.debug("REST request to save InstalledSoftware : {}", installedSoftware);
        if (installedSoftware.getId() != null) {
            throw new BadRequestAlertException("A new installedSoftware cannot already have an ID", ENTITY_NAME, "idexists");
        }
        InstalledSoftware result = installedSoftwareRepository.save(installedSoftware);
        return ResponseEntity
            .created(new URI("/api/installed-softwares/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /installed-softwares/:id} : Updates an existing installedSoftware.
     *
     * @param id the id of the installedSoftware to save.
     * @param installedSoftware the installedSoftware to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated installedSoftware,
     * or with status {@code 400 (Bad Request)} if the installedSoftware is not valid,
     * or with status {@code 500 (Internal Server Error)} if the installedSoftware couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<InstalledSoftware> updateInstalledSoftware(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody InstalledSoftware installedSoftware
    ) throws URISyntaxException {
        log.debug("REST request to update InstalledSoftware : {}, {}", id, installedSoftware);
        if (installedSoftware.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, installedSoftware.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!installedSoftwareRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        InstalledSoftware result = installedSoftwareRepository.save(installedSoftware);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, installedSoftware.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /installed-softwares/:id} : Partial updates given fields of an existing installedSoftware, field will ignore if it is null
     *
     * @param id the id of the installedSoftware to save.
     * @param installedSoftware the installedSoftware to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated installedSoftware,
     * or with status {@code 400 (Bad Request)} if the installedSoftware is not valid,
     * or with status {@code 404 (Not Found)} if the installedSoftware is not found,
     * or with status {@code 500 (Internal Server Error)} if the installedSoftware couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<InstalledSoftware> partialUpdateInstalledSoftware(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody InstalledSoftware installedSoftware
    ) throws URISyntaxException {
        log.debug("REST request to partial update InstalledSoftware partially : {}, {}", id, installedSoftware);
        if (installedSoftware.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, installedSoftware.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!installedSoftwareRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<InstalledSoftware> result = installedSoftwareRepository
            .findById(installedSoftware.getId())
            .map(existingInstalledSoftware -> {
                if (installedSoftware.getName() != null) {
                    existingInstalledSoftware.setName(installedSoftware.getName());
                }
                if (installedSoftware.getVersion() != null) {
                    existingInstalledSoftware.setVersion(installedSoftware.getVersion());
                }
                if (installedSoftware.getType() != null) {
                    existingInstalledSoftware.setType(installedSoftware.getType());
                }
                if (installedSoftware.getUsedBy() != null) {
                    existingInstalledSoftware.setUsedBy(installedSoftware.getUsedBy());
                }

                return existingInstalledSoftware;
            })
            .map(installedSoftwareRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, installedSoftware.getId().toString())
        );
    }

    /**
     * {@code GET  /installed-softwares} : get all the installedSoftwares.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of installedSoftwares in body.
     */
    @GetMapping("")
    public List<InstalledSoftware> getAllInstalledSoftwares() {
        log.debug("REST request to get all InstalledSoftwares");
        return installedSoftwareRepository.findAll();
    }

    /**
     * {@code GET  /installed-softwares/:id} : get the "id" installedSoftware.
     *
     * @param id the id of the installedSoftware to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the installedSoftware, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<InstalledSoftware> getInstalledSoftware(@PathVariable Long id) {
        log.debug("REST request to get InstalledSoftware : {}", id);
        Optional<InstalledSoftware> installedSoftware = installedSoftwareRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(installedSoftware);
    }

    /**
     * {@code DELETE  /installed-softwares/:id} : delete the "id" installedSoftware.
     *
     * @param id the id of the installedSoftware to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInstalledSoftware(@PathVariable Long id) {
        log.debug("REST request to delete InstalledSoftware : {}", id);
        installedSoftwareRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
