package com.local.rkb.web.rest;

import com.local.rkb.domain.Websites;
import com.local.rkb.repository.WebsitesRepository;
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
 * REST controller for managing {@link com.local.rkb.domain.Websites}.
 */
@RestController
@RequestMapping("/api/websites")
@Transactional
public class WebsitesResource {

    private final Logger log = LoggerFactory.getLogger(WebsitesResource.class);

    private static final String ENTITY_NAME = "websites";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final WebsitesRepository websitesRepository;

    public WebsitesResource(WebsitesRepository websitesRepository) {
        this.websitesRepository = websitesRepository;
    }

    /**
     * {@code POST  /websites} : Create a new websites.
     *
     * @param websites the websites to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new websites, or with status {@code 400 (Bad Request)} if the websites has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Websites> createWebsites(@RequestBody Websites websites) throws URISyntaxException {
        log.debug("REST request to save Websites : {}", websites);
        if (websites.getId() != null) {
            throw new BadRequestAlertException("A new websites cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Websites result = websitesRepository.save(websites);
        return ResponseEntity
            .created(new URI("/api/websites/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /websites/:id} : Updates an existing websites.
     *
     * @param id the id of the websites to save.
     * @param websites the websites to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated websites,
     * or with status {@code 400 (Bad Request)} if the websites is not valid,
     * or with status {@code 500 (Internal Server Error)} if the websites couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Websites> updateWebsites(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Websites websites
    ) throws URISyntaxException {
        log.debug("REST request to update Websites : {}, {}", id, websites);
        if (websites.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, websites.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!websitesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Websites result = websitesRepository.save(websites);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, websites.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /websites/:id} : Partial updates given fields of an existing websites, field will ignore if it is null
     *
     * @param id the id of the websites to save.
     * @param websites the websites to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated websites,
     * or with status {@code 400 (Bad Request)} if the websites is not valid,
     * or with status {@code 404 (Not Found)} if the websites is not found,
     * or with status {@code 500 (Internal Server Error)} if the websites couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Websites> partialUpdateWebsites(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Websites websites
    ) throws URISyntaxException {
        log.debug("REST request to partial update Websites partially : {}, {}", id, websites);
        if (websites.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, websites.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!websitesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Websites> result = websitesRepository
            .findById(websites.getId())
            .map(existingWebsites -> {
                if (websites.getWebsite() != null) {
                    existingWebsites.setWebsite(websites.getWebsite());
                }
                if (websites.getWebsiteId() != null) {
                    existingWebsites.setWebsiteId(websites.getWebsiteId());
                }
                if (websites.getCls() != null) {
                    existingWebsites.setCls(websites.getCls());
                }
                if (websites.getPageViews() != null) {
                    existingWebsites.setPageViews(websites.getPageViews());
                }
                if (websites.getPageLoads() != null) {
                    existingWebsites.setPageLoads(websites.getPageLoads());
                }
                if (websites.getOnLoadTime() != null) {
                    existingWebsites.setOnLoadTime(websites.getOnLoadTime());
                }
                if (websites.getDate() != null) {
                    existingWebsites.setDate(websites.getDate());
                }

                return existingWebsites;
            })
            .map(websitesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, websites.getId().toString())
        );
    }

    /**
     * {@code GET  /websites} : get all the websites.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of websites in body.
     */
    @GetMapping("")
    public List<Websites> getAllWebsites() {
        log.debug("REST request to get all Websites");
        return websitesRepository.findAll();
    }

    /**
     * {@code GET  /websites/:id} : get the "id" websites.
     *
     * @param id the id of the websites to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the websites, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Websites> getWebsites(@PathVariable Long id) {
        log.debug("REST request to get Websites : {}", id);
        Optional<Websites> websites = websitesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(websites);
    }

    /**
     * {@code DELETE  /websites/:id} : delete the "id" websites.
     *
     * @param id the id of the websites to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWebsites(@PathVariable Long id) {
        log.debug("REST request to delete Websites : {}", id);
        websitesRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
