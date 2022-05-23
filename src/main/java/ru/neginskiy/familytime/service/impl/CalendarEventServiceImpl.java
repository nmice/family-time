package ru.neginskiy.familytime.service.impl;

import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.neginskiy.familytime.domain.CalendarEvent;
import ru.neginskiy.familytime.repository.CalendarEventRepository;
import ru.neginskiy.familytime.service.CalendarEventService;

/**
 * Service Implementation for managing {@link CalendarEvent}.
 */
@Service
@Transactional
public class CalendarEventServiceImpl implements CalendarEventService {

    private final Logger log = LoggerFactory.getLogger(CalendarEventServiceImpl.class);

    private final CalendarEventRepository calendarEventRepository;

    public CalendarEventServiceImpl(CalendarEventRepository calendarEventRepository) {
        this.calendarEventRepository = calendarEventRepository;
    }

    @Override
    public CalendarEvent save(CalendarEvent calendarEvent) {
        log.debug("Request to save CalendarEvent : {}", calendarEvent);
        return calendarEventRepository.save(calendarEvent);
    }

    @Override
    public CalendarEvent update(CalendarEvent calendarEvent) {
        log.debug("Request to save CalendarEvent : {}", calendarEvent);
        return calendarEventRepository.save(calendarEvent);
    }

    @Override
    public Optional<CalendarEvent> partialUpdate(CalendarEvent calendarEvent) {
        log.debug("Request to partially update CalendarEvent : {}", calendarEvent);

        return calendarEventRepository
            .findById(calendarEvent.getId())
            .map(existingCalendarEvent -> {
                if (calendarEvent.getDescriptor() != null) {
                    existingCalendarEvent.setDescriptor(calendarEvent.getDescriptor());
                }
                if (calendarEvent.getStartDate() != null) {
                    existingCalendarEvent.setStartDate(calendarEvent.getStartDate());
                }
                if (calendarEvent.getEndDate() != null) {
                    existingCalendarEvent.setEndDate(calendarEvent.getEndDate());
                }
                if (calendarEvent.getIsExactly() != null) {
                    existingCalendarEvent.setIsExactly(calendarEvent.getIsExactly());
                }

                return existingCalendarEvent;
            })
            .map(calendarEventRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CalendarEvent> findAll(Pageable pageable) {
        log.debug("Request to get all CalendarEvents");
        return calendarEventRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<CalendarEvent> findOne(Long id) {
        log.debug("Request to get CalendarEvent : {}", id);
        return calendarEventRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete CalendarEvent : {}", id);
        calendarEventRepository.deleteById(id);
    }
}
