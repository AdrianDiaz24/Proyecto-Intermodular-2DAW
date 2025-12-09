package com.proyecto.backend.repository;

import com.proyecto.backend.model.Solucion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SolucionRepository extends JpaRepository<Solucion, Long> {

    // Buscar soluciones por incidencia
    List<Solucion> findByIncidenciaId(Long incidenciaId);

    // Buscar soluciones por usuario que las escribió
    List<Solucion> findByUsuarioId(Long usuarioId);

    // Buscar soluciones ordenadas por votos (descendente)
    List<Solucion> findByIncidenciaIdOrderByVotosDesc(Long incidenciaId);

    // Buscar soluciones publicadas después de una fecha
    List<Solucion> findByFechaPublicacionAfter(LocalDateTime fecha);

    // Buscar soluciones con más de N votos
    List<Solucion> findByVotosGreaterThan(Integer votos);

    // Consulta personalizada: Soluciones más votadas de todas las incidencias
    @Query("SELECT s FROM Solucion s ORDER BY s.votos DESC")
    List<Solucion> findSolucionesMasVotadas();

    // Consulta personalizada: Soluciones de un usuario ordenadas por votos
    @Query("SELECT s FROM Solucion s WHERE s.usuario.id = :usuarioId ORDER BY s.votos DESC")
    List<Solucion> findSolucionesByUsuarioOrdenadas(@Param("usuarioId") Long usuarioId);

    // Consulta personalizada: Top N soluciones de una incidencia
    @Query("SELECT s FROM Solucion s WHERE s.incidencia.id = :incidenciaId ORDER BY s.votos DESC")
    List<Solucion> findTopSolucionesByIncidencia(@Param("incidenciaId") Long incidenciaId);

    // Consulta personalizada: Contar soluciones por usuario
    @Query("SELECT s.usuario.id, s.usuario.username, COUNT(s) FROM Solucion s GROUP BY s.usuario.id, s.usuario.username ORDER BY COUNT(s) DESC")
    List<Object[]> contarSolucionesPorUsuario();

    // Consulta personalizada: Suma total de votos de un usuario
    @Query("SELECT COALESCE(SUM(s.votos), 0) FROM Solucion s WHERE s.usuario.id = :usuarioId")
    Integer sumaTotalVotosByUsuario(@Param("usuarioId") Long usuarioId);

    // Consulta personalizada: Incrementar votos de una solución
    @Modifying
    @Query("UPDATE Solucion s SET s.votos = s.votos + 1 WHERE s.id = :solucionId")
    void incrementarVotos(@Param("solucionId") Long solucionId);

    // Consulta personalizada: Buscar soluciones por descripción
    @Query("SELECT s FROM Solucion s WHERE LOWER(s.descripcion) LIKE LOWER(CONCAT('%', :busqueda, '%'))")
    List<Solucion> buscarPorDescripcion(@Param("busqueda") String busqueda);

    // Soluciones recientes
    @Query("SELECT s FROM Solucion s ORDER BY s.fechaPublicacion DESC")
    List<Solucion> findSolucionesRecientes();
}

