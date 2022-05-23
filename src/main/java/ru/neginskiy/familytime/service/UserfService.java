package ru.neginskiy.familytime.service;

import java.util.List;
import java.util.Optional;
import ru.neginskiy.familytime.domain.Userf;

/**
 * Service Interface for managing {@link Userf}.
 */
public interface UserfService {
    /**
     * Save a userf.
     *
     * @param userf the entity to save.
     * @return the persisted entity.
     */
    Userf save(Userf userf);

    /**
     * Updates a userf.
     *
     * @param userf the entity to update.
     * @return the persisted entity.
     */
    Userf update(Userf userf);

    /**
     * Partially updates a userf.
     *
     * @param userf the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Userf> partialUpdate(Userf userf);

    /**
     * Get all the userfs.
     *
     * @return the list of entities.
     */
    List<Userf> findAll();

    /**
     * Get the "id" userf.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Userf> findOne(Long id);

    /**
     * Delete the "id" userf.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
