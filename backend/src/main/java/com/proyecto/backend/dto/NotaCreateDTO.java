package com.proyecto.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


public class NotaCreateDTO {

    @NotBlank(message = "El contenido de la nota no puede estar vacío")
    @Size(min = 1, max = 5000, message = "El contenido debe tener entre 1 y 5000 caracteres")
    private String contenido;

    @NotNull(message = "El ID de la incidencia es requerido")
    private Long incidenciaId;

    public NotaCreateDTO() {}

    public NotaCreateDTO(String contenido, Long incidenciaId) {
        this.contenido = contenido;
        this.incidenciaId = incidenciaId;
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
}
