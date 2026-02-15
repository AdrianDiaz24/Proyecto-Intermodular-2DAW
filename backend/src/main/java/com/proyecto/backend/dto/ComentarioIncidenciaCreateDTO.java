package com.proyecto.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * DTO para crear/actualizar comentarios en incidencias
 */
public class ComentarioIncidenciaCreateDTO {
    @NotBlank(message = "El contenido del comentario es obligatorio")
    private String contenido;

    @NotNull(message = "El ID de incidencia es obligatorio")
    private Long incidenciaId;

    @NotNull(message = "El ID de usuario es obligatorio")
    private Long usuarioId;

    private boolean esSolucion = false;

    public ComentarioIncidenciaCreateDTO() {}

    public ComentarioIncidenciaCreateDTO(String contenido, Long incidenciaId, Long usuarioId, boolean esSolucion) {
        this.contenido = contenido;
        this.incidenciaId = incidenciaId;
        this.usuarioId = usuarioId;
        this.esSolucion = esSolucion;
    }

    // Getters y Setters
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
}
