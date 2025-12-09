package com.proyecto.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolucionUpdateDTO {

    @Size(min = 10, message = "La descripción debe tener al menos 10 caracteres")
    private String descripcion;

    @Min(value = 0, message = "Los votos no pueden ser negativos")
    private Integer votos;
}

