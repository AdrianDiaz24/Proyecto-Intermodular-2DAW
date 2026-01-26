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
}
