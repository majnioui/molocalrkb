package com.local.rkb.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.local.rkb.IntegrationTest;
import com.local.rkb.domain.AppServices;
import com.local.rkb.repository.AppServicesRepository;
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
 * Integration tests for the {@link AppServicesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AppServicesResourceIT {

    private static final String DEFAULT_SERV_ID = "AAAAAAAAAA";
    private static final String UPDATED_SERV_ID = "BBBBBBBBBB";

    private static final String DEFAULT_LABEL = "AAAAAAAAAA";
    private static final String UPDATED_LABEL = "BBBBBBBBBB";

    private static final String DEFAULT_TYPES = "AAAAAAAAAA";
    private static final String UPDATED_TYPES = "BBBBBBBBBB";

    private static final String DEFAULT_TECHNOLOGIES = "AAAAAAAAAA";
    private static final String UPDATED_TECHNOLOGIES = "BBBBBBBBBB";

    private static final String DEFAULT_ENTITY_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_ENTITY_TYPE = "BBBBBBBBBB";

    private static final String DEFAULT_ERRON_CALLS = "AAAAAAAAAA";
    private static final String UPDATED_ERRON_CALLS = "BBBBBBBBBB";

    private static final String DEFAULT_CALLS = "AAAAAAAAAA";
    private static final String UPDATED_CALLS = "BBBBBBBBBB";

    private static final String DEFAULT_LATENCY = "AAAAAAAAAA";
    private static final String UPDATED_LATENCY = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATE = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATE = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/app-services";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AppServicesRepository appServicesRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAppServicesMockMvc;

    private AppServices appServices;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AppServices createEntity(EntityManager em) {
        AppServices appServices = new AppServices()
            .servId(DEFAULT_SERV_ID)
            .label(DEFAULT_LABEL)
            .types(DEFAULT_TYPES)
            .technologies(DEFAULT_TECHNOLOGIES)
            .entityType(DEFAULT_ENTITY_TYPE)
            .erronCalls(DEFAULT_ERRON_CALLS)
            .calls(DEFAULT_CALLS)
            .latency(DEFAULT_LATENCY)
            .date(DEFAULT_DATE);
        return appServices;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AppServices createUpdatedEntity(EntityManager em) {
        AppServices appServices = new AppServices()
            .servId(UPDATED_SERV_ID)
            .label(UPDATED_LABEL)
            .types(UPDATED_TYPES)
            .technologies(UPDATED_TECHNOLOGIES)
            .entityType(UPDATED_ENTITY_TYPE)
            .erronCalls(UPDATED_ERRON_CALLS)
            .calls(UPDATED_CALLS)
            .latency(UPDATED_LATENCY)
            .date(UPDATED_DATE);
        return appServices;
    }

    @BeforeEach
    public void initTest() {
        appServices = createEntity(em);
    }

    @Test
    @Transactional
    void createAppServices() throws Exception {
        int databaseSizeBeforeCreate = appServicesRepository.findAll().size();
        // Create the AppServices
        restAppServicesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appServices)))
            .andExpect(status().isCreated());

        // Validate the AppServices in the database
        List<AppServices> appServicesList = appServicesRepository.findAll();
        assertThat(appServicesList).hasSize(databaseSizeBeforeCreate + 1);
        AppServices testAppServices = appServicesList.get(appServicesList.size() - 1);
        assertThat(testAppServices.getServId()).isEqualTo(DEFAULT_SERV_ID);
        assertThat(testAppServices.getLabel()).isEqualTo(DEFAULT_LABEL);
        assertThat(testAppServices.getTypes()).isEqualTo(DEFAULT_TYPES);
        assertThat(testAppServices.getTechnologies()).isEqualTo(DEFAULT_TECHNOLOGIES);
        assertThat(testAppServices.getEntityType()).isEqualTo(DEFAULT_ENTITY_TYPE);
        assertThat(testAppServices.getErronCalls()).isEqualTo(DEFAULT_ERRON_CALLS);
        assertThat(testAppServices.getCalls()).isEqualTo(DEFAULT_CALLS);
        assertThat(testAppServices.getLatency()).isEqualTo(DEFAULT_LATENCY);
        assertThat(testAppServices.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createAppServicesWithExistingId() throws Exception {
        // Create the AppServices with an existing ID
        appServices.setId(1L);

        int databaseSizeBeforeCreate = appServicesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAppServicesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appServices)))
            .andExpect(status().isBadRequest());

        // Validate the AppServices in the database
        List<AppServices> appServicesList = appServicesRepository.findAll();
        assertThat(appServicesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAppServices() throws Exception {
        // Initialize the database
        appServicesRepository.saveAndFlush(appServices);

        // Get all the appServicesList
        restAppServicesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(appServices.getId().intValue())))
            .andExpect(jsonPath("$.[*].servId").value(hasItem(DEFAULT_SERV_ID)))
            .andExpect(jsonPath("$.[*].label").value(hasItem(DEFAULT_LABEL)))
            .andExpect(jsonPath("$.[*].types").value(hasItem(DEFAULT_TYPES)))
            .andExpect(jsonPath("$.[*].technologies").value(hasItem(DEFAULT_TECHNOLOGIES)))
            .andExpect(jsonPath("$.[*].entityType").value(hasItem(DEFAULT_ENTITY_TYPE)))
            .andExpect(jsonPath("$.[*].erronCalls").value(hasItem(DEFAULT_ERRON_CALLS)))
            .andExpect(jsonPath("$.[*].calls").value(hasItem(DEFAULT_CALLS)))
            .andExpect(jsonPath("$.[*].latency").value(hasItem(DEFAULT_LATENCY)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(DEFAULT_DATE.toString())));
    }

    @Test
    @Transactional
    void getAppServices() throws Exception {
        // Initialize the database
        appServicesRepository.saveAndFlush(appServices);

        // Get the appServices
        restAppServicesMockMvc
            .perform(get(ENTITY_API_URL_ID, appServices.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(appServices.getId().intValue()))
            .andExpect(jsonPath("$.servId").value(DEFAULT_SERV_ID))
            .andExpect(jsonPath("$.label").value(DEFAULT_LABEL))
            .andExpect(jsonPath("$.types").value(DEFAULT_TYPES))
            .andExpect(jsonPath("$.technologies").value(DEFAULT_TECHNOLOGIES))
            .andExpect(jsonPath("$.entityType").value(DEFAULT_ENTITY_TYPE))
            .andExpect(jsonPath("$.erronCalls").value(DEFAULT_ERRON_CALLS))
            .andExpect(jsonPath("$.calls").value(DEFAULT_CALLS))
            .andExpect(jsonPath("$.latency").value(DEFAULT_LATENCY))
            .andExpect(jsonPath("$.date").value(DEFAULT_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAppServices() throws Exception {
        // Get the appServices
        restAppServicesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingAppServices() throws Exception {
        // Initialize the database
        appServicesRepository.saveAndFlush(appServices);

        int databaseSizeBeforeUpdate = appServicesRepository.findAll().size();

        // Update the appServices
        AppServices updatedAppServices = appServicesRepository.findById(appServices.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedAppServices are not directly saved in db
        em.detach(updatedAppServices);
        updatedAppServices
            .servId(UPDATED_SERV_ID)
            .label(UPDATED_LABEL)
            .types(UPDATED_TYPES)
            .technologies(UPDATED_TECHNOLOGIES)
            .entityType(UPDATED_ENTITY_TYPE)
            .erronCalls(UPDATED_ERRON_CALLS)
            .calls(UPDATED_CALLS)
            .latency(UPDATED_LATENCY)
            .date(UPDATED_DATE);

        restAppServicesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAppServices.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAppServices))
            )
            .andExpect(status().isOk());

        // Validate the AppServices in the database
        List<AppServices> appServicesList = appServicesRepository.findAll();
        assertThat(appServicesList).hasSize(databaseSizeBeforeUpdate);
        AppServices testAppServices = appServicesList.get(appServicesList.size() - 1);
        assertThat(testAppServices.getServId()).isEqualTo(UPDATED_SERV_ID);
        assertThat(testAppServices.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testAppServices.getTypes()).isEqualTo(UPDATED_TYPES);
        assertThat(testAppServices.getTechnologies()).isEqualTo(UPDATED_TECHNOLOGIES);
        assertThat(testAppServices.getEntityType()).isEqualTo(UPDATED_ENTITY_TYPE);
        assertThat(testAppServices.getErronCalls()).isEqualTo(UPDATED_ERRON_CALLS);
        assertThat(testAppServices.getCalls()).isEqualTo(UPDATED_CALLS);
        assertThat(testAppServices.getLatency()).isEqualTo(UPDATED_LATENCY);
        assertThat(testAppServices.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingAppServices() throws Exception {
        int databaseSizeBeforeUpdate = appServicesRepository.findAll().size();
        appServices.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAppServicesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, appServices.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(appServices))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppServices in the database
        List<AppServices> appServicesList = appServicesRepository.findAll();
        assertThat(appServicesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAppServices() throws Exception {
        int databaseSizeBeforeUpdate = appServicesRepository.findAll().size();
        appServices.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppServicesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(appServices))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppServices in the database
        List<AppServices> appServicesList = appServicesRepository.findAll();
        assertThat(appServicesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAppServices() throws Exception {
        int databaseSizeBeforeUpdate = appServicesRepository.findAll().size();
        appServices.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppServicesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(appServices)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AppServices in the database
        List<AppServices> appServicesList = appServicesRepository.findAll();
        assertThat(appServicesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAppServicesWithPatch() throws Exception {
        // Initialize the database
        appServicesRepository.saveAndFlush(appServices);

        int databaseSizeBeforeUpdate = appServicesRepository.findAll().size();

        // Update the appServices using partial update
        AppServices partialUpdatedAppServices = new AppServices();
        partialUpdatedAppServices.setId(appServices.getId());

        partialUpdatedAppServices
            .servId(UPDATED_SERV_ID)
            .label(UPDATED_LABEL)
            .types(UPDATED_TYPES)
            .technologies(UPDATED_TECHNOLOGIES)
            .entityType(UPDATED_ENTITY_TYPE);

        restAppServicesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAppServices.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAppServices))
            )
            .andExpect(status().isOk());

        // Validate the AppServices in the database
        List<AppServices> appServicesList = appServicesRepository.findAll();
        assertThat(appServicesList).hasSize(databaseSizeBeforeUpdate);
        AppServices testAppServices = appServicesList.get(appServicesList.size() - 1);
        assertThat(testAppServices.getServId()).isEqualTo(UPDATED_SERV_ID);
        assertThat(testAppServices.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testAppServices.getTypes()).isEqualTo(UPDATED_TYPES);
        assertThat(testAppServices.getTechnologies()).isEqualTo(UPDATED_TECHNOLOGIES);
        assertThat(testAppServices.getEntityType()).isEqualTo(UPDATED_ENTITY_TYPE);
        assertThat(testAppServices.getErronCalls()).isEqualTo(DEFAULT_ERRON_CALLS);
        assertThat(testAppServices.getCalls()).isEqualTo(DEFAULT_CALLS);
        assertThat(testAppServices.getLatency()).isEqualTo(DEFAULT_LATENCY);
        assertThat(testAppServices.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateAppServicesWithPatch() throws Exception {
        // Initialize the database
        appServicesRepository.saveAndFlush(appServices);

        int databaseSizeBeforeUpdate = appServicesRepository.findAll().size();

        // Update the appServices using partial update
        AppServices partialUpdatedAppServices = new AppServices();
        partialUpdatedAppServices.setId(appServices.getId());

        partialUpdatedAppServices
            .servId(UPDATED_SERV_ID)
            .label(UPDATED_LABEL)
            .types(UPDATED_TYPES)
            .technologies(UPDATED_TECHNOLOGIES)
            .entityType(UPDATED_ENTITY_TYPE)
            .erronCalls(UPDATED_ERRON_CALLS)
            .calls(UPDATED_CALLS)
            .latency(UPDATED_LATENCY)
            .date(UPDATED_DATE);

        restAppServicesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAppServices.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAppServices))
            )
            .andExpect(status().isOk());

        // Validate the AppServices in the database
        List<AppServices> appServicesList = appServicesRepository.findAll();
        assertThat(appServicesList).hasSize(databaseSizeBeforeUpdate);
        AppServices testAppServices = appServicesList.get(appServicesList.size() - 1);
        assertThat(testAppServices.getServId()).isEqualTo(UPDATED_SERV_ID);
        assertThat(testAppServices.getLabel()).isEqualTo(UPDATED_LABEL);
        assertThat(testAppServices.getTypes()).isEqualTo(UPDATED_TYPES);
        assertThat(testAppServices.getTechnologies()).isEqualTo(UPDATED_TECHNOLOGIES);
        assertThat(testAppServices.getEntityType()).isEqualTo(UPDATED_ENTITY_TYPE);
        assertThat(testAppServices.getErronCalls()).isEqualTo(UPDATED_ERRON_CALLS);
        assertThat(testAppServices.getCalls()).isEqualTo(UPDATED_CALLS);
        assertThat(testAppServices.getLatency()).isEqualTo(UPDATED_LATENCY);
        assertThat(testAppServices.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingAppServices() throws Exception {
        int databaseSizeBeforeUpdate = appServicesRepository.findAll().size();
        appServices.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAppServicesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, appServices.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(appServices))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppServices in the database
        List<AppServices> appServicesList = appServicesRepository.findAll();
        assertThat(appServicesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAppServices() throws Exception {
        int databaseSizeBeforeUpdate = appServicesRepository.findAll().size();
        appServices.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppServicesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(appServices))
            )
            .andExpect(status().isBadRequest());

        // Validate the AppServices in the database
        List<AppServices> appServicesList = appServicesRepository.findAll();
        assertThat(appServicesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAppServices() throws Exception {
        int databaseSizeBeforeUpdate = appServicesRepository.findAll().size();
        appServices.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAppServicesMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(appServices))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AppServices in the database
        List<AppServices> appServicesList = appServicesRepository.findAll();
        assertThat(appServicesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAppServices() throws Exception {
        // Initialize the database
        appServicesRepository.saveAndFlush(appServices);

        int databaseSizeBeforeDelete = appServicesRepository.findAll().size();

        // Delete the appServices
        restAppServicesMockMvc
            .perform(delete(ENTITY_API_URL_ID, appServices.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AppServices> appServicesList = appServicesRepository.findAll();
        assertThat(appServicesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
