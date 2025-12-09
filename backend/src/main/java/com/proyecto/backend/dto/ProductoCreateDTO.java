package com.proyecto.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoCreateDTO {

    private String nombre;
    private String marca;
    private String modelo;
    private Long usuarioId;
}

