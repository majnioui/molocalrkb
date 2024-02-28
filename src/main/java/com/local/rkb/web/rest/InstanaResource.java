package com.local.rkb.web.rest;

import com.local.rkb.domain.Instana;
import com.local.rkb.repository.InstanaRepository;
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
 * REST controller for managing {@link com.local.rkb.domain.Instana}.
 */
@RestController
@RequestMapping("/api/instanas")
@Transactional
public class InstanaResource {

    private final Logger log = LoggerFactory.getLogger(InstanaResource.class);

    private static final String ENTITY_NAME = "instana";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final InstanaRepository instanaRepository;

    public InstanaResource(InstanaRepository instanaRepository) {
        this.instanaRepository = instanaRepository;
    }

    /**
     * {@code POST  /instanas} : Create a new instana.
     *
     * @param instana the instana to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new instana, or with status {@code 400 (Bad Request)} if the instana has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Instana> createInstana(@RequestBody Instana instana) throws URISyntaxException {
        log.debug("REST request to save Instana : {}", instana);
        if (instana.getId() != null) {
            throw new BadRequestAlertException("A new instana cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Instana result = instanaRepository.save(instana);
        return ResponseEntity
            .created(new URI("/api/instanas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /instanas/:id} : Updates an existing instana.
     *
     * @param id the id of the instana to save.
     * @param instana the instana to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated instana,
     * or with status {@code 400 (Bad Request)} if the instana is not valid,
     * or with status {@code 500 (Internal Server Error)} if the instana couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Instana> updateInstana(@PathVariable(value = "id", required = false) final Long id, @RequestBody Instana instana)
        throws URISyntaxException {
        log.debug("REST request to update Instana : {}, {}", id, instana);
        if (instana.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, instana.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!instanaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Instana result = instanaRepository.save(instana);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, instana.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /instanas/:id} : Partial updates given fields of an existing instana, field will ignore if it is null
     *
     * @param id the id of the instana to save.
     * @param instana the instana to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated instana,
     * or with status {@code 400 (Bad Request)} if the instana is not valid,
     * or with status {@code 404 (Not Found)} if the instana is not found,
     * or with status {@code 500 (Internal Server Error)} if the instana couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Instana> partialUpdateInstana(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Instana instana
    ) throws URISyntaxException {
        log.debug("REST request to partial update Instana partially : {}, {}", id, instana);
        if (instana.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, instana.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!instanaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Instana> result = instanaRepository
            .findById(instana.getId())
            .map(existingInstana -> {
                if (instana.getApitoken() != null) {
                    existingInstana.setApitoken(instana.getApitoken());
                }
                if (instana.getBaseurl() != null) {
                    existingInstana.setBaseurl(instana.getBaseurl());
                }

                return existingInstana;
            })
            .map(instanaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, instana.getId().toString())
        );
    }

    /**
     * {@code GET  /instanas} : get all the instanas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of instanas in body.
     */
    @GetMapping("")
    public List<Instana> getAllInstanas() {
        log.debug("REST request to get all Instanas");
        return instanaRepository.findAll();
    }

    /**
     * {@code GET  /instanas/:id} : get the "id" instana.
     *
     * @param id the id of the instana to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the instana, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Instana> getInstana(@PathVariable Long id) {
        log.debug("REST request to get Instana : {}", id);
        Optional<Instana> instana = instanaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(instana);
    }

    /**
     * {@code DELETE  /instanas/:id} : delete the "id" instana.
     *
     * @param id the id of the instana to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInstana(@PathVariable Long id) {
        log.debug("REST request to delete Instana : {}", id);
        instanaRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
