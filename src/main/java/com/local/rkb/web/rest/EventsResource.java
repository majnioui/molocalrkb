package com.local.rkb.web.rest;

import com.local.rkb.domain.Events;
import com.local.rkb.repository.EventsRepository;
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
 * REST controller for managing {@link com.local.rkb.domain.Events}.
 */
@RestController
@RequestMapping("/api/events")
@Transactional
public class EventsResource {

    private final Logger log = LoggerFactory.getLogger(EventsResource.class);

    private static final String ENTITY_NAME = "events";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EventsRepository eventsRepository;

    public EventsResource(EventsRepository eventsRepository) {
        this.eventsRepository = eventsRepository;
    }

    /**
     * {@code POST  /events} : Create a new events.
     *
     * @param events the events to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new events, or with status {@code 400 (Bad Request)} if the events has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Events> createEvents(@RequestBody Events events) throws URISyntaxException {
        log.debug("REST request to save Events : {}", events);
        if (events.getId() != null) {
            throw new BadRequestAlertException("A new events cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Events result = eventsRepository.save(events);
        return ResponseEntity
            .created(new URI("/api/events/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /events/:id} : Updates an existing events.
     *
     * @param id the id of the events to save.
     * @param events the events to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated events,
     * or with status {@code 400 (Bad Request)} if the events is not valid,
     * or with status {@code 500 (Internal Server Error)} if the events couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Events> updateEvents(@PathVariable(value = "id", required = false) final Long id, @RequestBody Events events)
        throws URISyntaxException {
        log.debug("REST request to update Events : {}, {}", id, events);
        if (events.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, events.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Events result = eventsRepository.save(events);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, events.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /events/:id} : Partial updates given fields of an existing events, field will ignore if it is null
     *
     * @param id the id of the events to save.
     * @param events the events to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated events,
     * or with status {@code 400 (Bad Request)} if the events is not valid,
     * or with status {@code 404 (Not Found)} if the events is not found,
     * or with status {@code 500 (Internal Server Error)} if the events couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Events> partialUpdateEvents(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Events events
    ) throws URISyntaxException {
        log.debug("REST request to partial update Events partially : {}, {}", id, events);
        if (events.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, events.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!eventsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Events> result = eventsRepository
            .findById(events.getId())
            .map(existingEvents -> {
                if (events.getType() != null) {
                    existingEvents.setType(events.getType());
                }
                if (events.getState() != null) {
                    existingEvents.setState(events.getState());
                }
                if (events.getProblem() != null) {
                    existingEvents.setProblem(events.getProblem());
                }
                if (events.getDetail() != null) {
                    existingEvents.setDetail(events.getDetail());
                }
                if (events.getSeverity() != null) {
                    existingEvents.setSeverity(events.getSeverity());
                }
                if (events.getEntityName() != null) {
                    existingEvents.setEntityName(events.getEntityName());
                }
                if (events.getEntityLabel() != null) {
                    existingEvents.setEntityLabel(events.getEntityLabel());
                }
                if (events.getEntityType() != null) {
                    existingEvents.setEntityType(events.getEntityType());
                }
                if (events.getFix() != null) {
                    existingEvents.setFix(events.getFix());
                }
                if (events.getDate() != null) {
                    existingEvents.setDate(events.getDate());
                }

                return existingEvents;
            })
            .map(eventsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, events.getId().toString())
        );
    }

    /**
     * {@code GET  /events} : get all the events.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of events in body.
     */
    @GetMapping("")
    public List<Events> getAllEvents() {
        log.debug("REST request to get all Events");
        return eventsRepository.findAll();
    }

    /**
     * {@code GET  /events/:id} : get the "id" events.
     *
     * @param id the id of the events to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the events, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Events> getEvents(@PathVariable Long id) {
        log.debug("REST request to get Events : {}", id);
        Optional<Events> events = eventsRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(events);
    }

    /**
     * {@code DELETE  /events/:id} : delete the "id" events.
     *
     * @param id the id of the events to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvents(@PathVariable Long id) {
        log.debug("REST request to delete Events : {}", id);
        eventsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
