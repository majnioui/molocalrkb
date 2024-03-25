package com.local.rkb.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.local.rkb.IntegrationTest;
import com.local.rkb.domain.Websites;
import com.local.rkb.repository.WebsitesRepository;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link WebsitesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class WebsitesResourceIT {

    private static final String DEFAULT_WEBSITE = "AAAAAAAAAA";
    private static final String UPDATED_WEBSITE = "BBBBBBBBBB";

    private static final String DEFAULT_WEBSITE_ID = "AAAAAAAAAA";
    private static final String UPDATED_WEBSITE_ID = "BBBBBBBBBB";

    private static final String DEFAULT_CLS = "AAAAAAAAAA";
    private static final String UPDATED_CLS = "BBBBBBBBBB";

    private static final String DEFAULT_PAGE_VIEWS = "AAAAAAAAAA";
    private static final String UPDATED_PAGE_VIEWS = "BBBBBBBBBB";

    private static final String DEFAULT_PAGE_LOADS = "AAAAAAAAAA";
    private static final String UPDATED_PAGE_LOADS = "BBBBBBBBBB";

    private static final String DEFAULT_ON_LOAD_TIME = "AAAAAAAAAA";
    private static final String UPDATED_ON_LOAD_TIME = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/websites";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private WebsitesRepository websitesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restWebsitesMockMvc;

    private Websites websites;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Websites createEntity(EntityManager em) {
        Websites websites = new Websites()
            .website(DEFAULT_WEBSITE)
            .websiteId(DEFAULT_WEBSITE_ID)
            .cls(DEFAULT_CLS)
            .pageViews(DEFAULT_PAGE_VIEWS)
            .pageLoads(DEFAULT_PAGE_LOADS)
            .onLoadTime(DEFAULT_ON_LOAD_TIME)
            .date(DEFAULT_DATE);
        return websites;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Websites createUpdatedEntity(EntityManager em) {
        Websites websites = new Websites()
            .website(UPDATED_WEBSITE)
            .websiteId(UPDATED_WEBSITE_ID)
            .cls(UPDATED_CLS)
            .pageViews(UPDATED_PAGE_VIEWS)
            .pageLoads(UPDATED_PAGE_LOADS)
            .onLoadTime(UPDATED_ON_LOAD_TIME)
            .date(UPDATED_DATE);
        return websites;
    }

    @BeforeEach
    public void initTest() {
        websites = createEntity(em);
    }

    @Test
    @Transactional
    void createWebsites() throws Exception {
        int databaseSizeBeforeCreate = websitesRepository.findAll().size();
        // Create the Websites
        restWebsitesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(websites)))
            .andExpect(status().isCreated());

        // Validate the Websites in the database
        List<Websites> websitesList = websitesRepository.findAll();
        assertThat(websitesList).hasSize(databaseSizeBeforeCreate + 1);
        Websites testWebsites = websitesList.get(websitesList.size() - 1);
        assertThat(testWebsites.getWebsite()).isEqualTo(DEFAULT_WEBSITE);
        assertThat(testWebsites.getWebsiteId()).isEqualTo(DEFAULT_WEBSITE_ID);
        assertThat(testWebsites.getCls()).isEqualTo(DEFAULT_CLS);
        assertThat(testWebsites.getPageViews()).isEqualTo(DEFAULT_PAGE_VIEWS);
        assertThat(testWebsites.getPageLoads()).isEqualTo(DEFAULT_PAGE_LOADS);
        assertThat(testWebsites.getOnLoadTime()).isEqualTo(DEFAULT_ON_LOAD_TIME);
        assertThat(testWebsites.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createWebsitesWithExistingId() throws Exception {
        // Create the Websites with an existing ID
        websites.setId(1L);

        int databaseSizeBeforeCreate = websitesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restWebsitesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(websites)))
            .andExpect(status().isBadRequest());

        // Validate the Websites in the database
        List<Websites> websitesList = websitesRepository.findAll();
        assertThat(websitesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllWebsites() throws Exception {
        // Initialize the database
        websitesRepository.saveAndFlush(websites);

        // Get all the websitesList
        restWebsitesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(websites.getId().intValue())))
            .andExpect(jsonPath("$.[*].website").value(hasItem(DEFAULT_WEBSITE)))
            .andExpect(jsonPath("$.[*].websiteId").value(hasItem(DEFAULT_WEBSITE_ID)))
            .andExpect(jsonPath("$.[*].cls").value(hasItem(DEFAULT_CLS)))
            .andExpect(jsonPath("$.[*].pageViews").value(hasItem(DEFAULT_PAGE_VIEWS)))
            .andExpect(jsonPath("$.[*].pageLoads").value(hasItem(DEFAULT_PAGE_LOADS)))
            .andExpect(jsonPath("$.[*].onLoadTime").value(hasItem(DEFAULT_ON_LOAD_TIME)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    void getWebsites() throws Exception {
        // Initialize the database
        websitesRepository.saveAndFlush(websites);

        // Get the websites
        restWebsitesMockMvc
            .perform(get(ENTITY_API_URL_ID, websites.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(websites.getId().intValue()))
            .andExpect(jsonPath("$.website").value(DEFAULT_WEBSITE))
            .andExpect(jsonPath("$.websiteId").value(DEFAULT_WEBSITE_ID))
            .andExpect(jsonPath("$.cls").value(DEFAULT_CLS))
            .andExpect(jsonPath("$.pageViews").value(DEFAULT_PAGE_VIEWS))
            .andExpect(jsonPath("$.pageLoads").value(DEFAULT_PAGE_LOADS))
            .andExpect(jsonPath("$.onLoadTime").value(DEFAULT_ON_LOAD_TIME))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingWebsites() throws Exception {
        // Get the websites
        restWebsitesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingWebsites() throws Exception {
        // Initialize the database
        websitesRepository.saveAndFlush(websites);

        int databaseSizeBeforeUpdate = websitesRepository.findAll().size();

        // Update the websites
        Websites updatedWebsites = websitesRepository.findById(websites.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedWebsites are not directly saved in db
        em.detach(updatedWebsites);
        updatedWebsites
            .website(UPDATED_WEBSITE)
            .websiteId(UPDATED_WEBSITE_ID)
            .cls(UPDATED_CLS)
            .pageViews(UPDATED_PAGE_VIEWS)
            .pageLoads(UPDATED_PAGE_LOADS)
            .onLoadTime(UPDATED_ON_LOAD_TIME)
            .date(UPDATED_DATE);

        restWebsitesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedWebsites.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedWebsites))
            )
            .andExpect(status().isOk());

        // Validate the Websites in the database
        List<Websites> websitesList = websitesRepository.findAll();
        assertThat(websitesList).hasSize(databaseSizeBeforeUpdate);
        Websites testWebsites = websitesList.get(websitesList.size() - 1);
        assertThat(testWebsites.getWebsite()).isEqualTo(UPDATED_WEBSITE);
        assertThat(testWebsites.getWebsiteId()).isEqualTo(UPDATED_WEBSITE_ID);
        assertThat(testWebsites.getCls()).isEqualTo(UPDATED_CLS);
        assertThat(testWebsites.getPageViews()).isEqualTo(UPDATED_PAGE_VIEWS);
        assertThat(testWebsites.getPageLoads()).isEqualTo(UPDATED_PAGE_LOADS);
        assertThat(testWebsites.getOnLoadTime()).isEqualTo(UPDATED_ON_LOAD_TIME);
        assertThat(testWebsites.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingWebsites() throws Exception {
        int databaseSizeBeforeUpdate = websitesRepository.findAll().size();
        websites.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWebsitesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, websites.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(websites))
            )
            .andExpect(status().isBadRequest());

        // Validate the Websites in the database
        List<Websites> websitesList = websitesRepository.findAll();
        assertThat(websitesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchWebsites() throws Exception {
        int databaseSizeBeforeUpdate = websitesRepository.findAll().size();
        websites.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWebsitesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(websites))
            )
            .andExpect(status().isBadRequest());

        // Validate the Websites in the database
        List<Websites> websitesList = websitesRepository.findAll();
        assertThat(websitesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamWebsites() throws Exception {
        int databaseSizeBeforeUpdate = websitesRepository.findAll().size();
        websites.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWebsitesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(websites)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Websites in the database
        List<Websites> websitesList = websitesRepository.findAll();
        assertThat(websitesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateWebsitesWithPatch() throws Exception {
        // Initialize the database
        websitesRepository.saveAndFlush(websites);

        int databaseSizeBeforeUpdate = websitesRepository.findAll().size();

        // Update the websites using partial update
        Websites partialUpdatedWebsites = new Websites();
        partialUpdatedWebsites.setId(websites.getId());

        partialUpdatedWebsites
            .website(UPDATED_WEBSITE)
            .websiteId(UPDATED_WEBSITE_ID)
            .cls(UPDATED_CLS)
            .onLoadTime(UPDATED_ON_LOAD_TIME)
            .date(UPDATED_DATE);

        restWebsitesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWebsites.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWebsites))
            )
            .andExpect(status().isOk());

        // Validate the Websites in the database
        List<Websites> websitesList = websitesRepository.findAll();
        assertThat(websitesList).hasSize(databaseSizeBeforeUpdate);
        Websites testWebsites = websitesList.get(websitesList.size() - 1);
        assertThat(testWebsites.getWebsite()).isEqualTo(UPDATED_WEBSITE);
        assertThat(testWebsites.getWebsiteId()).isEqualTo(UPDATED_WEBSITE_ID);
        assertThat(testWebsites.getCls()).isEqualTo(UPDATED_CLS);
        assertThat(testWebsites.getPageViews()).isEqualTo(DEFAULT_PAGE_VIEWS);
        assertThat(testWebsites.getPageLoads()).isEqualTo(DEFAULT_PAGE_LOADS);
        assertThat(testWebsites.getOnLoadTime()).isEqualTo(UPDATED_ON_LOAD_TIME);
        assertThat(testWebsites.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void fullUpdateWebsitesWithPatch() throws Exception {
        // Initialize the database
        websitesRepository.saveAndFlush(websites);

        int databaseSizeBeforeUpdate = websitesRepository.findAll().size();

        // Update the websites using partial update
        Websites partialUpdatedWebsites = new Websites();
        partialUpdatedWebsites.setId(websites.getId());

        partialUpdatedWebsites
            .website(UPDATED_WEBSITE)
            .websiteId(UPDATED_WEBSITE_ID)
            .cls(UPDATED_CLS)
            .pageViews(UPDATED_PAGE_VIEWS)
            .pageLoads(UPDATED_PAGE_LOADS)
            .onLoadTime(UPDATED_ON_LOAD_TIME)
            .date(UPDATED_DATE);

        restWebsitesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedWebsites.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedWebsites))
            )
            .andExpect(status().isOk());

        // Validate the Websites in the database
        List<Websites> websitesList = websitesRepository.findAll();
        assertThat(websitesList).hasSize(databaseSizeBeforeUpdate);
        Websites testWebsites = websitesList.get(websitesList.size() - 1);
        assertThat(testWebsites.getWebsite()).isEqualTo(UPDATED_WEBSITE);
        assertThat(testWebsites.getWebsiteId()).isEqualTo(UPDATED_WEBSITE_ID);
        assertThat(testWebsites.getCls()).isEqualTo(UPDATED_CLS);
        assertThat(testWebsites.getPageViews()).isEqualTo(UPDATED_PAGE_VIEWS);
        assertThat(testWebsites.getPageLoads()).isEqualTo(UPDATED_PAGE_LOADS);
        assertThat(testWebsites.getOnLoadTime()).isEqualTo(UPDATED_ON_LOAD_TIME);
        assertThat(testWebsites.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingWebsites() throws Exception {
        int databaseSizeBeforeUpdate = websitesRepository.findAll().size();
        websites.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restWebsitesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, websites.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(websites))
            )
            .andExpect(status().isBadRequest());

        // Validate the Websites in the database
        List<Websites> websitesList = websitesRepository.findAll();
        assertThat(websitesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchWebsites() throws Exception {
        int databaseSizeBeforeUpdate = websitesRepository.findAll().size();
        websites.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWebsitesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(websites))
            )
            .andExpect(status().isBadRequest());

        // Validate the Websites in the database
        List<Websites> websitesList = websitesRepository.findAll();
        assertThat(websitesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamWebsites() throws Exception {
        int databaseSizeBeforeUpdate = websitesRepository.findAll().size();
        websites.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restWebsitesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(websites)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Websites in the database
        List<Websites> websitesList = websitesRepository.findAll();
        assertThat(websitesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteWebsites() throws Exception {
        // Initialize the database
        websitesRepository.saveAndFlush(websites);

        int databaseSizeBeforeDelete = websitesRepository.findAll().size();

        // Delete the websites
        restWebsitesMockMvc
            .perform(delete(ENTITY_API_URL_ID, websites.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Websites> websitesList = websitesRepository.findAll();
        assertThat(websitesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
