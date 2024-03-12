package com.local.rkb.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.local.rkb.IntegrationTest;
import com.local.rkb.domain.InstalledSoftware;
import com.local.rkb.repository.InstalledSoftwareRepository;
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
 * Integration tests for the {@link InstalledSoftwareResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class InstalledSoftwareResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_VERSION = "AAAAAAAAAA";
    private static final String UPDATED_VERSION = "BBBBBBBBBB";

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_USED_BY = "AAAAAAAAAA";
    private static final String UPDATED_USED_BY = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/installed-softwares";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private InstalledSoftwareRepository installedSoftwareRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restInstalledSoftwareMockMvc;

    private InstalledSoftware installedSoftware;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static InstalledSoftware createEntity(EntityManager em) {
        InstalledSoftware installedSoftware = new InstalledSoftware()
            .name(DEFAULT_NAME)
            .version(DEFAULT_VERSION)
            .type(DEFAULT_TYPE)
            .usedBy(DEFAULT_USED_BY);
        return installedSoftware;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static InstalledSoftware createUpdatedEntity(EntityManager em) {
        InstalledSoftware installedSoftware = new InstalledSoftware()
            .name(UPDATED_NAME)
            .version(UPDATED_VERSION)
            .type(UPDATED_TYPE)
            .usedBy(UPDATED_USED_BY);
        return installedSoftware;
    }

    @BeforeEach
    public void initTest() {
        installedSoftware = createEntity(em);
    }

    @Test
    @Transactional
    void createInstalledSoftware() throws Exception {
        int databaseSizeBeforeCreate = installedSoftwareRepository.findAll().size();
        // Create the InstalledSoftware
        restInstalledSoftwareMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(installedSoftware))
            )
            .andExpect(status().isCreated());

        // Validate the InstalledSoftware in the database
        List<InstalledSoftware> installedSoftwareList = installedSoftwareRepository.findAll();
        assertThat(installedSoftwareList).hasSize(databaseSizeBeforeCreate + 1);
        InstalledSoftware testInstalledSoftware = installedSoftwareList.get(installedSoftwareList.size() - 1);
        assertThat(testInstalledSoftware.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testInstalledSoftware.getVersion()).isEqualTo(DEFAULT_VERSION);
        assertThat(testInstalledSoftware.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testInstalledSoftware.getUsedBy()).isEqualTo(DEFAULT_USED_BY);
    }

    @Test
    @Transactional
    void createInstalledSoftwareWithExistingId() throws Exception {
        // Create the InstalledSoftware with an existing ID
        installedSoftware.setId(1L);

        int databaseSizeBeforeCreate = installedSoftwareRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restInstalledSoftwareMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(installedSoftware))
            )
            .andExpect(status().isBadRequest());

        // Validate the InstalledSoftware in the database
        List<InstalledSoftware> installedSoftwareList = installedSoftwareRepository.findAll();
        assertThat(installedSoftwareList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllInstalledSoftwares() throws Exception {
        // Initialize the database
        installedSoftwareRepository.saveAndFlush(installedSoftware);

        // Get all the installedSoftwareList
        restInstalledSoftwareMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(installedSoftware.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].version").value(hasItem(DEFAULT_VERSION)))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].usedBy").value(hasItem(DEFAULT_USED_BY)));
    }

    @Test
    @Transactional
    void getInstalledSoftware() throws Exception {
        // Initialize the database
        installedSoftwareRepository.saveAndFlush(installedSoftware);

        // Get the installedSoftware
        restInstalledSoftwareMockMvc
            .perform(get(ENTITY_API_URL_ID, installedSoftware.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(installedSoftware.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.version").value(DEFAULT_VERSION))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.usedBy").value(DEFAULT_USED_BY));
    }

    @Test
    @Transactional
    void getNonExistingInstalledSoftware() throws Exception {
        // Get the installedSoftware
        restInstalledSoftwareMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingInstalledSoftware() throws Exception {
        // Initialize the database
        installedSoftwareRepository.saveAndFlush(installedSoftware);

        int databaseSizeBeforeUpdate = installedSoftwareRepository.findAll().size();

        // Update the installedSoftware
        InstalledSoftware updatedInstalledSoftware = installedSoftwareRepository.findById(installedSoftware.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedInstalledSoftware are not directly saved in db
        em.detach(updatedInstalledSoftware);
        updatedInstalledSoftware.name(UPDATED_NAME).version(UPDATED_VERSION).type(UPDATED_TYPE).usedBy(UPDATED_USED_BY);

        restInstalledSoftwareMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedInstalledSoftware.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedInstalledSoftware))
            )
            .andExpect(status().isOk());

        // Validate the InstalledSoftware in the database
        List<InstalledSoftware> installedSoftwareList = installedSoftwareRepository.findAll();
        assertThat(installedSoftwareList).hasSize(databaseSizeBeforeUpdate);
        InstalledSoftware testInstalledSoftware = installedSoftwareList.get(installedSoftwareList.size() - 1);
        assertThat(testInstalledSoftware.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testInstalledSoftware.getVersion()).isEqualTo(UPDATED_VERSION);
        assertThat(testInstalledSoftware.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testInstalledSoftware.getUsedBy()).isEqualTo(UPDATED_USED_BY);
    }

    @Test
    @Transactional
    void putNonExistingInstalledSoftware() throws Exception {
        int databaseSizeBeforeUpdate = installedSoftwareRepository.findAll().size();
        installedSoftware.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInstalledSoftwareMockMvc
            .perform(
                put(ENTITY_API_URL_ID, installedSoftware.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(installedSoftware))
            )
            .andExpect(status().isBadRequest());

        // Validate the InstalledSoftware in the database
        List<InstalledSoftware> installedSoftwareList = installedSoftwareRepository.findAll();
        assertThat(installedSoftwareList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchInstalledSoftware() throws Exception {
        int databaseSizeBeforeUpdate = installedSoftwareRepository.findAll().size();
        installedSoftware.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInstalledSoftwareMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(installedSoftware))
            )
            .andExpect(status().isBadRequest());

        // Validate the InstalledSoftware in the database
        List<InstalledSoftware> installedSoftwareList = installedSoftwareRepository.findAll();
        assertThat(installedSoftwareList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamInstalledSoftware() throws Exception {
        int databaseSizeBeforeUpdate = installedSoftwareRepository.findAll().size();
        installedSoftware.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInstalledSoftwareMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(installedSoftware))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the InstalledSoftware in the database
        List<InstalledSoftware> installedSoftwareList = installedSoftwareRepository.findAll();
        assertThat(installedSoftwareList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateInstalledSoftwareWithPatch() throws Exception {
        // Initialize the database
        installedSoftwareRepository.saveAndFlush(installedSoftware);

        int databaseSizeBeforeUpdate = installedSoftwareRepository.findAll().size();

        // Update the installedSoftware using partial update
        InstalledSoftware partialUpdatedInstalledSoftware = new InstalledSoftware();
        partialUpdatedInstalledSoftware.setId(installedSoftware.getId());

        partialUpdatedInstalledSoftware.version(UPDATED_VERSION).type(UPDATED_TYPE);

        restInstalledSoftwareMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInstalledSoftware.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInstalledSoftware))
            )
            .andExpect(status().isOk());

        // Validate the InstalledSoftware in the database
        List<InstalledSoftware> installedSoftwareList = installedSoftwareRepository.findAll();
        assertThat(installedSoftwareList).hasSize(databaseSizeBeforeUpdate);
        InstalledSoftware testInstalledSoftware = installedSoftwareList.get(installedSoftwareList.size() - 1);
        assertThat(testInstalledSoftware.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testInstalledSoftware.getVersion()).isEqualTo(UPDATED_VERSION);
        assertThat(testInstalledSoftware.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testInstalledSoftware.getUsedBy()).isEqualTo(DEFAULT_USED_BY);
    }

    @Test
    @Transactional
    void fullUpdateInstalledSoftwareWithPatch() throws Exception {
        // Initialize the database
        installedSoftwareRepository.saveAndFlush(installedSoftware);

        int databaseSizeBeforeUpdate = installedSoftwareRepository.findAll().size();

        // Update the installedSoftware using partial update
        InstalledSoftware partialUpdatedInstalledSoftware = new InstalledSoftware();
        partialUpdatedInstalledSoftware.setId(installedSoftware.getId());

        partialUpdatedInstalledSoftware.name(UPDATED_NAME).version(UPDATED_VERSION).type(UPDATED_TYPE).usedBy(UPDATED_USED_BY);

        restInstalledSoftwareMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInstalledSoftware.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInstalledSoftware))
            )
            .andExpect(status().isOk());

        // Validate the InstalledSoftware in the database
        List<InstalledSoftware> installedSoftwareList = installedSoftwareRepository.findAll();
        assertThat(installedSoftwareList).hasSize(databaseSizeBeforeUpdate);
        InstalledSoftware testInstalledSoftware = installedSoftwareList.get(installedSoftwareList.size() - 1);
        assertThat(testInstalledSoftware.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testInstalledSoftware.getVersion()).isEqualTo(UPDATED_VERSION);
        assertThat(testInstalledSoftware.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testInstalledSoftware.getUsedBy()).isEqualTo(UPDATED_USED_BY);
    }

    @Test
    @Transactional
    void patchNonExistingInstalledSoftware() throws Exception {
        int databaseSizeBeforeUpdate = installedSoftwareRepository.findAll().size();
        installedSoftware.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInstalledSoftwareMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, installedSoftware.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(installedSoftware))
            )
            .andExpect(status().isBadRequest());

        // Validate the InstalledSoftware in the database
        List<InstalledSoftware> installedSoftwareList = installedSoftwareRepository.findAll();
        assertThat(installedSoftwareList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchInstalledSoftware() throws Exception {
        int databaseSizeBeforeUpdate = installedSoftwareRepository.findAll().size();
        installedSoftware.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInstalledSoftwareMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(installedSoftware))
            )
            .andExpect(status().isBadRequest());

        // Validate the InstalledSoftware in the database
        List<InstalledSoftware> installedSoftwareList = installedSoftwareRepository.findAll();
        assertThat(installedSoftwareList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamInstalledSoftware() throws Exception {
        int databaseSizeBeforeUpdate = installedSoftwareRepository.findAll().size();
        installedSoftware.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInstalledSoftwareMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(installedSoftware))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the InstalledSoftware in the database
        List<InstalledSoftware> installedSoftwareList = installedSoftwareRepository.findAll();
        assertThat(installedSoftwareList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteInstalledSoftware() throws Exception {
        // Initialize the database
        installedSoftwareRepository.saveAndFlush(installedSoftware);

        int databaseSizeBeforeDelete = installedSoftwareRepository.findAll().size();

        // Delete the installedSoftware
        restInstalledSoftwareMockMvc
            .perform(delete(ENTITY_API_URL_ID, installedSoftware.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<InstalledSoftware> installedSoftwareList = installedSoftwareRepository.findAll();
        assertThat(installedSoftwareList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
