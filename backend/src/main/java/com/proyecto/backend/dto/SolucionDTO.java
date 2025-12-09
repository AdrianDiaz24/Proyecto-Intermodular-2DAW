package com.proyecto.backend.dto;

import com.proyecto.backend.model.Solucion;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SolucionDTO {

    private Long id;
    private String descripcion;
    private Integer votos;
    private LocalDateTime fechaPublicacion;
    private Long incidenciaId;
    private String incidenciaTitulo;
    private Long usuarioId;
    private String usuarioUsername;

    public static SolucionDTO fromEntity(Solucion solucion) {
        return new SolucionDTO(
                solucion.getId(),
                solucion.getDescripcion(),
                solucion.getVotos(),
                solucion.getFechaPublicacion(),
                solucion.getIncidencia().getId(),
                solucion.getIncidencia().getTitulo(),
                solucion.getUsuario().getId(),
                solucion.getUsuario().getUsername()
        );
    }
}

