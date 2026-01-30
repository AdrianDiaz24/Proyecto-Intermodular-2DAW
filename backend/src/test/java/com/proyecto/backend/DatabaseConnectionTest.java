package com.proyecto.backend;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

import javax.sql.DataSource;
import java.sql.Connection;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
public class DatabaseConnectionTest {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    public void testDatabaseConnection() {
        assertNotNull(dataSource, "DataSource no puede ser nulo");

        try (Connection connection = dataSource.getConnection()) {
            assertNotNull(connection, "La conexión no puede ser nula");
            assertTrue(!connection.isClosed(), "La conexión debe estar abierta");
            System.out.println("✓ Conexión a la base de datos exitosa!");
            System.out.println("  - URL: " + dataSource.getConnection().getMetaData().getURL());
            System.out.println("  - Database: " + dataSource.getConnection().getMetaData().getDatabaseProductName());
        } catch (Exception e) {
            System.err.println("✗ Error al conectar a la base de datos: " + e.getMessage());
            throw new RuntimeException("Error de conexión a BD", e);
        }
    }

    @Test
    public void testJdbcTemplate() {
        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            assertNotNull(result);
            System.out.println("✓ JdbcTemplate funciona correctamente!");
        } catch (Exception e) {
            System.err.println("✗ Error con JdbcTemplate: " + e.getMessage());
            throw new RuntimeException("Error de JdbcTemplate", e);
        }
    }

    @Test
    public void testVerificarTablas() {
        System.out.println("\n========== VERIFICACIÓN DE TABLAS ==========");
        try {
            // Listar todas las tablas
            var tablas = jdbcTemplate.queryForList("SHOW TABLES");
            System.out.println("📋 Tablas en la base de datos:");
            if (tablas.isEmpty()) {
                System.out.println("  ⚠️ NO HAY TABLAS CREADAS");
            } else {
                for (var tabla : tablas) {
                    System.out.println("  - " + tabla.values().iterator().next());
                }
            }

            // Verificar si existe la tabla usuarios
            String existeUsuarios = "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'usuarios'";
            Integer countUsuarios = jdbcTemplate.queryForObject(existeUsuarios, Integer.class);
            if (countUsuarios != null && countUsuarios > 0) {
                System.out.println("\n✓ Tabla 'usuarios' EXISTE");
                // Contar registros
                Integer numUsuarios = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM usuarios", Integer.class);
                System.out.println("  - Número de usuarios: " + numUsuarios);

                // Mostrar usuarios si hay
                if (numUsuarios != null && numUsuarios > 0) {
                    var usuarios = jdbcTemplate.queryForList("SELECT id, username, email, role FROM usuarios");
                    System.out.println("  - Usuarios registrados:");
                    for (var u : usuarios) {
                        System.out.println("    * ID: " + u.get("id") + ", Username: " + u.get("username") + ", Email: " + u.get("email") + ", Role: " + u.get("role"));
                    }
                }
            } else {
                System.out.println("\n✗ Tabla 'usuarios' NO EXISTE");
            }

            // Verificar tabla productos
            String existeProductos = "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'productos'";
            Integer countProductos = jdbcTemplate.queryForObject(existeProductos, Integer.class);
            if (countProductos != null && countProductos > 0) {
                System.out.println("✓ Tabla 'productos' EXISTE");
                Integer numProductos = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM productos", Integer.class);
                System.out.println("  - Número de productos: " + numProductos);
            } else {
                System.out.println("✗ Tabla 'productos' NO EXISTE");
            }

            // Verificar tabla incidencias
            String existeIncidencias = "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = 'incidencias'";
            Integer countIncidencias = jdbcTemplate.queryForObject(existeIncidencias, Integer.class);
            if (countIncidencias != null && countIncidencias > 0) {
                System.out.println("✓ Tabla 'incidencias' EXISTE");
                Integer numIncidencias = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM incidencias", Integer.class);
                System.out.println("  - Número de incidencias: " + numIncidencias);
            } else {
                System.out.println("✗ Tabla 'incidencias' NO EXISTE");
            }

            System.out.println("=============================================\n");
        } catch (Exception e) {
            System.err.println("✗ Error verificando tablas: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
