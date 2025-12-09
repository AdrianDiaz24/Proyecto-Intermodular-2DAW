package com.proyecto.backend.dto;

import com.proyecto.backend.model.Producto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDTO {

    private Long id;
    private String nombre;
    private String marca;
    private String modelo;
    private Long usuarioId;
    private String usuarioUsername;

    public static ProductoDTO fromEntity(Producto producto) {
        return new ProductoDTO(
                producto.getId(),
                producto.getNombre(),
                producto.getMarca(),
                producto.getModelo(),
                producto.getUsuario().getId(),
                producto.getUsuario().getUsername()
        );
    }
}

