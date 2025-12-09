package com.proyecto.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoUpdateDTO {

    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    private String nombre;

    @Size(max = 50, message = "La marca no puede tener más de 50 caracteres")
    private String marca;

    @Size(max = 50, message = "El modelo no puede tener más de 50 caracteres")
    private String modelo;
}

