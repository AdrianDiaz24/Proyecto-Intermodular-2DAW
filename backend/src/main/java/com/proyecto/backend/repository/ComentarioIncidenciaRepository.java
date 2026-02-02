package com.proyecto.backend.repository;

import com.proyecto.backend.model.ComentarioIncidencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para ComentarioIncidencia
 */
@Repository
public interface ComentarioIncidenciaRepository extends JpaRepository<ComentarioIncidencia, Long> {

    /**
     * Obtiene todos los comentarios de una incidencia
     */
    List<ComentarioIncidencia> findByIncidenciaId(Long incidenciaId);

    /**
     * Obtiene todos los comentarios de un usuario
     */
    List<ComentarioIncidencia> findByUsuarioId(Long usuarioId);

    /**
     * Obtiene soluciones de una incidencia
     */
    List<ComentarioIncidencia> findByIncidenciaIdAndEsSolucionTrue(Long incidenciaId);

    /**
     * Obtiene comentarios que son soluciones de un usuario
     */
    List<ComentarioIncidencia> findByUsuarioIdAndEsSolucionTrue(Long usuarioId);
}
