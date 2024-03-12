package com.local.rkb.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A HealthAndVersion.
 */
@Entity
@Table(name = "health_and_version")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class HealthAndVersion implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "version")
    private String version;

    @Column(name = "health")
    private String health;

    @Column(name = "health_msg")
    private String healthMsg;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public HealthAndVersion id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getVersion() {
        return this.version;
    }

    public HealthAndVersion version(String version) {
        this.setVersion(version);
        return this;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getHealth() {
        return this.health;
    }

    public HealthAndVersion health(String health) {
        this.setHealth(health);
        return this;
    }

    public void setHealth(String health) {
        this.health = health;
    }

    public String getHealthMsg() {
        return this.healthMsg;
    }

    public HealthAndVersion healthMsg(String healthMsg) {
        this.setHealthMsg(healthMsg);
        return this;
    }

    public void setHealthMsg(String healthMsg) {
        this.healthMsg = healthMsg;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof HealthAndVersion)) {
            return false;
        }
        return getId() != null && getId().equals(((HealthAndVersion) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "HealthAndVersion{" +
            "id=" + getId() +
            ", version='" + getVersion() + "'" +
            ", health='" + getHealth() + "'" +
            ", healthMsg='" + getHealthMsg() + "'" +
            "}";
    }
}
