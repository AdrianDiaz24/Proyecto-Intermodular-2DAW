package com.proyecto.backend.dto;

import com.proyecto.backend.model.Nota;
import java.time.LocalDateTime;


public class NotaDTO {
    private Long id;
    private String contenido;
    private Long incidenciaId;
    private Long usuarioId;
    private UsuarioDTO usuario;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public NotaDTO() {}

    public NotaDTO(Long id, String contenido, Long incidenciaId, Long usuarioId, UsuarioDTO usuario, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.contenido = contenido;
        this.incidenciaId = incidenciaId;
        this.usuarioId = usuarioId;
        this.usuario = usuario;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }


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


    public static NotaDTO fromEntity(Nota nota) {
        if (nota == null) {
            return null;
        }
        return new NotaDTO(
                nota.getId(),
                nota.getContenido(),
                nota.getIncidencia() != null ? nota.getIncidencia().getId() : null,
                nota.getUsuario() != null ? nota.getUsuario().getId() : null,
                nota.getUsuario() != null ? UsuarioDTO.fromEntity(nota.getUsuario()) : null,
                nota.getCreatedAt(),
                nota.getUpdatedAt()
        );
    }
}
