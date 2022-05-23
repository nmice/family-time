package ru.neginskiy.familytime.service.impl;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.neginskiy.familytime.domain.Userf;
import ru.neginskiy.familytime.repository.UserfRepository;
import ru.neginskiy.familytime.service.UserfService;

/**
 * Service Implementation for managing {@link Userf}.
 */
@Service
@Transactional
public class UserfServiceImpl implements UserfService {

    private final Logger log = LoggerFactory.getLogger(UserfServiceImpl.class);

    private final UserfRepository userfRepository;

    public UserfServiceImpl(UserfRepository userfRepository) {
        this.userfRepository = userfRepository;
    }

    @Override
    public Userf save(Userf userf) {
        log.debug("Request to save Userf : {}", userf);
        return userfRepository.save(userf);
    }

    @Override
    public Userf update(Userf userf) {
        log.debug("Request to save Userf : {}", userf);
        return userfRepository.save(userf);
    }

    @Override
    public Optional<Userf> partialUpdate(Userf userf) {
        log.debug("Request to partially update Userf : {}", userf);

        return userfRepository
            .findById(userf.getId())
            .map(existingUserf -> {
                if (userf.getLogin() != null) {
                    existingUserf.setLogin(userf.getLogin());
                }
                if (userf.getPass() != null) {
                    existingUserf.setPass(userf.getPass());
                }
                if (userf.getName() != null) {
                    existingUserf.setName(userf.getName());
                }

                return existingUserf;
            })
            .map(userfRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Userf> findAll() {
        log.debug("Request to get all Userfs");
        return userfRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Userf> findOne(Long id) {
        log.debug("Request to get Userf : {}", id);
        return userfRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Userf : {}", id);
        userfRepository.deleteById(id);
    }
}
