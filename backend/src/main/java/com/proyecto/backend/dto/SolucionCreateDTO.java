package com.proyecto.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolucionCreateDTO {

    private String descripcion;
    private Long incidenciaId;
    private Long usuarioId;
}

