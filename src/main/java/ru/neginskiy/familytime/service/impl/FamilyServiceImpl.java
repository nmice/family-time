package ru.neginskiy.familytime.service.impl;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.neginskiy.familytime.domain.Family;
import ru.neginskiy.familytime.repository.FamilyRepository;
import ru.neginskiy.familytime.service.FamilyService;

/**
 * Service Implementation for managing {@link Family}.
 */
@Service
@Transactional
public class FamilyServiceImpl implements FamilyService {

    private final Logger log = LoggerFactory.getLogger(FamilyServiceImpl.class);

    private final FamilyRepository familyRepository;

    public FamilyServiceImpl(FamilyRepository familyRepository) {
        this.familyRepository = familyRepository;
    }

    @Override
    public Family save(Family family) {
        log.debug("Request to save Family : {}", family);
        return familyRepository.save(family);
    }

    @Override
    public Family update(Family family) {
        log.debug("Request to save Family : {}", family);
        return familyRepository.save(family);
    }

    @Override
    public Optional<Family> partialUpdate(Family family) {
        log.debug("Request to partially update Family : {}", family);

        return familyRepository
            .findById(family.getId())
            .map(existingFamily -> {
                if (family.getName() != null) {
                    existingFamily.setName(family.getName());
                }

                return existingFamily;
            })
            .map(familyRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Family> findAll() {
        log.debug("Request to get all Families");
        return familyRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Family> findOne(Long id) {
        log.debug("Request to get Family : {}", id);
        return familyRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Family : {}", id);
        familyRepository.deleteById(id);
    }
}
