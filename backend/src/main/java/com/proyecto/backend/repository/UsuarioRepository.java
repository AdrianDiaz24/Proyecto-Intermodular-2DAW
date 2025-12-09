package com.proyecto.backend.repository;

import com.proyecto.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    // Buscar por username
    Optional<Usuario> findByUsername(String username);

    // Buscar por email
    Optional<Usuario> findByEmail(String email);

    // Verificar si existe por username
    boolean existsByUsername(String username);

    // Verificar si existe por email
    boolean existsByEmail(String email);

    // Buscar usuarios por rol
    List<Usuario> findByRole(Usuario.Role role);

    // Buscar usuarios que contengan un texto en su username (búsqueda parcial)
    List<Usuario> findByUsernameContainingIgnoreCase(String username);

    // Consulta personalizada: Usuarios con más productos registrados
    @Query("SELECT u FROM Usuario u LEFT JOIN u.productos p GROUP BY u ORDER BY COUNT(p) DESC")
    List<Usuario> findUsuariosConMasProductos();

    // Consulta personalizada: Usuarios con más incidencias reportadas
    @Query("SELECT u FROM Usuario u LEFT JOIN u.incidencias i GROUP BY u ORDER BY COUNT(i) DESC")
    List<Usuario> findUsuariosConMasIncidencias();

    // Consulta personalizada: Usuarios con más soluciones aportadas
    @Query("SELECT u FROM Usuario u LEFT JOIN u.soluciones s GROUP BY u ORDER BY COUNT(s) DESC")
    List<Usuario> findUsuariosConMasSoluciones();

    // Consulta personalizada: Buscar usuario por username o email
    @Query("SELECT u FROM Usuario u WHERE u.username = :valor OR u.email = :valor")
    Optional<Usuario> findByUsernameOrEmail(@Param("valor") String valor);
}

