package ru.neginskiy.familytime.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A CalendarEvent.
 */
@Entity
@Table(name = "calendar_event")
public class CalendarEvent implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "descriptor", nullable = false)
    private String descriptor;

    @Column(name = "start_date")
    private Instant startDate;

    @Column(name = "end_date")
    private Instant endDate;

    @Column(name = "is_exactly")
    private Boolean isExactly;

    @ManyToOne
    @JsonIgnoreProperties(value = { "userfs", "calendarEvents" }, allowSetters = true)
    private Family family;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CalendarEvent id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescriptor() {
        return this.descriptor;
    }

    public CalendarEvent descriptor(String descriptor) {
        this.setDescriptor(descriptor);
        return this;
    }

    public void setDescriptor(String descriptor) {
        this.descriptor = descriptor;
    }

    public Instant getStartDate() {
        return this.startDate;
    }

    public CalendarEvent startDate(Instant startDate) {
        this.setStartDate(startDate);
        return this;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public Instant getEndDate() {
        return this.endDate;
    }

    public CalendarEvent endDate(Instant endDate) {
        this.setEndDate(endDate);
        return this;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }

    public Boolean getIsExactly() {
        return this.isExactly;
    }

    public CalendarEvent isExactly(Boolean isExactly) {
        this.setIsExactly(isExactly);
        return this;
    }

    public void setIsExactly(Boolean isExactly) {
        this.isExactly = isExactly;
    }

    public Family getFamily() {
        return this.family;
    }

    public void setFamily(Family family) {
        this.family = family;
    }

    public CalendarEvent family(Family family) {
        this.setFamily(family);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CalendarEvent)) {
            return false;
        }
        return id != null && id.equals(((CalendarEvent) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CalendarEvent{" +
            "id=" + getId() +
            ", descriptor='" + getDescriptor() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", isExactly='" + getIsExactly() + "'" +
            "}";
    }
}
