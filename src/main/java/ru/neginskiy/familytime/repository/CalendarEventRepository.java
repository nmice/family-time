package ru.neginskiy.familytime.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import ru.neginskiy.familytime.domain.CalendarEvent;

/**
 * Spring Data SQL repository for the CalendarEvent entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CalendarEventRepository extends JpaRepository<CalendarEvent, Long> {}
