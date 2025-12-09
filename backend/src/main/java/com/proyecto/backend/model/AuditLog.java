package com.proyecto.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String operacion; // CREATE, UPDATE, DELETE

    @Column(nullable = false, length = 50)
    private String entidad; // Usuario, Producto, Incidencia, Solucion

    @Column(nullable = false)
    private Long entidadId;

    @Column(nullable = false)
    private Long usuarioId;

    @Column(length = 100)
    private String usuarioUsername;

    @Column(columnDefinition = "TEXT")
    private String cambios; // JSON con los cambios realizados

    @Column(nullable = false)
    private LocalDateTime fechaOperacion;

    @Column(length = 500)
    private String detalles;
}

