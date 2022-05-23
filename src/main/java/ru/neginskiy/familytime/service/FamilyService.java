package ru.neginskiy.familytime.service;

import java.util.List;
import java.util.Optional;
import ru.neginskiy.familytime.domain.Family;

/**
 * Service Interface for managing {@link Family}.
 */
public interface FamilyService {
    /**
     * Save a family.
     *
     * @param family the entity to save.
     * @return the persisted entity.
     */
    Family save(Family family);

    /**
     * Updates a family.
     *
     * @param family the entity to update.
     * @return the persisted entity.
     */
    Family update(Family family);

    /**
     * Partially updates a family.
     *
     * @param family the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Family> partialUpdate(Family family);

    /**
     * Get all the families.
     *
     * @return the list of entities.
     */
    List<Family> findAll();

    /**
     * Get the "id" family.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Family> findOne(Long id);

    /**
     * Delete the "id" family.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
