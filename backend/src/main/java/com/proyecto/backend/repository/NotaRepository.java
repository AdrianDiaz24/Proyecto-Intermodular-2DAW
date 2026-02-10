package com.proyecto.backend.repository;

import com.proyecto.backend.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotaRepository extends JpaRepository<Nota, Long> {


    List<Nota> findByIncidenciaId(Long incidenciaId);

    /**
     * Obtiene todas las notas creadas por un usuario
     */
    List<Nota> findByUsuarioId(Long usuarioId);

    /**
     * Obtiene todas las notas de una incidencia de un usuario específico
     */
    List<Nota> findByIncidenciaIdAndUsuarioId(Long incidenciaId, Long usuarioId);

    /**
     * Cuenta las notas de una incidencia
     */
    long countByIncidenciaId(Long incidenciaId);
}
