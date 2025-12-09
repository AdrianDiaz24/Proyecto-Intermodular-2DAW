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
    private String estado;
    private LocalDateTime fechaCreacion;
    private Long productoId;
    private String productoNombre;
    private Long usuarioId;
    private String usuarioUsername;
    private Integer totalSoluciones;

    public static IncidenciaDTO fromEntity(Incidencia incidencia) {
        return new IncidenciaDTO(
                incidencia.getId(),
                incidencia.getTitulo(),
                incidencia.getDescripcion(),
                incidencia.getEstado().name(),
                incidencia.getFechaCreacion(),
                incidencia.getProducto().getId(),
                incidencia.getProducto().getNombre(),
                incidencia.getUsuario().getId(),
                incidencia.getUsuario().getUsername(),
                incidencia.getSoluciones() != null ? incidencia.getSoluciones().size() : 0
        );
    }
}

