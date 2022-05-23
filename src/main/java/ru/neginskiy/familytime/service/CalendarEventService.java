package ru.neginskiy.familytime.service;

import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import ru.neginskiy.familytime.domain.CalendarEvent;

/**
 * Service Interface for managing {@link CalendarEvent}.
 */
public interface CalendarEventService {
    /**
     * Save a calendarEvent.
     *
     * @param calendarEvent the entity to save.
     * @return the persisted entity.
     */
    CalendarEvent save(CalendarEvent calendarEvent);

    /**
     * Updates a calendarEvent.
     *
     * @param calendarEvent the entity to update.
     * @return the persisted entity.
     */
    CalendarEvent update(CalendarEvent calendarEvent);

    /**
     * Partially updates a calendarEvent.
     *
     * @param calendarEvent the entity to update partially.
     * @return the persisted entity.
     */
    Optional<CalendarEvent> partialUpdate(CalendarEvent calendarEvent);

    /**
     * Get all the calendarEvents.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<CalendarEvent> findAll(Pageable pageable);

    /**
     * Get the "id" calendarEvent.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<CalendarEvent> findOne(Long id);

    /**
     * Delete the "id" calendarEvent.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
