package com.proyecto.backend.dto;

import com.proyecto.backend.model.Producto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Base64;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDTO {

    private Long id;
    private String nombre;
    private String marca;
    private String modelo;
    private String imagenBase64;
    private BigDecimal peso;
    private BigDecimal ancho;
    private BigDecimal largo;
    private BigDecimal alto;
    private String consumoElectrico;
    private String otrasCaracteristicas;
    private Long usuarioId;
    private String usuarioUsername;

    public static ProductoDTO fromEntity(Producto producto) {
        ProductoDTO dto = new ProductoDTO();
        dto.setId(producto.getId());
        dto.setNombre(producto.getNombre());
        dto.setMarca(producto.getMarca());
        dto.setModelo(producto.getModelo());
        dto.setPeso(producto.getPeso());
        dto.setAncho(producto.getAncho());
        dto.setLargo(producto.getLargo());
        dto.setAlto(producto.getAlto());
        dto.setConsumoElectrico(producto.getConsumoElectrico());
        dto.setOtrasCaracteristicas(producto.getOtrasCaracteristicas());
        dto.setUsuarioId(producto.getUsuario().getId());
        dto.setUsuarioUsername(producto.getUsuario().getUsername());

        // Convertir imagen a Base64 si existe
        if (producto.getImagen() != null) {
            dto.setImagenBase64(Base64.getEncoder().encodeToString(producto.getImagen()));
        }

        return dto;
    }
}

