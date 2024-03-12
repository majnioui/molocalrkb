package com.local.rkb.web.rest;

import com.local.rkb.domain.InfraTopology;
import com.local.rkb.repository.InfraTopologyRepository;
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
 * REST controller for managing {@link com.local.rkb.domain.InfraTopology}.
 */
@RestController
@RequestMapping("/api/infra-topologies")
@Transactional
public class InfraTopologyResource {

    private final Logger log = LoggerFactory.getLogger(InfraTopologyResource.class);

    private static final String ENTITY_NAME = "infraTopology";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InfraTopologyRepository infraTopologyRepository;

    public InfraTopologyResource(InfraTopologyRepository infraTopologyRepository) {
        this.infraTopologyRepository = infraTopologyRepository;
    }

    /**
     * {@code POST  /infra-topologies} : Create a new infraTopology.
     *
     * @param infraTopology the infraTopology to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new infraTopology, or with status {@code 400 (Bad Request)} if the infraTopology has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<InfraTopology> createInfraTopology(@RequestBody InfraTopology infraTopology) throws URISyntaxException {
        log.debug("REST request to save InfraTopology : {}", infraTopology);
        if (infraTopology.getId() != null) {
            throw new BadRequestAlertException("A new infraTopology cannot already have an ID", ENTITY_NAME, "idexists");
        }
        InfraTopology result = infraTopologyRepository.save(infraTopology);
        return ResponseEntity
            .created(new URI("/api/infra-topologies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /infra-topologies/:id} : Updates an existing infraTopology.
     *
     * @param id the id of the infraTopology to save.
     * @param infraTopology the infraTopology to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated infraTopology,
     * or with status {@code 400 (Bad Request)} if the infraTopology is not valid,
     * or with status {@code 500 (Internal Server Error)} if the infraTopology couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<InfraTopology> updateInfraTopology(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody InfraTopology infraTopology
    ) throws URISyntaxException {
        log.debug("REST request to update InfraTopology : {}, {}", id, infraTopology);
        if (infraTopology.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, infraTopology.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!infraTopologyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        InfraTopology result = infraTopologyRepository.save(infraTopology);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, infraTopology.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /infra-topologies/:id} : Partial updates given fields of an existing infraTopology, field will ignore if it is null
     *
     * @param id the id of the infraTopology to save.
     * @param infraTopology the infraTopology to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated infraTopology,
     * or with status {@code 400 (Bad Request)} if the infraTopology is not valid,
     * or with status {@code 404 (Not Found)} if the infraTopology is not found,
     * or with status {@code 500 (Internal Server Error)} if the infraTopology couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<InfraTopology> partialUpdateInfraTopology(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody InfraTopology infraTopology
    ) throws URISyntaxException {
        log.debug("REST request to partial update InfraTopology partially : {}, {}", id, infraTopology);
        if (infraTopology.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, infraTopology.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!infraTopologyRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<InfraTopology> result = infraTopologyRepository
            .findById(infraTopology.getId())
            .map(existingInfraTopology -> {
                if (infraTopology.getPlugin() != null) {
                    existingInfraTopology.setPlugin(infraTopology.getPlugin());
                }
                if (infraTopology.getLabel() != null) {
                    existingInfraTopology.setLabel(infraTopology.getLabel());
                }
                if (infraTopology.getPluginId() != null) {
                    existingInfraTopology.setPluginId(infraTopology.getPluginId());
                }

                return existingInfraTopology;
            })
            .map(infraTopologyRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, infraTopology.getId().toString())
        );
    }

    /**
     * {@code GET  /infra-topologies} : get all the infraTopologies.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of infraTopologies in body.
     */
    @GetMapping("")
    public List<InfraTopology> getAllInfraTopologies() {
        log.debug("REST request to get all InfraTopologies");
        return infraTopologyRepository.findAll();
    }

    /**
     * {@code GET  /infra-topologies/:id} : get the "id" infraTopology.
     *
     * @param id the id of the infraTopology to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the infraTopology, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<InfraTopology> getInfraTopology(@PathVariable Long id) {
        log.debug("REST request to get InfraTopology : {}", id);
        Optional<InfraTopology> infraTopology = infraTopologyRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(infraTopology);
    }

    /**
     * {@code DELETE  /infra-topologies/:id} : delete the "id" infraTopology.
     *
     * @param id the id of the infraTopology to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInfraTopology(@PathVariable Long id) {
        log.debug("REST request to delete InfraTopology : {}", id);
        infraTopologyRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
