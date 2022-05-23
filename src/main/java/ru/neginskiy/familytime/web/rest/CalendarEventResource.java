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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ru.neginskiy.familytime.domain.CalendarEvent;
import ru.neginskiy.familytime.repository.CalendarEventRepository;
import ru.neginskiy.familytime.service.CalendarEventService;
import ru.neginskiy.familytime.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link ru.neginskiy.familytime.domain.CalendarEvent}.
 */
@RestController
@RequestMapping("/api")
public class CalendarEventResource {

    private final Logger log = LoggerFactory.getLogger(CalendarEventResource.class);

    private static final String ENTITY_NAME = "calendarEvent";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CalendarEventService calendarEventService;

    private final CalendarEventRepository calendarEventRepository;

    public CalendarEventResource(CalendarEventService calendarEventService, CalendarEventRepository calendarEventRepository) {
        this.calendarEventService = calendarEventService;
        this.calendarEventRepository = calendarEventRepository;
    }

    /**
     * {@code POST  /calendar-events} : Create a new calendarEvent.
     *
     * @param calendarEvent the calendarEvent to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new calendarEvent, or with status {@code 400 (Bad Request)} if the calendarEvent has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/calendar-events")
    public ResponseEntity<CalendarEvent> createCalendarEvent(@Valid @RequestBody CalendarEvent calendarEvent) throws URISyntaxException {
        log.debug("REST request to save CalendarEvent : {}", calendarEvent);
        if (calendarEvent.getId() != null) {
            throw new BadRequestAlertException("A new calendarEvent cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CalendarEvent result = calendarEventService.save(calendarEvent);
        return ResponseEntity
            .created(new URI("/api/calendar-events/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /calendar-events/:id} : Updates an existing calendarEvent.
     *
     * @param id the id of the calendarEvent to save.
     * @param calendarEvent the calendarEvent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated calendarEvent,
     * or with status {@code 400 (Bad Request)} if the calendarEvent is not valid,
     * or with status {@code 500 (Internal Server Error)} if the calendarEvent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/calendar-events/{id}")
    public ResponseEntity<CalendarEvent> updateCalendarEvent(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody CalendarEvent calendarEvent
    ) throws URISyntaxException {
        log.debug("REST request to update CalendarEvent : {}, {}", id, calendarEvent);
        if (calendarEvent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, calendarEvent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!calendarEventRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CalendarEvent result = calendarEventService.update(calendarEvent);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, calendarEvent.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /calendar-events/:id} : Partial updates given fields of an existing calendarEvent, field will ignore if it is null
     *
     * @param id the id of the calendarEvent to save.
     * @param calendarEvent the calendarEvent to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated calendarEvent,
     * or with status {@code 400 (Bad Request)} if the calendarEvent is not valid,
     * or with status {@code 404 (Not Found)} if the calendarEvent is not found,
     * or with status {@code 500 (Internal Server Error)} if the calendarEvent couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/calendar-events/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CalendarEvent> partialUpdateCalendarEvent(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody CalendarEvent calendarEvent
    ) throws URISyntaxException {
        log.debug("REST request to partial update CalendarEvent partially : {}, {}", id, calendarEvent);
        if (calendarEvent.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, calendarEvent.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!calendarEventRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CalendarEvent> result = calendarEventService.partialUpdate(calendarEvent);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, calendarEvent.getId().toString())
        );
    }

    /**
     * {@code GET  /calendar-events} : get all the calendarEvents.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of calendarEvents in body.
     */
    @GetMapping("/calendar-events")
    public ResponseEntity<List<CalendarEvent>> getAllCalendarEvents(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of CalendarEvents");
        Page<CalendarEvent> page = calendarEventService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /calendar-events/:id} : get the "id" calendarEvent.
     *
     * @param id the id of the calendarEvent to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the calendarEvent, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/calendar-events/{id}")
    public ResponseEntity<CalendarEvent> getCalendarEvent(@PathVariable Long id) {
        log.debug("REST request to get CalendarEvent : {}", id);
        Optional<CalendarEvent> calendarEvent = calendarEventService.findOne(id);
        return ResponseUtil.wrapOrNotFound(calendarEvent);
    }

    /**
     * {@code DELETE  /calendar-events/:id} : delete the "id" calendarEvent.
     *
     * @param id the id of the calendarEvent to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/calendar-events/{id}")
    public ResponseEntity<Void> deleteCalendarEvent(@PathVariable Long id) {
        log.debug("REST request to delete CalendarEvent : {}", id);
        calendarEventService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
