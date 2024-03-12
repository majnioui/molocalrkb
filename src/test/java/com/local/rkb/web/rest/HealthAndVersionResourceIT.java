package com.local.rkb.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.local.rkb.IntegrationTest;
import com.local.rkb.domain.HealthAndVersion;
import com.local.rkb.repository.HealthAndVersionRepository;
import jakarta.persistence.EntityManager;
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
 * Integration tests for the {@link HealthAndVersionResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class HealthAndVersionResourceIT {

    private static final String DEFAULT_VERSION = "AAAAAAAAAA";
    private static final String UPDATED_VERSION = "BBBBBBBBBB";

    private static final String DEFAULT_HEALTH = "AAAAAAAAAA";
    private static final String UPDATED_HEALTH = "BBBBBBBBBB";

    private static final String DEFAULT_HEALTH_MSG = "AAAAAAAAAA";
    private static final String UPDATED_HEALTH_MSG = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/health-and-versions";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private HealthAndVersionRepository healthAndVersionRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHealthAndVersionMockMvc;

    private HealthAndVersion healthAndVersion;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HealthAndVersion createEntity(EntityManager em) {
        HealthAndVersion healthAndVersion = new HealthAndVersion()
            .version(DEFAULT_VERSION)
            .health(DEFAULT_HEALTH)
            .healthMsg(DEFAULT_HEALTH_MSG);
        return healthAndVersion;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HealthAndVersion createUpdatedEntity(EntityManager em) {
        HealthAndVersion healthAndVersion = new HealthAndVersion()
            .version(UPDATED_VERSION)
            .health(UPDATED_HEALTH)
            .healthMsg(UPDATED_HEALTH_MSG);
        return healthAndVersion;
    }

    @BeforeEach
    public void initTest() {
        healthAndVersion = createEntity(em);
    }

    @Test
    @Transactional
    void createHealthAndVersion() throws Exception {
        int databaseSizeBeforeCreate = healthAndVersionRepository.findAll().size();
        // Create the HealthAndVersion
        restHealthAndVersionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(healthAndVersion))
            )
            .andExpect(status().isCreated());

        // Validate the HealthAndVersion in the database
        List<HealthAndVersion> healthAndVersionList = healthAndVersionRepository.findAll();
        assertThat(healthAndVersionList).hasSize(databaseSizeBeforeCreate + 1);
        HealthAndVersion testHealthAndVersion = healthAndVersionList.get(healthAndVersionList.size() - 1);
        assertThat(testHealthAndVersion.getVersion()).isEqualTo(DEFAULT_VERSION);
        assertThat(testHealthAndVersion.getHealth()).isEqualTo(DEFAULT_HEALTH);
        assertThat(testHealthAndVersion.getHealthMsg()).isEqualTo(DEFAULT_HEALTH_MSG);
    }

    @Test
    @Transactional
    void createHealthAndVersionWithExistingId() throws Exception {
        // Create the HealthAndVersion with an existing ID
        healthAndVersion.setId(1L);

        int databaseSizeBeforeCreate = healthAndVersionRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHealthAndVersionMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(healthAndVersion))
            )
            .andExpect(status().isBadRequest());

        // Validate the HealthAndVersion in the database
        List<HealthAndVersion> healthAndVersionList = healthAndVersionRepository.findAll();
        assertThat(healthAndVersionList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllHealthAndVersions() throws Exception {
        // Initialize the database
        healthAndVersionRepository.saveAndFlush(healthAndVersion);

        // Get all the healthAndVersionList
        restHealthAndVersionMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(healthAndVersion.getId().intValue())))
            .andExpect(jsonPath("$.[*].version").value(hasItem(DEFAULT_VERSION)))
            .andExpect(jsonPath("$.[*].health").value(hasItem(DEFAULT_HEALTH)))
            .andExpect(jsonPath("$.[*].healthMsg").value(hasItem(DEFAULT_HEALTH_MSG)));
    }

    @Test
    @Transactional
    void getHealthAndVersion() throws Exception {
        // Initialize the database
        healthAndVersionRepository.saveAndFlush(healthAndVersion);

        // Get the healthAndVersion
        restHealthAndVersionMockMvc
            .perform(get(ENTITY_API_URL_ID, healthAndVersion.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(healthAndVersion.getId().intValue()))
            .andExpect(jsonPath("$.version").value(DEFAULT_VERSION))
            .andExpect(jsonPath("$.health").value(DEFAULT_HEALTH))
            .andExpect(jsonPath("$.healthMsg").value(DEFAULT_HEALTH_MSG));
    }

    @Test
    @Transactional
    void getNonExistingHealthAndVersion() throws Exception {
        // Get the healthAndVersion
        restHealthAndVersionMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingHealthAndVersion() throws Exception {
        // Initialize the database
        healthAndVersionRepository.saveAndFlush(healthAndVersion);

        int databaseSizeBeforeUpdate = healthAndVersionRepository.findAll().size();

        // Update the healthAndVersion
        HealthAndVersion updatedHealthAndVersion = healthAndVersionRepository.findById(healthAndVersion.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedHealthAndVersion are not directly saved in db
        em.detach(updatedHealthAndVersion);
        updatedHealthAndVersion.version(UPDATED_VERSION).health(UPDATED_HEALTH).healthMsg(UPDATED_HEALTH_MSG);

        restHealthAndVersionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedHealthAndVersion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedHealthAndVersion))
            )
            .andExpect(status().isOk());

        // Validate the HealthAndVersion in the database
        List<HealthAndVersion> healthAndVersionList = healthAndVersionRepository.findAll();
        assertThat(healthAndVersionList).hasSize(databaseSizeBeforeUpdate);
        HealthAndVersion testHealthAndVersion = healthAndVersionList.get(healthAndVersionList.size() - 1);
        assertThat(testHealthAndVersion.getVersion()).isEqualTo(UPDATED_VERSION);
        assertThat(testHealthAndVersion.getHealth()).isEqualTo(UPDATED_HEALTH);
        assertThat(testHealthAndVersion.getHealthMsg()).isEqualTo(UPDATED_HEALTH_MSG);
    }

    @Test
    @Transactional
    void putNonExistingHealthAndVersion() throws Exception {
        int databaseSizeBeforeUpdate = healthAndVersionRepository.findAll().size();
        healthAndVersion.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHealthAndVersionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, healthAndVersion.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(healthAndVersion))
            )
            .andExpect(status().isBadRequest());

        // Validate the HealthAndVersion in the database
        List<HealthAndVersion> healthAndVersionList = healthAndVersionRepository.findAll();
        assertThat(healthAndVersionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchHealthAndVersion() throws Exception {
        int databaseSizeBeforeUpdate = healthAndVersionRepository.findAll().size();
        healthAndVersion.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHealthAndVersionMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(healthAndVersion))
            )
            .andExpect(status().isBadRequest());

        // Validate the HealthAndVersion in the database
        List<HealthAndVersion> healthAndVersionList = healthAndVersionRepository.findAll();
        assertThat(healthAndVersionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamHealthAndVersion() throws Exception {
        int databaseSizeBeforeUpdate = healthAndVersionRepository.findAll().size();
        healthAndVersion.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHealthAndVersionMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(healthAndVersion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the HealthAndVersion in the database
        List<HealthAndVersion> healthAndVersionList = healthAndVersionRepository.findAll();
        assertThat(healthAndVersionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateHealthAndVersionWithPatch() throws Exception {
        // Initialize the database
        healthAndVersionRepository.saveAndFlush(healthAndVersion);

        int databaseSizeBeforeUpdate = healthAndVersionRepository.findAll().size();

        // Update the healthAndVersion using partial update
        HealthAndVersion partialUpdatedHealthAndVersion = new HealthAndVersion();
        partialUpdatedHealthAndVersion.setId(healthAndVersion.getId());

        partialUpdatedHealthAndVersion.healthMsg(UPDATED_HEALTH_MSG);

        restHealthAndVersionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHealthAndVersion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHealthAndVersion))
            )
            .andExpect(status().isOk());

        // Validate the HealthAndVersion in the database
        List<HealthAndVersion> healthAndVersionList = healthAndVersionRepository.findAll();
        assertThat(healthAndVersionList).hasSize(databaseSizeBeforeUpdate);
        HealthAndVersion testHealthAndVersion = healthAndVersionList.get(healthAndVersionList.size() - 1);
        assertThat(testHealthAndVersion.getVersion()).isEqualTo(DEFAULT_VERSION);
        assertThat(testHealthAndVersion.getHealth()).isEqualTo(DEFAULT_HEALTH);
        assertThat(testHealthAndVersion.getHealthMsg()).isEqualTo(UPDATED_HEALTH_MSG);
    }

    @Test
    @Transactional
    void fullUpdateHealthAndVersionWithPatch() throws Exception {
        // Initialize the database
        healthAndVersionRepository.saveAndFlush(healthAndVersion);

        int databaseSizeBeforeUpdate = healthAndVersionRepository.findAll().size();

        // Update the healthAndVersion using partial update
        HealthAndVersion partialUpdatedHealthAndVersion = new HealthAndVersion();
        partialUpdatedHealthAndVersion.setId(healthAndVersion.getId());

        partialUpdatedHealthAndVersion.version(UPDATED_VERSION).health(UPDATED_HEALTH).healthMsg(UPDATED_HEALTH_MSG);

        restHealthAndVersionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHealthAndVersion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHealthAndVersion))
            )
            .andExpect(status().isOk());

        // Validate the HealthAndVersion in the database
        List<HealthAndVersion> healthAndVersionList = healthAndVersionRepository.findAll();
        assertThat(healthAndVersionList).hasSize(databaseSizeBeforeUpdate);
        HealthAndVersion testHealthAndVersion = healthAndVersionList.get(healthAndVersionList.size() - 1);
        assertThat(testHealthAndVersion.getVersion()).isEqualTo(UPDATED_VERSION);
        assertThat(testHealthAndVersion.getHealth()).isEqualTo(UPDATED_HEALTH);
        assertThat(testHealthAndVersion.getHealthMsg()).isEqualTo(UPDATED_HEALTH_MSG);
    }

    @Test
    @Transactional
    void patchNonExistingHealthAndVersion() throws Exception {
        int databaseSizeBeforeUpdate = healthAndVersionRepository.findAll().size();
        healthAndVersion.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHealthAndVersionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, healthAndVersion.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(healthAndVersion))
            )
            .andExpect(status().isBadRequest());

        // Validate the HealthAndVersion in the database
        List<HealthAndVersion> healthAndVersionList = healthAndVersionRepository.findAll();
        assertThat(healthAndVersionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchHealthAndVersion() throws Exception {
        int databaseSizeBeforeUpdate = healthAndVersionRepository.findAll().size();
        healthAndVersion.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHealthAndVersionMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(healthAndVersion))
            )
            .andExpect(status().isBadRequest());

        // Validate the HealthAndVersion in the database
        List<HealthAndVersion> healthAndVersionList = healthAndVersionRepository.findAll();
        assertThat(healthAndVersionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamHealthAndVersion() throws Exception {
        int databaseSizeBeforeUpdate = healthAndVersionRepository.findAll().size();
        healthAndVersion.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHealthAndVersionMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(healthAndVersion))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the HealthAndVersion in the database
        List<HealthAndVersion> healthAndVersionList = healthAndVersionRepository.findAll();
        assertThat(healthAndVersionList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteHealthAndVersion() throws Exception {
        // Initialize the database
        healthAndVersionRepository.saveAndFlush(healthAndVersion);

        int databaseSizeBeforeDelete = healthAndVersionRepository.findAll().size();

        // Delete the healthAndVersion
        restHealthAndVersionMockMvc
            .perform(delete(ENTITY_API_URL_ID, healthAndVersion.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<HealthAndVersion> healthAndVersionList = healthAndVersionRepository.findAll();
        assertThat(healthAndVersionList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
