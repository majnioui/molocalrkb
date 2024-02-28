package com.local.rkb.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.local.rkb.IntegrationTest;
import com.local.rkb.domain.Instana;
import com.local.rkb.repository.InstanaRepository;
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
 * Integration tests for the {@link InstanaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class InstanaResourceIT {

    private static final String DEFAULT_APITOKEN = "AAAAAAAAAA";
    private static final String UPDATED_APITOKEN = "BBBBBBBBBB";

    private static final String DEFAULT_BASEURL = "AAAAAAAAAA";
    private static final String UPDATED_BASEURL = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/instanas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private InstanaRepository instanaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restInstanaMockMvc;

    private Instana instana;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Instana createEntity(EntityManager em) {
        Instana instana = new Instana().apitoken(DEFAULT_APITOKEN).baseurl(DEFAULT_BASEURL);
        return instana;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Instana createUpdatedEntity(EntityManager em) {
        Instana instana = new Instana().apitoken(UPDATED_APITOKEN).baseurl(UPDATED_BASEURL);
        return instana;
    }

    @BeforeEach
    public void initTest() {
        instana = createEntity(em);
    }

    @Test
    @Transactional
    void createInstana() throws Exception {
        int databaseSizeBeforeCreate = instanaRepository.findAll().size();
        // Create the Instana
        restInstanaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(instana)))
            .andExpect(status().isCreated());

        // Validate the Instana in the database
        List<Instana> instanaList = instanaRepository.findAll();
        assertThat(instanaList).hasSize(databaseSizeBeforeCreate + 1);
        Instana testInstana = instanaList.get(instanaList.size() - 1);
        assertThat(testInstana.getApitoken()).isEqualTo(DEFAULT_APITOKEN);
        assertThat(testInstana.getBaseurl()).isEqualTo(DEFAULT_BASEURL);
    }

    @Test
    @Transactional
    void createInstanaWithExistingId() throws Exception {
        // Create the Instana with an existing ID
        instana.setId(1L);

        int databaseSizeBeforeCreate = instanaRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restInstanaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(instana)))
            .andExpect(status().isBadRequest());

        // Validate the Instana in the database
        List<Instana> instanaList = instanaRepository.findAll();
        assertThat(instanaList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllInstanas() throws Exception {
        // Initialize the database
        instanaRepository.saveAndFlush(instana);

        // Get all the instanaList
        restInstanaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(instana.getId().intValue())))
            .andExpect(jsonPath("$.[*].apitoken").value(hasItem(DEFAULT_APITOKEN)))
            .andExpect(jsonPath("$.[*].baseurl").value(hasItem(DEFAULT_BASEURL)));
    }

    @Test
    @Transactional
    void getInstana() throws Exception {
        // Initialize the database
        instanaRepository.saveAndFlush(instana);

        // Get the instana
        restInstanaMockMvc
            .perform(get(ENTITY_API_URL_ID, instana.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(instana.getId().intValue()))
            .andExpect(jsonPath("$.apitoken").value(DEFAULT_APITOKEN))
            .andExpect(jsonPath("$.baseurl").value(DEFAULT_BASEURL));
    }

    @Test
    @Transactional
    void getNonExistingInstana() throws Exception {
        // Get the instana
        restInstanaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingInstana() throws Exception {
        // Initialize the database
        instanaRepository.saveAndFlush(instana);

        int databaseSizeBeforeUpdate = instanaRepository.findAll().size();

        // Update the instana
        Instana updatedInstana = instanaRepository.findById(instana.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedInstana are not directly saved in db
        em.detach(updatedInstana);
        updatedInstana.apitoken(UPDATED_APITOKEN).baseurl(UPDATED_BASEURL);

        restInstanaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedInstana.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedInstana))
            )
            .andExpect(status().isOk());

        // Validate the Instana in the database
        List<Instana> instanaList = instanaRepository.findAll();
        assertThat(instanaList).hasSize(databaseSizeBeforeUpdate);
        Instana testInstana = instanaList.get(instanaList.size() - 1);
        assertThat(testInstana.getApitoken()).isEqualTo(UPDATED_APITOKEN);
        assertThat(testInstana.getBaseurl()).isEqualTo(UPDATED_BASEURL);
    }

    @Test
    @Transactional
    void putNonExistingInstana() throws Exception {
        int databaseSizeBeforeUpdate = instanaRepository.findAll().size();
        instana.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInstanaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, instana.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(instana))
            )
            .andExpect(status().isBadRequest());

        // Validate the Instana in the database
        List<Instana> instanaList = instanaRepository.findAll();
        assertThat(instanaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchInstana() throws Exception {
        int databaseSizeBeforeUpdate = instanaRepository.findAll().size();
        instana.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInstanaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(instana))
            )
            .andExpect(status().isBadRequest());

        // Validate the Instana in the database
        List<Instana> instanaList = instanaRepository.findAll();
        assertThat(instanaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamInstana() throws Exception {
        int databaseSizeBeforeUpdate = instanaRepository.findAll().size();
        instana.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInstanaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(instana)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Instana in the database
        List<Instana> instanaList = instanaRepository.findAll();
        assertThat(instanaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateInstanaWithPatch() throws Exception {
        // Initialize the database
        instanaRepository.saveAndFlush(instana);

        int databaseSizeBeforeUpdate = instanaRepository.findAll().size();

        // Update the instana using partial update
        Instana partialUpdatedInstana = new Instana();
        partialUpdatedInstana.setId(instana.getId());

        partialUpdatedInstana.apitoken(UPDATED_APITOKEN).baseurl(UPDATED_BASEURL);

        restInstanaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInstana.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInstana))
            )
            .andExpect(status().isOk());

        // Validate the Instana in the database
        List<Instana> instanaList = instanaRepository.findAll();
        assertThat(instanaList).hasSize(databaseSizeBeforeUpdate);
        Instana testInstana = instanaList.get(instanaList.size() - 1);
        assertThat(testInstana.getApitoken()).isEqualTo(UPDATED_APITOKEN);
        assertThat(testInstana.getBaseurl()).isEqualTo(UPDATED_BASEURL);
    }

    @Test
    @Transactional
    void fullUpdateInstanaWithPatch() throws Exception {
        // Initialize the database
        instanaRepository.saveAndFlush(instana);

        int databaseSizeBeforeUpdate = instanaRepository.findAll().size();

        // Update the instana using partial update
        Instana partialUpdatedInstana = new Instana();
        partialUpdatedInstana.setId(instana.getId());

        partialUpdatedInstana.apitoken(UPDATED_APITOKEN).baseurl(UPDATED_BASEURL);

        restInstanaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedInstana.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedInstana))
            )
            .andExpect(status().isOk());

        // Validate the Instana in the database
        List<Instana> instanaList = instanaRepository.findAll();
        assertThat(instanaList).hasSize(databaseSizeBeforeUpdate);
        Instana testInstana = instanaList.get(instanaList.size() - 1);
        assertThat(testInstana.getApitoken()).isEqualTo(UPDATED_APITOKEN);
        assertThat(testInstana.getBaseurl()).isEqualTo(UPDATED_BASEURL);
    }

    @Test
    @Transactional
    void patchNonExistingInstana() throws Exception {
        int databaseSizeBeforeUpdate = instanaRepository.findAll().size();
        instana.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restInstanaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, instana.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(instana))
            )
            .andExpect(status().isBadRequest());

        // Validate the Instana in the database
        List<Instana> instanaList = instanaRepository.findAll();
        assertThat(instanaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchInstana() throws Exception {
        int databaseSizeBeforeUpdate = instanaRepository.findAll().size();
        instana.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInstanaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(instana))
            )
            .andExpect(status().isBadRequest());

        // Validate the Instana in the database
        List<Instana> instanaList = instanaRepository.findAll();
        assertThat(instanaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamInstana() throws Exception {
        int databaseSizeBeforeUpdate = instanaRepository.findAll().size();
        instana.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restInstanaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(instana)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Instana in the database
        List<Instana> instanaList = instanaRepository.findAll();
        assertThat(instanaList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteInstana() throws Exception {
        // Initialize the database
        instanaRepository.saveAndFlush(instana);

        int databaseSizeBeforeDelete = instanaRepository.findAll().size();

        // Delete the instana
        restInstanaMockMvc
            .perform(delete(ENTITY_API_URL_ID, instana.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Instana> instanaList = instanaRepository.findAll();
        assertThat(instanaList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
