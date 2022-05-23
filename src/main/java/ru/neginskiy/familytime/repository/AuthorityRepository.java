package ru.neginskiy.familytime.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.neginskiy.familytime.domain.Authority;

/**
 * Spring Data JPA repository for the {@link Authority} entity.
 */
public interface AuthorityRepository extends JpaRepository<Authority, String> {}
