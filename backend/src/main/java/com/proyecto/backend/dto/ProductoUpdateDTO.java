package com.proyecto.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

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

    private String imagenBase64;

    @DecimalMin(value = "0.0", inclusive = false, message = "El peso debe ser mayor que 0")
    private BigDecimal peso;

    @DecimalMin(value = "0.0", inclusive = false, message = "El ancho debe ser mayor que 0")
    private BigDecimal ancho;

    @DecimalMin(value = "0.0", inclusive = false, message = "El largo debe ser mayor que 0")
    private BigDecimal largo;

    @DecimalMin(value = "0.0", inclusive = false, message = "El alto debe ser mayor que 0")
    private BigDecimal alto;

    @Size(max = 50, message = "El consumo eléctrico no puede tener más de 50 caracteres")
    private String consumoElectrico;

    private String otrasCaracteristicas;
}

