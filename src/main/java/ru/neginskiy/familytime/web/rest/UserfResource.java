package ru.neginskiy.familytime.web.rest;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.neginskiy.familytime.domain.Userf;
import ru.neginskiy.familytime.repository.UserfRepository;
import ru.neginskiy.familytime.service.UserfService;
import ru.neginskiy.familytime.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link ru.neginskiy.familytime.domain.Userf}.
 */
@RestController
@RequestMapping("/api")
public class UserfResource {

    private final Logger log = LoggerFactory.getLogger(UserfResource.class);

    private static final String ENTITY_NAME = "userf";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UserfService userfService;

    private final UserfRepository userfRepository;

    public UserfResource(UserfService userfService, UserfRepository userfRepository) {
        this.userfService = userfService;
        this.userfRepository = userfRepository;
    }

    /**
     * {@code POST  /userfs} : Create a new userf.
     *
     * @param userf the userf to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new userf, or with status {@code 400 (Bad Request)} if the userf has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/userfs")
    public ResponseEntity<Userf> createUserf(@Valid @RequestBody Userf userf) throws URISyntaxException {
        log.debug("REST request to save Userf : {}", userf);
        if (userf.getId() != null) {
            throw new BadRequestAlertException("A new userf cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Userf result = userfService.save(userf);
        return ResponseEntity
            .created(new URI("/api/userfs/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /userfs/:id} : Updates an existing userf.
     *
     * @param id the id of the userf to save.
     * @param userf the userf to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userf,
     * or with status {@code 400 (Bad Request)} if the userf is not valid,
     * or with status {@code 500 (Internal Server Error)} if the userf couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/userfs/{id}")
    public ResponseEntity<Userf> updateUserf(@PathVariable(value = "id", required = false) final Long id, @Valid @RequestBody Userf userf)
        throws URISyntaxException {
        log.debug("REST request to update Userf : {}, {}", id, userf);
        if (userf.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userf.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userfRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Userf result = userfService.update(userf);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userf.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /userfs/:id} : Partial updates given fields of an existing userf, field will ignore if it is null
     *
     * @param id the id of the userf to save.
     * @param userf the userf to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated userf,
     * or with status {@code 400 (Bad Request)} if the userf is not valid,
     * or with status {@code 404 (Not Found)} if the userf is not found,
     * or with status {@code 500 (Internal Server Error)} if the userf couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/userfs/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Userf> partialUpdateUserf(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Userf userf
    ) throws URISyntaxException {
        log.debug("REST request to partial update Userf partially : {}, {}", id, userf);
        if (userf.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, userf.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!userfRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Userf> result = userfService.partialUpdate(userf);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, userf.getId().toString())
        );
    }

    /**
     * {@code GET  /userfs} : get all the userfs.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of userfs in body.
     */
    @GetMapping("/userfs")
    public List<Userf> getAllUserfs() {
        log.debug("REST request to get all Userfs");
        return userfService.findAll();
    }

    /**
     * {@code GET  /userfs/:id} : get the "id" userf.
     *
     * @param id the id of the userf to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the userf, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/userfs/{id}")
    public ResponseEntity<Userf> getUserf(@PathVariable Long id) {
        log.debug("REST request to get Userf : {}", id);
        Optional<Userf> userf = userfService.findOne(id);
        return ResponseUtil.wrapOrNotFound(userf);
    }

    /**
     * {@code DELETE  /userfs/:id} : delete the "id" userf.
     *
     * @param id the id of the userf to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/userfs/{id}")
    public ResponseEntity<Void> deleteUserf(@PathVariable Long id) {
        log.debug("REST request to delete Userf : {}", id);
        userfService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
