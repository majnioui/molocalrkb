package com.local.rkb.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.local.rkb.IntegrationTest;
import com.local.rkb.domain.AgentIssues;
import com.local.rkb.repository.AgentIssuesRepository;
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
 * Integration tests for the {@link AgentIssuesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AgentIssuesResourceIT {

    private static final String DEFAULT_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_STATE = "AAAAAAAAAA";
    private static final String UPDATED_STATE = "BBBBBBBBBB";

    private static final String DEFAULT_PROBLEM = "AAAAAAAAAA";
    private static final String UPDATED_PROBLEM = "BBBBBBBBBB";

    private static final String DEFAULT_DETAIL = "AAAAAAAAAA";
    private static final String UPDATED_DETAIL = "BBBBBBBBBB";

    private static final String DEFAULT_SEVERITY = "AAAAAAAAAA";
    private static final String UPDATED_SEVERITY = "BBBBBBBBBB";

    private static final String DEFAULT_ENTITY_NAME = "AAAAAAAAAA";
    private static final String UPDATED_ENTITY_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_ENTITY_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_ENTITY_LABEL = "BBBBBBBBBB";

    private static final String DEFAULT_ENTITY_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_ENTITY_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_FIX = "AAAAAAAAAA";
    private static final String UPDATED_FIX = "BBBBBBBBBB";

    private static final Instant DEFAULT_AT_TIME = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_AT_TIME = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/agent-issues";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AgentIssuesRepository agentIssuesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAgentIssuesMockMvc;

    private AgentIssues agentIssues;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AgentIssues createEntity(EntityManager em) {
        AgentIssues agentIssues = new AgentIssues()
            .type(DEFAULT_TYPE)
            .state(DEFAULT_STATE)
            .problem(DEFAULT_PROBLEM)
            .detail(DEFAULT_DETAIL)
            .severity(DEFAULT_SEVERITY)
            .entityName(DEFAULT_ENTITY_NAME)
            .entityLabel(DEFAULT_ENTITY_LABEL)
            .entityType(DEFAULT_ENTITY_TYPE)
            .fix(DEFAULT_FIX)
            .atTime(DEFAULT_AT_TIME);
        return agentIssues;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AgentIssues createUpdatedEntity(EntityManager em) {
        AgentIssues agentIssues = new AgentIssues()
            .type(UPDATED_TYPE)
            .state(UPDATED_STATE)
            .problem(UPDATED_PROBLEM)
            .detail(UPDATED_DETAIL)
            .severity(UPDATED_SEVERITY)
            .entityName(UPDATED_ENTITY_NAME)
            .entityLabel(UPDATED_ENTITY_LABEL)
            .entityType(UPDATED_ENTITY_TYPE)
            .fix(UPDATED_FIX)
            .atTime(UPDATED_AT_TIME);
        return agentIssues;
    }

    @BeforeEach
    public void initTest() {
        agentIssues = createEntity(em);
    }

    @Test
    @Transactional
    void createAgentIssues() throws Exception {
        int databaseSizeBeforeCreate = agentIssuesRepository.findAll().size();
        // Create the AgentIssues
        restAgentIssuesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agentIssues)))
            .andExpect(status().isCreated());

        // Validate the AgentIssues in the database
        List<AgentIssues> agentIssuesList = agentIssuesRepository.findAll();
        assertThat(agentIssuesList).hasSize(databaseSizeBeforeCreate + 1);
        AgentIssues testAgentIssues = agentIssuesList.get(agentIssuesList.size() - 1);
        assertThat(testAgentIssues.getType()).isEqualTo(DEFAULT_TYPE);
        assertThat(testAgentIssues.getState()).isEqualTo(DEFAULT_STATE);
        assertThat(testAgentIssues.getProblem()).isEqualTo(DEFAULT_PROBLEM);
        assertThat(testAgentIssues.getDetail()).isEqualTo(DEFAULT_DETAIL);
        assertThat(testAgentIssues.getSeverity()).isEqualTo(DEFAULT_SEVERITY);
        assertThat(testAgentIssues.getEntityName()).isEqualTo(DEFAULT_ENTITY_NAME);
        assertThat(testAgentIssues.getEntityLabel()).isEqualTo(DEFAULT_ENTITY_LABEL);
        assertThat(testAgentIssues.getEntityType()).isEqualTo(DEFAULT_ENTITY_TYPE);
        assertThat(testAgentIssues.getFix()).isEqualTo(DEFAULT_FIX);
        assertThat(testAgentIssues.getAtTime()).isEqualTo(DEFAULT_AT_TIME);
    }

    @Test
    @Transactional
    void createAgentIssuesWithExistingId() throws Exception {
        // Create the AgentIssues with an existing ID
        agentIssues.setId(1L);

        int databaseSizeBeforeCreate = agentIssuesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAgentIssuesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agentIssues)))
            .andExpect(status().isBadRequest());

        // Validate the AgentIssues in the database
        List<AgentIssues> agentIssuesList = agentIssuesRepository.findAll();
        assertThat(agentIssuesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAgentIssues() throws Exception {
        // Initialize the database
        agentIssuesRepository.saveAndFlush(agentIssues);

        // Get all the agentIssuesList
        restAgentIssuesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(agentIssues.getId().intValue())))
            .andExpect(jsonPath("$.[*].type").value(hasItem(DEFAULT_TYPE)))
            .andExpect(jsonPath("$.[*].state").value(hasItem(DEFAULT_STATE)))
            .andExpect(jsonPath("$.[*].problem").value(hasItem(DEFAULT_PROBLEM)))
            .andExpect(jsonPath("$.[*].detail").value(hasItem(DEFAULT_DETAIL)))
            .andExpect(jsonPath("$.[*].severity").value(hasItem(DEFAULT_SEVERITY)))
            .andExpect(jsonPath("$.[*].entityName").value(hasItem(DEFAULT_ENTITY_NAME)))
            .andExpect(jsonPath("$.[*].entityLabel").value(hasItem(DEFAULT_ENTITY_LABEL)))
            .andExpect(jsonPath("$.[*].entityType").value(hasItem(DEFAULT_ENTITY_TYPE)))
            .andExpect(jsonPath("$.[*].fix").value(hasItem(DEFAULT_FIX)))
            .andExpect(jsonPath("$.[*].atTime").value(hasItem(DEFAULT_AT_TIME.toString())));
    }

    @Test
    @Transactional
    void getAgentIssues() throws Exception {
        // Initialize the database
        agentIssuesRepository.saveAndFlush(agentIssues);

        // Get the agentIssues
        restAgentIssuesMockMvc
            .perform(get(ENTITY_API_URL_ID, agentIssues.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(agentIssues.getId().intValue()))
            .andExpect(jsonPath("$.type").value(DEFAULT_TYPE))
            .andExpect(jsonPath("$.state").value(DEFAULT_STATE))
            .andExpect(jsonPath("$.problem").value(DEFAULT_PROBLEM))
            .andExpect(jsonPath("$.detail").value(DEFAULT_DETAIL))
            .andExpect(jsonPath("$.severity").value(DEFAULT_SEVERITY))
            .andExpect(jsonPath("$.entityName").value(DEFAULT_ENTITY_NAME))
            .andExpect(jsonPath("$.entityLabel").value(DEFAULT_ENTITY_LABEL))
            .andExpect(jsonPath("$.entityType").value(DEFAULT_ENTITY_TYPE))
            .andExpect(jsonPath("$.fix").value(DEFAULT_FIX))
            .andExpect(jsonPath("$.atTime").value(DEFAULT_AT_TIME.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAgentIssues() throws Exception {
        // Get the agentIssues
        restAgentIssuesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAgentIssues() throws Exception {
        // Initialize the database
        agentIssuesRepository.saveAndFlush(agentIssues);

        int databaseSizeBeforeUpdate = agentIssuesRepository.findAll().size();

        // Update the agentIssues
        AgentIssues updatedAgentIssues = agentIssuesRepository.findById(agentIssues.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAgentIssues are not directly saved in db
        em.detach(updatedAgentIssues);
        updatedAgentIssues
            .type(UPDATED_TYPE)
            .state(UPDATED_STATE)
            .problem(UPDATED_PROBLEM)
            .detail(UPDATED_DETAIL)
            .severity(UPDATED_SEVERITY)
            .entityName(UPDATED_ENTITY_NAME)
            .entityLabel(UPDATED_ENTITY_LABEL)
            .entityType(UPDATED_ENTITY_TYPE)
            .fix(UPDATED_FIX)
            .atTime(UPDATED_AT_TIME);

        restAgentIssuesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAgentIssues.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAgentIssues))
            )
            .andExpect(status().isOk());

        // Validate the AgentIssues in the database
        List<AgentIssues> agentIssuesList = agentIssuesRepository.findAll();
        assertThat(agentIssuesList).hasSize(databaseSizeBeforeUpdate);
        AgentIssues testAgentIssues = agentIssuesList.get(agentIssuesList.size() - 1);
        assertThat(testAgentIssues.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAgentIssues.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testAgentIssues.getProblem()).isEqualTo(UPDATED_PROBLEM);
        assertThat(testAgentIssues.getDetail()).isEqualTo(UPDATED_DETAIL);
        assertThat(testAgentIssues.getSeverity()).isEqualTo(UPDATED_SEVERITY);
        assertThat(testAgentIssues.getEntityName()).isEqualTo(UPDATED_ENTITY_NAME);
        assertThat(testAgentIssues.getEntityLabel()).isEqualTo(UPDATED_ENTITY_LABEL);
        assertThat(testAgentIssues.getEntityType()).isEqualTo(UPDATED_ENTITY_TYPE);
        assertThat(testAgentIssues.getFix()).isEqualTo(UPDATED_FIX);
        assertThat(testAgentIssues.getAtTime()).isEqualTo(UPDATED_AT_TIME);
    }

    @Test
    @Transactional
    void putNonExistingAgentIssues() throws Exception {
        int databaseSizeBeforeUpdate = agentIssuesRepository.findAll().size();
        agentIssues.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAgentIssuesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, agentIssues.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(agentIssues))
            )
            .andExpect(status().isBadRequest());

        // Validate the AgentIssues in the database
        List<AgentIssues> agentIssuesList = agentIssuesRepository.findAll();
        assertThat(agentIssuesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAgentIssues() throws Exception {
        int databaseSizeBeforeUpdate = agentIssuesRepository.findAll().size();
        agentIssues.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgentIssuesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(agentIssues))
            )
            .andExpect(status().isBadRequest());

        // Validate the AgentIssues in the database
        List<AgentIssues> agentIssuesList = agentIssuesRepository.findAll();
        assertThat(agentIssuesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAgentIssues() throws Exception {
        int databaseSizeBeforeUpdate = agentIssuesRepository.findAll().size();
        agentIssues.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgentIssuesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(agentIssues)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AgentIssues in the database
        List<AgentIssues> agentIssuesList = agentIssuesRepository.findAll();
        assertThat(agentIssuesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAgentIssuesWithPatch() throws Exception {
        // Initialize the database
        agentIssuesRepository.saveAndFlush(agentIssues);

        int databaseSizeBeforeUpdate = agentIssuesRepository.findAll().size();

        // Update the agentIssues using partial update
        AgentIssues partialUpdatedAgentIssues = new AgentIssues();
        partialUpdatedAgentIssues.setId(agentIssues.getId());

        partialUpdatedAgentIssues
            .type(UPDATED_TYPE)
            .detail(UPDATED_DETAIL)
            .entityType(UPDATED_ENTITY_TYPE)
            .fix(UPDATED_FIX)
            .atTime(UPDATED_AT_TIME);

        restAgentIssuesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAgentIssues.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAgentIssues))
            )
            .andExpect(status().isOk());

        // Validate the AgentIssues in the database
        List<AgentIssues> agentIssuesList = agentIssuesRepository.findAll();
        assertThat(agentIssuesList).hasSize(databaseSizeBeforeUpdate);
        AgentIssues testAgentIssues = agentIssuesList.get(agentIssuesList.size() - 1);
        assertThat(testAgentIssues.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAgentIssues.getState()).isEqualTo(DEFAULT_STATE);
        assertThat(testAgentIssues.getProblem()).isEqualTo(DEFAULT_PROBLEM);
        assertThat(testAgentIssues.getDetail()).isEqualTo(UPDATED_DETAIL);
        assertThat(testAgentIssues.getSeverity()).isEqualTo(DEFAULT_SEVERITY);
        assertThat(testAgentIssues.getEntityName()).isEqualTo(DEFAULT_ENTITY_NAME);
        assertThat(testAgentIssues.getEntityLabel()).isEqualTo(DEFAULT_ENTITY_LABEL);
        assertThat(testAgentIssues.getEntityType()).isEqualTo(UPDATED_ENTITY_TYPE);
        assertThat(testAgentIssues.getFix()).isEqualTo(UPDATED_FIX);
        assertThat(testAgentIssues.getAtTime()).isEqualTo(UPDATED_AT_TIME);
    }

    @Test
    @Transactional
    void fullUpdateAgentIssuesWithPatch() throws Exception {
        // Initialize the database
        agentIssuesRepository.saveAndFlush(agentIssues);

        int databaseSizeBeforeUpdate = agentIssuesRepository.findAll().size();

        // Update the agentIssues using partial update
        AgentIssues partialUpdatedAgentIssues = new AgentIssues();
        partialUpdatedAgentIssues.setId(agentIssues.getId());

        partialUpdatedAgentIssues
            .type(UPDATED_TYPE)
            .state(UPDATED_STATE)
            .problem(UPDATED_PROBLEM)
            .detail(UPDATED_DETAIL)
            .severity(UPDATED_SEVERITY)
            .entityName(UPDATED_ENTITY_NAME)
            .entityLabel(UPDATED_ENTITY_LABEL)
            .entityType(UPDATED_ENTITY_TYPE)
            .fix(UPDATED_FIX)
            .atTime(UPDATED_AT_TIME);

        restAgentIssuesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAgentIssues.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAgentIssues))
            )
            .andExpect(status().isOk());

        // Validate the AgentIssues in the database
        List<AgentIssues> agentIssuesList = agentIssuesRepository.findAll();
        assertThat(agentIssuesList).hasSize(databaseSizeBeforeUpdate);
        AgentIssues testAgentIssues = agentIssuesList.get(agentIssuesList.size() - 1);
        assertThat(testAgentIssues.getType()).isEqualTo(UPDATED_TYPE);
        assertThat(testAgentIssues.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testAgentIssues.getProblem()).isEqualTo(UPDATED_PROBLEM);
        assertThat(testAgentIssues.getDetail()).isEqualTo(UPDATED_DETAIL);
        assertThat(testAgentIssues.getSeverity()).isEqualTo(UPDATED_SEVERITY);
        assertThat(testAgentIssues.getEntityName()).isEqualTo(UPDATED_ENTITY_NAME);
        assertThat(testAgentIssues.getEntityLabel()).isEqualTo(UPDATED_ENTITY_LABEL);
        assertThat(testAgentIssues.getEntityType()).isEqualTo(UPDATED_ENTITY_TYPE);
        assertThat(testAgentIssues.getFix()).isEqualTo(UPDATED_FIX);
        assertThat(testAgentIssues.getAtTime()).isEqualTo(UPDATED_AT_TIME);
    }

    @Test
    @Transactional
    void patchNonExistingAgentIssues() throws Exception {
        int databaseSizeBeforeUpdate = agentIssuesRepository.findAll().size();
        agentIssues.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAgentIssuesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, agentIssues.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(agentIssues))
            )
            .andExpect(status().isBadRequest());

        // Validate the AgentIssues in the database
        List<AgentIssues> agentIssuesList = agentIssuesRepository.findAll();
        assertThat(agentIssuesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAgentIssues() throws Exception {
        int databaseSizeBeforeUpdate = agentIssuesRepository.findAll().size();
        agentIssues.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgentIssuesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(agentIssues))
            )
            .andExpect(status().isBadRequest());

        // Validate the AgentIssues in the database
        List<AgentIssues> agentIssuesList = agentIssuesRepository.findAll();
        assertThat(agentIssuesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAgentIssues() throws Exception {
        int databaseSizeBeforeUpdate = agentIssuesRepository.findAll().size();
        agentIssues.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAgentIssuesMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(agentIssues))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AgentIssues in the database
        List<AgentIssues> agentIssuesList = agentIssuesRepository.findAll();
        assertThat(agentIssuesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAgentIssues() throws Exception {
        // Initialize the database
        agentIssuesRepository.saveAndFlush(agentIssues);

        int databaseSizeBeforeDelete = agentIssuesRepository.findAll().size();

        // Delete the agentIssues
        restAgentIssuesMockMvc
            .perform(delete(ENTITY_API_URL_ID, agentIssues.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AgentIssues> agentIssuesList = agentIssuesRepository.findAll();
        assertThat(agentIssuesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
