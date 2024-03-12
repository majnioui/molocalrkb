package com.local.rkb.web.rest;

import com.local.rkb.domain.AgentIssues;
import com.local.rkb.repository.AgentIssuesRepository;
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
 * REST controller for managing {@link com.local.rkb.domain.AgentIssues}.
 */
@RestController
@RequestMapping("/api/agent-issues")
@Transactional
public class AgentIssuesResource {

    private final Logger log = LoggerFactory.getLogger(AgentIssuesResource.class);

    private static final String ENTITY_NAME = "agentIssues";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AgentIssuesRepository agentIssuesRepository;

    public AgentIssuesResource(AgentIssuesRepository agentIssuesRepository) {
        this.agentIssuesRepository = agentIssuesRepository;
    }

    /**
     * {@code POST  /agent-issues} : Create a new agentIssues.
     *
     * @param agentIssues the agentIssues to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new agentIssues, or with status {@code 400 (Bad Request)} if the agentIssues has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<AgentIssues> createAgentIssues(@RequestBody AgentIssues agentIssues) throws URISyntaxException {
        log.debug("REST request to save AgentIssues : {}", agentIssues);
        if (agentIssues.getId() != null) {
            throw new BadRequestAlertException("A new agentIssues cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AgentIssues result = agentIssuesRepository.save(agentIssues);
        return ResponseEntity
            .created(new URI("/api/agent-issues/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /agent-issues/:id} : Updates an existing agentIssues.
     *
     * @param id the id of the agentIssues to save.
     * @param agentIssues the agentIssues to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated agentIssues,
     * or with status {@code 400 (Bad Request)} if the agentIssues is not valid,
     * or with status {@code 500 (Internal Server Error)} if the agentIssues couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<AgentIssues> updateAgentIssues(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AgentIssues agentIssues
    ) throws URISyntaxException {
        log.debug("REST request to update AgentIssues : {}, {}", id, agentIssues);
        if (agentIssues.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, agentIssues.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!agentIssuesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AgentIssues result = agentIssuesRepository.save(agentIssues);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, agentIssues.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /agent-issues/:id} : Partial updates given fields of an existing agentIssues, field will ignore if it is null
     *
     * @param id the id of the agentIssues to save.
     * @param agentIssues the agentIssues to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated agentIssues,
     * or with status {@code 400 (Bad Request)} if the agentIssues is not valid,
     * or with status {@code 404 (Not Found)} if the agentIssues is not found,
     * or with status {@code 500 (Internal Server Error)} if the agentIssues couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AgentIssues> partialUpdateAgentIssues(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AgentIssues agentIssues
    ) throws URISyntaxException {
        log.debug("REST request to partial update AgentIssues partially : {}, {}", id, agentIssues);
        if (agentIssues.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, agentIssues.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!agentIssuesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AgentIssues> result = agentIssuesRepository
            .findById(agentIssues.getId())
            .map(existingAgentIssues -> {
                if (agentIssues.getType() != null) {
                    existingAgentIssues.setType(agentIssues.getType());
                }
                if (agentIssues.getState() != null) {
                    existingAgentIssues.setState(agentIssues.getState());
                }
                if (agentIssues.getProblem() != null) {
                    existingAgentIssues.setProblem(agentIssues.getProblem());
                }
                if (agentIssues.getDetail() != null) {
                    existingAgentIssues.setDetail(agentIssues.getDetail());
                }
                if (agentIssues.getSeverity() != null) {
                    existingAgentIssues.setSeverity(agentIssues.getSeverity());
                }
                if (agentIssues.getEntityName() != null) {
                    existingAgentIssues.setEntityName(agentIssues.getEntityName());
                }
                if (agentIssues.getEntityLabel() != null) {
                    existingAgentIssues.setEntityLabel(agentIssues.getEntityLabel());
                }
                if (agentIssues.getEntityType() != null) {
                    existingAgentIssues.setEntityType(agentIssues.getEntityType());
                }
                if (agentIssues.getFix() != null) {
                    existingAgentIssues.setFix(agentIssues.getFix());
                }

                return existingAgentIssues;
            })
            .map(agentIssuesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, agentIssues.getId().toString())
        );
    }

    /**
     * {@code GET  /agent-issues} : get all the agentIssues.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of agentIssues in body.
     */
    @GetMapping("")
    public List<AgentIssues> getAllAgentIssues() {
        log.debug("REST request to get all AgentIssues");
        return agentIssuesRepository.findAll();
    }

    /**
     * {@code GET  /agent-issues/:id} : get the "id" agentIssues.
     *
     * @param id the id of the agentIssues to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the agentIssues, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<AgentIssues> getAgentIssues(@PathVariable Long id) {
        log.debug("REST request to get AgentIssues : {}", id);
        Optional<AgentIssues> agentIssues = agentIssuesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(agentIssues);
    }

    /**
     * {@code DELETE  /agent-issues/:id} : delete the "id" agentIssues.
     *
     * @param id the id of the agentIssues to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAgentIssues(@PathVariable Long id) {
        log.debug("REST request to delete AgentIssues : {}", id);
        agentIssuesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
