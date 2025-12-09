package com.proyecto.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidenciaCreateDTO {

    private String titulo;
    private String descripcion;
    private Long productoId;
    private Long usuarioId;
}

