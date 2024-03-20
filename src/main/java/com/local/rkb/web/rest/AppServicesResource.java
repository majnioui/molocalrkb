package com.local.rkb.web.rest;

import com.local.rkb.domain.AppServices;
import com.local.rkb.repository.AppServicesRepository;
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
 * REST controller for managing {@link com.local.rkb.domain.AppServices}.
 */
@RestController
@RequestMapping("/api/app-services")
@Transactional
public class AppServicesResource {

    private final Logger log = LoggerFactory.getLogger(AppServicesResource.class);

    private static final String ENTITY_NAME = "appServices";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AppServicesRepository appServicesRepository;

    public AppServicesResource(AppServicesRepository appServicesRepository) {
        this.appServicesRepository = appServicesRepository;
    }

    /**
     * {@code POST  /app-services} : Create a new appServices.
     *
     * @param appServices the appServices to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new appServices, or with status {@code 400 (Bad Request)} if the appServices has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<AppServices> createAppServices(@RequestBody AppServices appServices) throws URISyntaxException {
        log.debug("REST request to save AppServices : {}", appServices);
        if (appServices.getId() != null) {
            throw new BadRequestAlertException("A new appServices cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AppServices result = appServicesRepository.save(appServices);
        return ResponseEntity
            .created(new URI("/api/app-services/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /app-services/:id} : Updates an existing appServices.
     *
     * @param id the id of the appServices to save.
     * @param appServices the appServices to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated appServices,
     * or with status {@code 400 (Bad Request)} if the appServices is not valid,
     * or with status {@code 500 (Internal Server Error)} if the appServices couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AppServices> updateAppServices(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AppServices appServices
    ) throws URISyntaxException {
        log.debug("REST request to update AppServices : {}, {}", id, appServices);
        if (appServices.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, appServices.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!appServicesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AppServices result = appServicesRepository.save(appServices);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, appServices.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /app-services/:id} : Partial updates given fields of an existing appServices, field will ignore if it is null
     *
     * @param id the id of the appServices to save.
     * @param appServices the appServices to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated appServices,
     * or with status {@code 400 (Bad Request)} if the appServices is not valid,
     * or with status {@code 404 (Not Found)} if the appServices is not found,
     * or with status {@code 500 (Internal Server Error)} if the appServices couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AppServices> partialUpdateAppServices(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AppServices appServices
    ) throws URISyntaxException {
        log.debug("REST request to partial update AppServices partially : {}, {}", id, appServices);
        if (appServices.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, appServices.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!appServicesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AppServices> result = appServicesRepository
            .findById(appServices.getId())
            .map(existingAppServices -> {
                if (appServices.getServId() != null) {
                    existingAppServices.setServId(appServices.getServId());
                }
                if (appServices.getLabel() != null) {
                    existingAppServices.setLabel(appServices.getLabel());
                }
                if (appServices.getTypes() != null) {
                    existingAppServices.setTypes(appServices.getTypes());
                }
                if (appServices.getTechnologies() != null) {
                    existingAppServices.setTechnologies(appServices.getTechnologies());
                }
                if (appServices.getEntityType() != null) {
                    existingAppServices.setEntityType(appServices.getEntityType());
                }
                if (appServices.getErronCalls() != null) {
                    existingAppServices.setErronCalls(appServices.getErronCalls());
                }
                if (appServices.getCalls() != null) {
                    existingAppServices.setCalls(appServices.getCalls());
                }
                if (appServices.getLatency() != null) {
                    existingAppServices.setLatency(appServices.getLatency());
                }
                if (appServices.getDate() != null) {
                    existingAppServices.setDate(appServices.getDate());
                }

                return existingAppServices;
            })
            .map(appServicesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, appServices.getId().toString())
        );
    }

    /**
     * {@code GET  /app-services} : get all the appServices.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of appServices in body.
     */
    @GetMapping("")
    public List<AppServices> getAllAppServices() {
        log.debug("REST request to get all AppServices");
        return appServicesRepository.findAll();
    }

    /**
     * {@code GET  /app-services/:id} : get the "id" appServices.
     *
     * @param id the id of the appServices to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the appServices, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AppServices> getAppServices(@PathVariable Long id) {
        log.debug("REST request to get AppServices : {}", id);
        Optional<AppServices> appServices = appServicesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(appServices);
    }

    /**
     * {@code DELETE  /app-services/:id} : delete the "id" appServices.
     *
     * @param id the id of the appServices to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppServices(@PathVariable Long id) {
        log.debug("REST request to delete AppServices : {}", id);
        appServicesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
