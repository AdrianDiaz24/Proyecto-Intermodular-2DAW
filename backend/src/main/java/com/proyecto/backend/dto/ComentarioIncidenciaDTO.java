package com.proyecto.backend.dto;

import java.time.LocalDateTime;

/**
 * DTO para transferencia de datos de Comentario de Incidencia
 */
public class ComentarioIncidenciaDTO {
    private Long id;
    private String contenido;
    private Long incidenciaId;
    private Long usuarioId;
    private UsuarioDTO usuario;
    private boolean esSolucion;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ComentarioIncidenciaDTO() {}

    public ComentarioIncidenciaDTO(Long id, String contenido, Long incidenciaId, Long usuarioId, UsuarioDTO usuario, boolean esSolucion, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.contenido = contenido;
        this.incidenciaId = incidenciaId;
        this.usuarioId = usuarioId;
        this.usuario = usuario;
        this.esSolucion = esSolucion;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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

    public UsuarioDTO getUsuario() {
        return usuario;
    }

    public void setUsuario(UsuarioDTO usuario) {
        this.usuario = usuario;
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
}
