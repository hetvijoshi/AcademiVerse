package com.academiverse.academiverse_api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "modules")
public class Module {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long moduleId;
    @ManyToOne
    @JoinColumn(name = "instructId", referencedColumnName = "instructId", nullable=false)
    private Instruct instructs;
    private String moduleName;
    private String moduleLink;
    @ManyToOne
    @JoinColumn(name = "parentModuleId", referencedColumnName = "moduleId", nullable=true)
    @JsonIgnore
    private Module parentModule;
    @OneToMany(mappedBy = "parentModule", cascade = CascadeType.REMOVE, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Module> documents;
    private boolean isActive;
    private Long createdBy;
    private Long updatedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
