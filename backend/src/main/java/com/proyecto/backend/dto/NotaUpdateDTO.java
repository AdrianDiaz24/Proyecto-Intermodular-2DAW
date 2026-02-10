package com.proyecto.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


public class NotaUpdateDTO {

    @NotBlank(message = "El contenido de la nota no puede estar vacío")
    @Size(min = 1, max = 5000, message = "El contenido debe tener entre 1 y 5000 caracteres")
    private String contenido;

    public NotaUpdateDTO() {}

    public NotaUpdateDTO(String contenido) {
        this.contenido = contenido;
    }


    public String getContenido() {
        return contenido;
    }

    public void setContenido(String contenido) {
        this.contenido = contenido;
    }
}
