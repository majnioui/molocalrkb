package com.local.rkb.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.local.rkb.IntegrationTest;
import com.local.rkb.domain.InfraTopology;
import com.local.rkb.repository.InfraTopologyRepository;
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
 * Integration tests for the {@link InfraTopologyResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class InfraTopologyResourceIT {

    private static final String DEFAULT_PLUGIN = "AAAAAAAAAA";
    private static final String UPDATED_PLUGIN = "BBBBBBBBBB";

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final String DEFAULT_PLUGIN_ID = "AAAAAAAAAA";
    private static final String UPDATED_PLUGIN_ID = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/infra-topologies";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private InfraTopologyRepository infraTopologyRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restInfraTopologyMockMvc;

    private InfraTopology infraTopology;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static InfraTopology createEntity(EntityManager em) {
        InfraTopology infraTopology = new InfraTopology().plugin(DEFAULT_PLUGIN).label(DEFAULT_LABEL).pluginId(DEFAULT_PLUGIN_ID);
        return infraTopology;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static InfraTopology createUpdatedEntity(EntityManager em) {
        InfraTopology infraTopology = new InfraTopology().plugin(UPDATED_PLUGIN).label(UPDATED_LABEL).pluginId(UPDATED_PLUGIN_ID);
        return infraTopology;
    }

    @BeforeEach
    public void initTest() {
        infraTopology = createEntity(em);
    }

    @Test
    @Transactional
    void createInfraTopology() throws Exception {
        int databaseSizeBeforeCreate = infraTopologyRepository.findAll().size();
        // Create the InfraTopology
        restInfraTopologyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(infraTopology)))
            .andExpect(status().isCreated());

        // Validate the InfraTopology in the database
        List<InfraTopology> infraTopologyList = infraTopologyRepository.findAll();
        assertThat(infraTopologyList).hasSize(databaseSizeBeforeCreate + 1);
        InfraTopology testInfraTopology = infraTopologyList.get(infraTopologyList.size() - 1);
        assertThat(testInfraTopology.getPlugin()).isEqualTo(DEFAULT_PLUGIN);
        assertThat(testInfraTopology.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testInfraTopology.getPluginId()).isEqualTo(DEFAULT_PLUGIN_ID);
    }

    @Test
    @Transactional
    void createInfraTopologyWithExistingId() throws Exception {
        // Create the InfraTopology with an existing ID
        infraTopology.setId(1L);

        int databaseSizeBeforeCreate = infraTopologyRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restInfraTopologyMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(infraTopology)))
            .andExpect(status().isBadRequest());

        // Validate the InfraTopology in the database
        List<InfraTopology> infraTopologyList = infraTopologyRepository.findAll();
        assertThat(infraTopologyList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllInfraTopologies() throws Exception {
        // Initialize the database
        infraTopologyRepository.saveAndFlush(infraTopology);

        // Get all the infraTopologyList
        restInfraTopologyMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(infraTopology.getId().intValue())))
            .andExpect(jsonPath("$.[*].plugin").value(hasItem(DEFAULT_PLUGIN)))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)))
            .andExpect(jsonPath("$.[*].pluginId").value(hasItem(DEFAULT_PLUGIN_ID)));
    }

    @Test
    @Transactional
    void getInfraTopology() throws Exception {
        // Initialize the database
        infraTopologyRepository.saveAndFlush(infraTopology);

        // Get the infraTopology
        restInfraTopologyMockMvc
            .perform(get(ENTITY_API_URL_ID, infraTopology.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(infraTopology.getId().intValue()))
            .andExpect(jsonPath("$.plugin").value(DEFAULT_PLUGIN))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL))
            .andExpect(jsonPath("$.pluginId").value(DEFAULT_PLUGIN_ID));
    }

    @Test
    @Transactional
    void getNonExistingInfraTopology() throws Exception {
        // Get the infraTopology
        restInfraTopologyMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingInfraTopology() throws Exception {
        // Initialize the database
        infraTopologyRepository.saveAndFlush(infraTopology);

        int databaseSizeBeforeUpdate = infraTopologyRepository.findAll().size();

        // Update the infraTopology
        InfraTopology updatedInfraTopology = infraTopologyRepository.findById(infraTopology.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedInfraTopology are not directly saved in db
        em.detach(updatedInfraTopology);
        updatedInfraTopology.plugin(UPDATED_PLUGIN).label(UPDATED_LABEL).pluginId(UPDATED_PLUGIN_ID);

        restInfraTopologyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedInfraTopology.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedInfraTopology))
            )
            .andExpect(status().isOk());

        // Validate the InfraTopology in the database
        List<InfraTopology> infraTopologyList = infraTopologyRepository.findAll();
        assertThat(infraTopologyList).hasSize(databaseSizeBeforeUpdate);
        InfraTopology testInfraTopology = infraTopologyList.get(infraTopologyList.size() - 1);
        assertThat(testInfraTopology.getPlugin()).isEqualTo(UPDATED_PLUGIN);
        assertThat(testInfraTopology.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testInfraTopology.getPluginId()).isEqualTo(UPDATED_PLUGIN_ID);
    }

    @Test
    @Transactional
    void putNonExistingInfraTopology() throws Exception {
        int databaseSizeBeforeUpdate = infraTopologyRepository.findAll().size();
        infraTopology.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInfraTopologyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, infraTopology.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(infraTopology))
            )
            .andExpect(status().isBadRequest());

        // Validate the InfraTopology in the database
        List<InfraTopology> infraTopologyList = infraTopologyRepository.findAll();
        assertThat(infraTopologyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchInfraTopology() throws Exception {
        int databaseSizeBeforeUpdate = infraTopologyRepository.findAll().size();
        infraTopology.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInfraTopologyMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(infraTopology))
            )
            .andExpect(status().isBadRequest());

        // Validate the InfraTopology in the database
        List<InfraTopology> infraTopologyList = infraTopologyRepository.findAll();
        assertThat(infraTopologyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamInfraTopology() throws Exception {
        int databaseSizeBeforeUpdate = infraTopologyRepository.findAll().size();
        infraTopology.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInfraTopologyMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(infraTopology)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the InfraTopology in the database
        List<InfraTopology> infraTopologyList = infraTopologyRepository.findAll();
        assertThat(infraTopologyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateInfraTopologyWithPatch() throws Exception {
        // Initialize the database
        infraTopologyRepository.saveAndFlush(infraTopology);

        int databaseSizeBeforeUpdate = infraTopologyRepository.findAll().size();

        // Update the infraTopology using partial update
        InfraTopology partialUpdatedInfraTopology = new InfraTopology();
        partialUpdatedInfraTopology.setId(infraTopology.getId());

        partialUpdatedInfraTopology.label(UPDATED_LABEL).pluginId(UPDATED_PLUGIN_ID);

        restInfraTopologyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInfraTopology.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInfraTopology))
            )
            .andExpect(status().isOk());

        // Validate the InfraTopology in the database
        List<InfraTopology> infraTopologyList = infraTopologyRepository.findAll();
        assertThat(infraTopologyList).hasSize(databaseSizeBeforeUpdate);
        InfraTopology testInfraTopology = infraTopologyList.get(infraTopologyList.size() - 1);
        assertThat(testInfraTopology.getPlugin()).isEqualTo(DEFAULT_PLUGIN);
        assertThat(testInfraTopology.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testInfraTopology.getPluginId()).isEqualTo(UPDATED_PLUGIN_ID);
    }

    @Test
    @Transactional
    void fullUpdateInfraTopologyWithPatch() throws Exception {
        // Initialize the database
        infraTopologyRepository.saveAndFlush(infraTopology);

        int databaseSizeBeforeUpdate = infraTopologyRepository.findAll().size();

        // Update the infraTopology using partial update
        InfraTopology partialUpdatedInfraTopology = new InfraTopology();
        partialUpdatedInfraTopology.setId(infraTopology.getId());

        partialUpdatedInfraTopology.plugin(UPDATED_PLUGIN).label(UPDATED_LABEL).pluginId(UPDATED_PLUGIN_ID);

        restInfraTopologyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInfraTopology.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInfraTopology))
            )
            .andExpect(status().isOk());

        // Validate the InfraTopology in the database
        List<InfraTopology> infraTopologyList = infraTopologyRepository.findAll();
        assertThat(infraTopologyList).hasSize(databaseSizeBeforeUpdate);
        InfraTopology testInfraTopology = infraTopologyList.get(infraTopologyList.size() - 1);
        assertThat(testInfraTopology.getPlugin()).isEqualTo(UPDATED_PLUGIN);
        assertThat(testInfraTopology.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testInfraTopology.getPluginId()).isEqualTo(UPDATED_PLUGIN_ID);
    }

    @Test
    @Transactional
    void patchNonExistingInfraTopology() throws Exception {
        int databaseSizeBeforeUpdate = infraTopologyRepository.findAll().size();
        infraTopology.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInfraTopologyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, infraTopology.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(infraTopology))
            )
            .andExpect(status().isBadRequest());

        // Validate the InfraTopology in the database
        List<InfraTopology> infraTopologyList = infraTopologyRepository.findAll();
        assertThat(infraTopologyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchInfraTopology() throws Exception {
        int databaseSizeBeforeUpdate = infraTopologyRepository.findAll().size();
        infraTopology.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInfraTopologyMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(infraTopology))
            )
            .andExpect(status().isBadRequest());

        // Validate the InfraTopology in the database
        List<InfraTopology> infraTopologyList = infraTopologyRepository.findAll();
        assertThat(infraTopologyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamInfraTopology() throws Exception {
        int databaseSizeBeforeUpdate = infraTopologyRepository.findAll().size();
        infraTopology.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInfraTopologyMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(infraTopology))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the InfraTopology in the database
        List<InfraTopology> infraTopologyList = infraTopologyRepository.findAll();
        assertThat(infraTopologyList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteInfraTopology() throws Exception {
        // Initialize the database
        infraTopologyRepository.saveAndFlush(infraTopology);

        int databaseSizeBeforeDelete = infraTopologyRepository.findAll().size();

        // Delete the infraTopology
        restInfraTopologyMockMvc
            .perform(delete(ENTITY_API_URL_ID, infraTopology.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<InfraTopology> infraTopologyList = infraTopologyRepository.findAll();
        assertThat(infraTopologyList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
