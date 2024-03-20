package com.local.rkb.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AppServices.
 */
@Entity
@Table(name = "app_services")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AppServices implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "serv_id")
    private String servId;

    @Column(name = "label")
    private String label;

    @Column(name = "types")
    private String types;

    @Column(name = "technologies")
    private String technologies;

    @Column(name = "entity_type")
    private String entityType;

    @Column(name = "erron_calls")
    private String erronCalls;

    @Column(name = "calls")
    private String calls;

    @Column(name = "latency")
    private String latency;

    @Column(name = "date")
    private Instant date;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AppServices id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getServId() {
        return this.servId;
    }

    public AppServices servId(String servId) {
        this.setServId(servId);
        return this;
    }

    public void setServId(String servId) {
        this.servId = servId;
    }

    public String getLabel() {
        return this.label;
    }

    public AppServices label(String label) {
        this.setLabel(label);
        return this;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getTypes() {
        return this.types;
    }

    public AppServices types(String types) {
        this.setTypes(types);
        return this;
    }

    public void setTypes(String types) {
        this.types = types;
    }

    public String getTechnologies() {
        return this.technologies;
    }

    public AppServices technologies(String technologies) {
        this.setTechnologies(technologies);
        return this;
    }

    public void setTechnologies(String technologies) {
        this.technologies = technologies;
    }

    public String getEntityType() {
        return this.entityType;
    }

    public AppServices entityType(String entityType) {
        this.setEntityType(entityType);
        return this;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public String getErronCalls() {
        return this.erronCalls;
    }

    public AppServices erronCalls(String erronCalls) {
        this.setErronCalls(erronCalls);
        return this;
    }

    public void setErronCalls(String erronCalls) {
        this.erronCalls = erronCalls;
    }

    public String getCalls() {
        return this.calls;
    }

    public AppServices calls(String calls) {
        this.setCalls(calls);
        return this;
    }

    public void setCalls(String calls) {
        this.calls = calls;
    }

    public String getLatency() {
        return this.latency;
    }

    public AppServices latency(String latency) {
        this.setLatency(latency);
        return this;
    }

    public void setLatency(String latency) {
        this.latency = latency;
    }

    public Instant getDate() {
        return this.date;
    }

    public AppServices date(Instant date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AppServices)) {
            return false;
        }
        return getId() != null && getId().equals(((AppServices) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AppServices{" +
            "id=" + getId() +
            ", servId='" + getServId() + "'" +
            ", label='" + getLabel() + "'" +
            ", types='" + getTypes() + "'" +
            ", technologies='" + getTechnologies() + "'" +
            ", entityType='" + getEntityType() + "'" +
            ", erronCalls='" + getErronCalls() + "'" +
            ", calls='" + getCalls() + "'" +
            ", latency='" + getLatency() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
