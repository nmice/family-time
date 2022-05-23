package ru.neginskiy.familytime.domain;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import ru.neginskiy.familytime.web.rest.TestUtil;

class UserfTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Userf.class);
        Userf userf1 = new Userf();
        userf1.setId(1L);
        Userf userf2 = new Userf();
        userf2.setId(userf1.getId());
        assertThat(userf1).isEqualTo(userf2);
        userf2.setId(2L);
        assertThat(userf1).isNotEqualTo(userf2);
        userf1.setId(null);
        assertThat(userf1).isNotEqualTo(userf2);
    }
}
