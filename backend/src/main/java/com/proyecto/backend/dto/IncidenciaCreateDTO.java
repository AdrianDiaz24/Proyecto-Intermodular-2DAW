package com.proyecto.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidenciaCreateDTO {

    @NotBlank(message = "El título es obligatorio")
    @Size(min = 5, max = 150, message = "El título debe tener entre 5 y 150 caracteres")
    private String titulo;

    @NotBlank(message = "La descripción es obligatoria")
    @Size(min = 10, message = "La descripción debe tener al menos 10 caracteres")
    private String descripcion;

    @NotBlank(message = "La categoría es obligatoria")
    @Pattern(regexp = "^(FUNCIONALIDAD|RENDIMIENTO|APARIENCIA|OTRO)$", message = "La categoría debe ser FUNCIONALIDAD, RENDIMIENTO, APARIENCIA u OTRO")
    private String categoria;

    @NotBlank(message = "La severidad es obligatoria")
    @Pattern(regexp = "^(ALTO|MEDIO|BAJO)$", message = "La severidad debe ser ALTO, MEDIO o BAJO")
    private String severidad;

    @Positive(message = "El ID del producto debe ser positivo")
    private Long productoId;

    @NotNull(message = "El ID del usuario es obligatorio")
    @Positive(message = "El ID del usuario debe ser positivo")
    private Long usuarioId;
}

