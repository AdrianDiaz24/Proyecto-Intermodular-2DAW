package com.proyecto.backend.repository;

import com.proyecto.backend.model.Incidencia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IncidenciaRepository extends JpaRepository<Incidencia, Long> {

    // Buscar incidencias por estado
    List<Incidencia> findByEstado(Incidencia.Estado estado);

    // Buscar incidencias por producto
    List<Incidencia> findByProductoId(Long productoId);

    // Buscar incidencias por usuario que las reportó
    List<Incidencia> findByUsuarioId(Long usuarioId);

    // Buscar incidencias por título (búsqueda parcial)
    List<Incidencia> findByTituloContainingIgnoreCase(String titulo);

    // Buscar incidencias creadas después de una fecha
    List<Incidencia> findByFechaCreacionAfter(LocalDateTime fecha);

    // Buscar incidencias creadas entre dos fechas
    List<Incidencia> findByFechaCreacionBetween(LocalDateTime fechaInicio, LocalDateTime fechaFin);

    // Buscar incidencias por estado y usuario
    List<Incidencia> findByEstadoAndUsuarioId(Incidencia.Estado estado, Long usuarioId);

    // Consulta personalizada: Incidencias con más soluciones
    @Query("SELECT i FROM Incidencia i LEFT JOIN i.soluciones s GROUP BY i ORDER BY COUNT(s) DESC")
    List<Incidencia> findIncidenciasConMasSoluciones();

    // Consulta personalizada: Incidencias abiertas sin soluciones
    @Query("SELECT i FROM Incidencia i WHERE i.estado = 'ABIERTA' AND i.soluciones IS EMPTY")
    List<Incidencia> findIncidenciasAbiertasSinSoluciones();

    // Consulta personalizada: Incidencias de un producto específico ordenadas por fecha
    @Query("SELECT i FROM Incidencia i WHERE i.producto.id = :productoId ORDER BY i.fechaCreacion DESC")
    List<Incidencia> findIncidenciasByProductoOrdenadas(@Param("productoId") Long productoId);

    // Consulta personalizada: Buscar incidencias por título o descripción
    @Query("SELECT i FROM Incidencia i WHERE " +
            "LOWER(i.titulo) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
            "LOWER(i.descripcion) LIKE LOWER(CONCAT('%', :busqueda, '%'))")
    List<Incidencia> buscarPorTituloODescripcion(@Param("busqueda") String busqueda);

    // Consulta personalizada: Contar incidencias por estado
    @Query("SELECT i.estado, COUNT(i) FROM Incidencia i GROUP BY i.estado")
    List<Object[]> contarIncidenciasPorEstado();

    // Incidencias recientes (últimas N)
    @Query("SELECT i FROM Incidencia i ORDER BY i.fechaCreacion DESC")
    List<Incidencia> findIncidenciasRecientes();
}

