package com.local.rkb.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
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

    @Column(name = "cls")
    private String cls;

    @Column(name = "page_views")
    private String pageViews;

    @Column(name = "page_loads")
    private String pageLoads;

    @Column(name = "on_load_time")
    private String onLoadTime;

    @Column(name = "date")
    private Instant date;

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

    public String getCls() {
        return this.cls;
    }

    public Websites cls(String cls) {
        this.setCls(cls);
        return this;
    }

    public void setCls(String cls) {
        this.cls = cls;
    }

    public String getPageViews() {
        return this.pageViews;
    }

    public Websites pageViews(String pageViews) {
        this.setPageViews(pageViews);
        return this;
    }

    public void setPageViews(String pageViews) {
        this.pageViews = pageViews;
    }

    public String getPageLoads() {
        return this.pageLoads;
    }

    public Websites pageLoads(String pageLoads) {
        this.setPageLoads(pageLoads);
        return this;
    }

    public void setPageLoads(String pageLoads) {
        this.pageLoads = pageLoads;
    }

    public String getOnLoadTime() {
        return this.onLoadTime;
    }

    public Websites onLoadTime(String onLoadTime) {
        this.setOnLoadTime(onLoadTime);
        return this;
    }

    public void setOnLoadTime(String onLoadTime) {
        this.onLoadTime = onLoadTime;
    }

    public Instant getDate() {
        return this.date;
    }

    public Websites date(Instant date) {
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
            ", cls='" + getCls() + "'" +
            ", pageViews='" + getPageViews() + "'" +
            ", pageLoads='" + getPageLoads() + "'" +
            ", onLoadTime='" + getOnLoadTime() + "'" +
            ", date='" + getDate() + "'" +
            "}";
    }
}
