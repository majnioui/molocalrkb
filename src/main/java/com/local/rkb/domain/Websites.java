package com.local.rkb.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Websites.
 */
@Entity
@Table(name = "websites")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Websites implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "website")
    private String website;

    @Column(name = "website_id")
    private String websiteId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Websites id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWebsite() {
        return this.website;
    }

    public Websites website(String website) {
        this.setWebsite(website);
        return this;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getWebsiteId() {
        return this.websiteId;
    }

    public Websites websiteId(String websiteId) {
        this.setWebsiteId(websiteId);
        return this;
    }

    public void setWebsiteId(String websiteId) {
        this.websiteId = websiteId;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Websites)) {
            return false;
        }
        return getId() != null && getId().equals(((Websites) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Websites{" +
            "id=" + getId() +
            ", website='" + getWebsite() + "'" +
            ", websiteId='" + getWebsiteId() + "'" +
            "}";
    }
}
