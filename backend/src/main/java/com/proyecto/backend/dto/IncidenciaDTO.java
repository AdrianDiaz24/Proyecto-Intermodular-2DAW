package com.proyecto.backend.dto;

import com.proyecto.backend.model.Incidencia;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidenciaDTO {

    private Long id;
    private String titulo;
    private String descripcion;
    private String categoria;
    private String severidad;
    private String estado;
    private LocalDateTime fechaCreacion;
    private Long productoId;
    private String productoNombre;
    private Long usuarioId;
    private String usuarioUsername;
    private Integer totalSoluciones;

    public static IncidenciaDTO fromEntity(Incidencia incidencia) {
        IncidenciaDTO dto = new IncidenciaDTO();
        dto.setId(incidencia.getId());
        dto.setTitulo(incidencia.getTitulo());
        dto.setDescripcion(incidencia.getDescripcion());
        dto.setCategoria(incidencia.getCategoria().name());
        dto.setSeveridad(incidencia.getSeveridad().name());
        dto.setEstado(incidencia.getEstado().name());
        dto.setFechaCreacion(incidencia.getFechaCreacion());
        dto.setUsuarioId(incidencia.getUsuario().getId());
        dto.setUsuarioUsername(incidencia.getUsuario().getUsername());
        dto.setTotalSoluciones(incidencia.getSoluciones() != null ? incidencia.getSoluciones().size() : 0);

        // Producto es opcional
        if (incidencia.getProducto() != null) {
            dto.setProductoId(incidencia.getProducto().getId());
            dto.setProductoNombre(incidencia.getProducto().getNombre());
        }

        return dto;
    }
}

