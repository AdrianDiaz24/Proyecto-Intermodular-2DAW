package com.proyecto.backend.repository;

import com.proyecto.backend.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Buscar productos por usuario
    List<Producto> findByUsuarioId(Long usuarioId);

    // Buscar productos por nombre (búsqueda parcial)
    List<Producto> findByNombreContainingIgnoreCase(String nombre);

    // Buscar productos por marca
    List<Producto> findByMarcaIgnoreCase(String marca);

    // Buscar productos por modelo
    List<Producto> findByModeloIgnoreCase(String modelo);

    // Buscar productos por marca y modelo
    List<Producto> findByMarcaIgnoreCaseAndModeloIgnoreCase(String marca, String modelo);

    // Consulta personalizada: Productos con más incidencias
    @Query("SELECT p FROM Producto p LEFT JOIN p.incidencias i GROUP BY p ORDER BY COUNT(i) DESC")
    List<Producto> findProductosConMasIncidencias();

    // Consulta personalizada: Productos de un usuario específico con incidencias abiertas
    @Query("SELECT DISTINCT p FROM Producto p JOIN p.incidencias i WHERE p.usuario.id = :usuarioId AND i.estado = 'ABIERTA'")
    List<Producto> findProductosConIncidenciasAbiertasByUsuario(@Param("usuarioId") Long usuarioId);

    // Consulta personalizada: Buscar productos por nombre, marca o modelo
    @Query("SELECT p FROM Producto p WHERE " +
            "LOWER(p.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
            "LOWER(p.marca) LIKE LOWER(CONCAT('%', :busqueda, '%')) OR " +
            "LOWER(p.modelo) LIKE LOWER(CONCAT('%', :busqueda, '%'))")
    List<Producto> buscarPorNombreMarcaOModelo(@Param("busqueda") String busqueda);

    // Obtener todas las marcas distintas
    @Query("SELECT DISTINCT p.marca FROM Producto p WHERE p.marca IS NOT NULL ORDER BY p.marca")
    List<String> findAllMarcasDistintas();
}

