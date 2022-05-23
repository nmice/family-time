package ru.neginskiy.familytime.repository;

import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import ru.neginskiy.familytime.domain.Userf;

/**
 * Spring Data SQL repository for the Userf entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserfRepository extends JpaRepository<Userf, Long> {}
