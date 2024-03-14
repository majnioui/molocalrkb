package com.local.rkb.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A AgentIssues.
 */
@Entity
@Table(name = "agent_issues")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class AgentIssues implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "type")
    private String type;

    @Column(name = "state")
    private String state;

    @Column(name = "problem")
    private String problem;

    @Column(name = "detail")
    private String detail;

    @Column(name = "severity")
    private String severity;

    @Column(name = "entity_name")
    private String entityName;

    @Column(name = "entity_label")
    private String entityLabel;

    @Column(name = "entity_type")
    private String entityType;

    @Column(name = "fix")
    private String fix;

    @Column(name = "at_time")
    private Instant atTime;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public AgentIssues id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return this.type;
    }

    public AgentIssues type(String type) {
        this.setType(type);
        return this;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getState() {
        return this.state;
    }

    public AgentIssues state(String state) {
        this.setState(state);
        return this;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getProblem() {
        return this.problem;
    }

    public AgentIssues problem(String problem) {
        this.setProblem(problem);
        return this;
    }

    public void setProblem(String problem) {
        this.problem = problem;
    }

    public String getDetail() {
        return this.detail;
    }

    public AgentIssues detail(String detail) {
        this.setDetail(detail);
        return this;
    }

    public void setDetail(String detail) {
        this.detail = detail;
    }

    public String getSeverity() {
        return this.severity;
    }

    public AgentIssues severity(String severity) {
        this.setSeverity(severity);
        return this;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getEntityName() {
        return this.entityName;
    }

    public AgentIssues entityName(String entityName) {
        this.setEntityName(entityName);
        return this;
    }

    public void setEntityName(String entityName) {
        this.entityName = entityName;
    }

    public String getEntityLabel() {
        return this.entityLabel;
    }

    public AgentIssues entityLabel(String entityLabel) {
        this.setEntityLabel(entityLabel);
        return this;
    }

    public void setEntityLabel(String entityLabel) {
        this.entityLabel = entityLabel;
    }

    public String getEntityType() {
        return this.entityType;
    }

    public AgentIssues entityType(String entityType) {
        this.setEntityType(entityType);
        return this;
    }

    public void setEntityType(String entityType) {
        this.entityType = entityType;
    }

    public String getFix() {
        return this.fix;
    }

    public AgentIssues fix(String fix) {
        this.setFix(fix);
        return this;
    }

    public void setFix(String fix) {
        this.fix = fix;
    }

    public Instant getAtTime() {
        return this.atTime;
    }

    public AgentIssues atTime(Instant atTime) {
        this.setAtTime(atTime);
        return this;
    }

    public void setAtTime(Instant atTime) {
        this.atTime = atTime;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AgentIssues)) {
            return false;
        }
        return getId() != null && getId().equals(((AgentIssues) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "AgentIssues{" +
            "id=" + getId() +
            ", type='" + getType() + "'" +
            ", state='" + getState() + "'" +
            ", problem='" + getProblem() + "'" +
            ", detail='" + getDetail() + "'" +
            ", severity='" + getSeverity() + "'" +
            ", entityName='" + getEntityName() + "'" +
            ", entityLabel='" + getEntityLabel() + "'" +
            ", entityType='" + getEntityType() + "'" +
            ", fix='" + getFix() + "'" +
            ", atTime='" + getAtTime() + "'" +
            "}";
    }
}
