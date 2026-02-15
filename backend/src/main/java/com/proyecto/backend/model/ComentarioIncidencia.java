package com.proyecto.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Modelo de Comentario en Incidencia
 * Almacena comentarios y respuestas de los usuarios sobre incidencias
 */
@Entity
@Table(name = "comentarios_incidencias")
public class ComentarioIncidencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "contenido", columnDefinition = "TEXT", nullable = false)
    private String contenido;

    @Column(name = "incidencia_id", nullable = false)
    private Long incidenciaId;

    @Column(name = "usuario_id", nullable = false)
    private Long usuarioId;

    @Column(name = "es_solucion", nullable = false)
    private boolean esSolucion = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Relaciones
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "incidencia_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Incidencia incidencia;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Usuario usuario;

    // Constructores
    public ComentarioIncidencia() {}

    public ComentarioIncidencia(String contenido, Long incidenciaId, Long usuarioId, boolean esSolucion) {
        this.contenido = contenido;
        this.incidenciaId = incidenciaId;
        this.usuarioId = usuarioId;
        this.esSolucion = esSolucion;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters y Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }

    public Long getIncidenciaId() {
        return incidenciaId;
    }

    public void setIncidenciaId(Long incidenciaId) {
        this.incidenciaId = incidenciaId;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

    public boolean isEsSolucion() {
        return esSolucion;
    }

    public void setEsSolucion(boolean esSolucion) {
        this.esSolucion = esSolucion;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Incidencia getIncidencia() {
        return incidencia;
    }

    public void setIncidencia(Incidencia incidencia) {
        this.incidencia = incidencia;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }
}
