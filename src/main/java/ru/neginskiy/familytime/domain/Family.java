package ru.neginskiy.familytime.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;

/**
 * A Family.
 */
@Entity
@Table(name = "family")
public class Family implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "name", nullable = false)
    private String name;

    @OneToMany(mappedBy = "family")
    @JsonIgnoreProperties(value = { "family" }, allowSetters = true)
    private Set<Userf> userfs = new HashSet<>();

    @OneToMany(mappedBy = "family")
    @JsonIgnoreProperties(value = { "family" }, allowSetters = true)
    private Set<CalendarEvent> calendarEvents = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Family id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Family name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Userf> getUserfs() {
        return this.userfs;
    }

    public void setUserfs(Set<Userf> userfs) {
        if (this.userfs != null) {
            this.userfs.forEach(i -> i.setFamily(null));
        }
        if (userfs != null) {
            userfs.forEach(i -> i.setFamily(this));
        }
        this.userfs = userfs;
    }

    public Family userfs(Set<Userf> userfs) {
        this.setUserfs(userfs);
        return this;
    }

    public Family addUserf(Userf userf) {
        this.userfs.add(userf);
        userf.setFamily(this);
        return this;
    }

    public Family removeUserf(Userf userf) {
        this.userfs.remove(userf);
        userf.setFamily(null);
        return this;
    }

    public Set<CalendarEvent> getCalendarEvents() {
        return this.calendarEvents;
    }

    public void setCalendarEvents(Set<CalendarEvent> calendarEvents) {
        if (this.calendarEvents != null) {
            this.calendarEvents.forEach(i -> i.setFamily(null));
        }
        if (calendarEvents != null) {
            calendarEvents.forEach(i -> i.setFamily(this));
        }
        this.calendarEvents = calendarEvents;
    }

    public Family calendarEvents(Set<CalendarEvent> calendarEvents) {
        this.setCalendarEvents(calendarEvents);
        return this;
    }

    public Family addCalendarEvent(CalendarEvent calendarEvent) {
        this.calendarEvents.add(calendarEvent);
        calendarEvent.setFamily(this);
        return this;
    }

    public Family removeCalendarEvent(CalendarEvent calendarEvent) {
        this.calendarEvents.remove(calendarEvent);
        calendarEvent.setFamily(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Family)) {
            return false;
        }
        return id != null && id.equals(((Family) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Family{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}
