package com.local.rkb.domain;

import jakarta.persistence.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A InfraTopology.
 */
@Entity
@Table(name = "infra_topology")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class InfraTopology implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "plugin")
    private String plugin;

    @Column(name = "label")
    private String label;

    @Column(name = "plugin_id")
    private String pluginId;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public InfraTopology id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlugin() {
        return this.plugin;
    }

    public InfraTopology plugin(String plugin) {
        this.setPlugin(plugin);
        return this;
    }

    public void setPlugin(String plugin) {
        this.plugin = plugin;
    }

    public String getLabel() {
        return this.label;
    }

    public InfraTopology label(String label) {
        this.setLabel(label);
        return this;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getPluginId() {
        return this.pluginId;
    }

    public InfraTopology pluginId(String pluginId) {
        this.setPluginId(pluginId);
        return this;
    }

    public void setPluginId(String pluginId) {
        this.pluginId = pluginId;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof InfraTopology)) {
            return false;
        }
        return getId() != null && getId().equals(((InfraTopology) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "InfraTopology{" +
            "id=" + getId() +
            ", plugin='" + getPlugin() + "'" +
            ", label='" + getLabel() + "'" +
            ", pluginId='" + getPluginId() + "'" +
            "}";
    }
}
