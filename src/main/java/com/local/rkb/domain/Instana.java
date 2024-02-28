package com.local.rkb.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Instana.
 */
@Entity
@Table(name = "instana")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Instana implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "apitoken")
    private String apitoken;

    @Column(name = "baseurl")
    private String baseurl;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Instana id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getApitoken() {
        return this.apitoken;
    }

    public Instana apitoken(String apitoken) {
        this.setApitoken(apitoken);
        return this;
    }

    public void setApitoken(String apitoken) {
        this.apitoken = apitoken;
    }

    public String getBaseurl() {
        return this.baseurl;
    }

    public Instana baseurl(String baseurl) {
        this.setBaseurl(baseurl);
        return this;
    }

    public void setBaseurl(String baseurl) {
        this.baseurl = baseurl;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Instana)) {
            return false;
        }
        return getId() != null && getId().equals(((Instana) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Instana{" +
            "id=" + getId() +
            ", apitoken='" + getApitoken() + "'" +
            ", baseurl='" + getBaseurl() + "'" +
            "}";
    }
}
