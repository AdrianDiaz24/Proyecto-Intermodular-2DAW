package com.proyecto.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidenciaUpdateDTO {

    @Size(min = 5, max = 150, message = "El título debe tener entre 5 y 150 caracteres")
    private String titulo;

    @Size(min = 10, message = "La descripción debe tener al menos 10 caracteres")
    private String descripcion;

    @Pattern(regexp = "^(FUNCIONALIDAD|RENDIMIENTO|APARIENCIA|OTRO)$", message = "La categoría debe ser FUNCIONALIDAD, RENDIMIENTO, APARIENCIA u OTRO")
    private String categoria;

    @Pattern(regexp = "^(ALTO|MEDIO|BAJO)$", message = "La severidad debe ser ALTO, MEDIO o BAJO")
    private String severidad;

    @Pattern(regexp = "^(ABIERTA|CERRADA|EN_PROGRESO)$", message = "El estado debe ser ABIERTA, CERRADA o EN_PROGRESO")
    private String estado;
}

