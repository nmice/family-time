package ru.neginskiy.familytime.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import ru.neginskiy.familytime.IntegrationTest;
import ru.neginskiy.familytime.domain.Userf;
import ru.neginskiy.familytime.repository.UserfRepository;

/**
 * Integration tests for the {@link UserfResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UserfResourceIT {

    private static final String DEFAULT_LOGIN = "AAAAAAAAAA";
    private static final String UPDATED_LOGIN = "BBBBBBBBBB";

    private static final String DEFAULT_PASS = "AAAAAAAAAA";
    private static final String UPDATED_PASS = "BBBBBBBBBB";

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/userfs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UserfRepository userfRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUserfMockMvc;

    private Userf userf;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Userf createEntity(EntityManager em) {
        Userf userf = new Userf().login(DEFAULT_LOGIN).pass(DEFAULT_PASS).name(DEFAULT_NAME);
        return userf;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Userf createUpdatedEntity(EntityManager em) {
        Userf userf = new Userf().login(UPDATED_LOGIN).pass(UPDATED_PASS).name(UPDATED_NAME);
        return userf;
    }

    @BeforeEach
    public void initTest() {
        userf = createEntity(em);
    }

    @Test
    @Transactional
    void createUserf() throws Exception {
        int databaseSizeBeforeCreate = userfRepository.findAll().size();
        // Create the Userf
        restUserfMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userf))
            )
            .andExpect(status().isCreated());

        // Validate the Userf in the database
        List<Userf> userfList = userfRepository.findAll();
        assertThat(userfList).hasSize(databaseSizeBeforeCreate + 1);
        Userf testUserf = userfList.get(userfList.size() - 1);
        assertThat(testUserf.getLogin()).isEqualTo(DEFAULT_LOGIN);
        assertThat(testUserf.getPass()).isEqualTo(DEFAULT_PASS);
        assertThat(testUserf.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void createUserfWithExistingId() throws Exception {
        // Create the Userf with an existing ID
        userf.setId(1L);

        int databaseSizeBeforeCreate = userfRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUserfMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userf))
            )
            .andExpect(status().isBadRequest());

        // Validate the Userf in the database
        List<Userf> userfList = userfRepository.findAll();
        assertThat(userfList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void checkLoginIsRequired() throws Exception {
        int databaseSizeBeforeTest = userfRepository.findAll().size();
        // set the field null
        userf.setLogin(null);

        // Create the Userf, which fails.

        restUserfMockMvc
            .perform(
                post(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userf))
            )
            .andExpect(status().isBadRequest());

        List<Userf> userfList = userfRepository.findAll();
        assertThat(userfList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    void getAllUserfs() throws Exception {
        // Initialize the database
        userfRepository.saveAndFlush(userf);

        // Get all the userfList
        restUserfMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(userf.getId().intValue())))
            .andExpect(jsonPath("$.[*].login").value(hasItem(DEFAULT_LOGIN)))
            .andExpect(jsonPath("$.[*].pass").value(hasItem(DEFAULT_PASS)))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)));
    }

    @Test
    @Transactional
    void getUserf() throws Exception {
        // Initialize the database
        userfRepository.saveAndFlush(userf);

        // Get the userf
        restUserfMockMvc
            .perform(get(ENTITY_API_URL_ID, userf.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(userf.getId().intValue()))
            .andExpect(jsonPath("$.login").value(DEFAULT_LOGIN))
            .andExpect(jsonPath("$.pass").value(DEFAULT_PASS))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME));
    }

    @Test
    @Transactional
    void getNonExistingUserf() throws Exception {
        // Get the userf
        restUserfMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewUserf() throws Exception {
        // Initialize the database
        userfRepository.saveAndFlush(userf);

        int databaseSizeBeforeUpdate = userfRepository.findAll().size();

        // Update the userf
        Userf updatedUserf = userfRepository.findById(userf.getId()).get();
        // Disconnect from session so that the updates on updatedUserf are not directly saved in db
        em.detach(updatedUserf);
        updatedUserf.login(UPDATED_LOGIN).pass(UPDATED_PASS).name(UPDATED_NAME);

        restUserfMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUserf.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUserf))
            )
            .andExpect(status().isOk());

        // Validate the Userf in the database
        List<Userf> userfList = userfRepository.findAll();
        assertThat(userfList).hasSize(databaseSizeBeforeUpdate);
        Userf testUserf = userfList.get(userfList.size() - 1);
        assertThat(testUserf.getLogin()).isEqualTo(UPDATED_LOGIN);
        assertThat(testUserf.getPass()).isEqualTo(UPDATED_PASS);
        assertThat(testUserf.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void putNonExistingUserf() throws Exception {
        int databaseSizeBeforeUpdate = userfRepository.findAll().size();
        userf.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserfMockMvc
            .perform(
                put(ENTITY_API_URL_ID, userf.getId())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userf))
            )
            .andExpect(status().isBadRequest());

        // Validate the Userf in the database
        List<Userf> userfList = userfRepository.findAll();
        assertThat(userfList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUserf() throws Exception {
        int databaseSizeBeforeUpdate = userfRepository.findAll().size();
        userf.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserfMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(userf))
            )
            .andExpect(status().isBadRequest());

        // Validate the Userf in the database
        List<Userf> userfList = userfRepository.findAll();
        assertThat(userfList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUserf() throws Exception {
        int databaseSizeBeforeUpdate = userfRepository.findAll().size();
        userf.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserfMockMvc
            .perform(
                put(ENTITY_API_URL).with(csrf()).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(userf))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Userf in the database
        List<Userf> userfList = userfRepository.findAll();
        assertThat(userfList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUserfWithPatch() throws Exception {
        // Initialize the database
        userfRepository.saveAndFlush(userf);

        int databaseSizeBeforeUpdate = userfRepository.findAll().size();

        // Update the userf using partial update
        Userf partialUpdatedUserf = new Userf();
        partialUpdatedUserf.setId(userf.getId());

        restUserfMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserf.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserf))
            )
            .andExpect(status().isOk());

        // Validate the Userf in the database
        List<Userf> userfList = userfRepository.findAll();
        assertThat(userfList).hasSize(databaseSizeBeforeUpdate);
        Userf testUserf = userfList.get(userfList.size() - 1);
        assertThat(testUserf.getLogin()).isEqualTo(DEFAULT_LOGIN);
        assertThat(testUserf.getPass()).isEqualTo(DEFAULT_PASS);
        assertThat(testUserf.getName()).isEqualTo(DEFAULT_NAME);
    }

    @Test
    @Transactional
    void fullUpdateUserfWithPatch() throws Exception {
        // Initialize the database
        userfRepository.saveAndFlush(userf);

        int databaseSizeBeforeUpdate = userfRepository.findAll().size();

        // Update the userf using partial update
        Userf partialUpdatedUserf = new Userf();
        partialUpdatedUserf.setId(userf.getId());

        partialUpdatedUserf.login(UPDATED_LOGIN).pass(UPDATED_PASS).name(UPDATED_NAME);

        restUserfMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUserf.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUserf))
            )
            .andExpect(status().isOk());

        // Validate the Userf in the database
        List<Userf> userfList = userfRepository.findAll();
        assertThat(userfList).hasSize(databaseSizeBeforeUpdate);
        Userf testUserf = userfList.get(userfList.size() - 1);
        assertThat(testUserf.getLogin()).isEqualTo(UPDATED_LOGIN);
        assertThat(testUserf.getPass()).isEqualTo(UPDATED_PASS);
        assertThat(testUserf.getName()).isEqualTo(UPDATED_NAME);
    }

    @Test
    @Transactional
    void patchNonExistingUserf() throws Exception {
        int databaseSizeBeforeUpdate = userfRepository.findAll().size();
        userf.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUserfMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, userf.getId())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userf))
            )
            .andExpect(status().isBadRequest());

        // Validate the Userf in the database
        List<Userf> userfList = userfRepository.findAll();
        assertThat(userfList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUserf() throws Exception {
        int databaseSizeBeforeUpdate = userfRepository.findAll().size();
        userf.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserfMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userf))
            )
            .andExpect(status().isBadRequest());

        // Validate the Userf in the database
        List<Userf> userfList = userfRepository.findAll();
        assertThat(userfList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUserf() throws Exception {
        int databaseSizeBeforeUpdate = userfRepository.findAll().size();
        userf.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUserfMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .with(csrf())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(userf))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Userf in the database
        List<Userf> userfList = userfRepository.findAll();
        assertThat(userfList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUserf() throws Exception {
        // Initialize the database
        userfRepository.saveAndFlush(userf);

        int databaseSizeBeforeDelete = userfRepository.findAll().size();

        // Delete the userf
        restUserfMockMvc
            .perform(delete(ENTITY_API_URL_ID, userf.getId()).with(csrf()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Userf> userfList = userfRepository.findAll();
        assertThat(userfList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
