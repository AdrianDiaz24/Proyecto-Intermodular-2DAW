package com.proyecto.backend.controller;

import com.proyecto.backend.model.AuditLog;
import com.proyecto.backend.service.AuditLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/auditoria")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"}, allowCredentials = "true")
public class AuditLogController {

    @Autowired
    private AuditLogService auditLogService;

    /**
     * GET /api/auditoria/entidad/{entidad}/{entidadId} - Obtiene historial de auditoría de una entidad
     */
    @GetMapping("/entidad/{entidad}/{entidadId}")
    public ResponseEntity<List<AuditLog>> obtenerHistorialEntidad(@PathVariable String entidad, @PathVariable Long entidadId) {
        List<AuditLog> historiales = auditLogService.obtenerHistorialEntidad(entidad, entidadId);
        return ResponseEntity.ok(historiales);
    }

    /**
     * GET /api/auditoria/usuario/{usuarioId} - Obtiene historial de auditoría de un usuario
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<AuditLog>> obtenerHistorialUsuario(@PathVariable Long usuarioId) {
        List<AuditLog> historiales = auditLogService.obtenerHistorialUsuario(usuarioId);
        return ResponseEntity.ok(historiales);
    }

    /**
     * GET /api/auditoria/tipo/{tipo} - Obtiene auditorías por tipo de entidad
     */
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<List<AuditLog>> obtenerPorEntidad(@PathVariable String tipo) {
        List<AuditLog> auditorias = auditLogService.obtenerPorEntidad(tipo);
        return ResponseEntity.ok(auditorias);
    }

    /**
     * GET /api/auditoria/rango - Obtiene auditorías dentro de un rango de fechas
     *
     * Parámetros:
     * - inicio: LocalDateTime (ej: 2024-01-01T00:00:00)
     * - fin: LocalDateTime (ej: 2024-12-31T23:59:59)
     */
    @GetMapping("/rango")
    public ResponseEntity<List<AuditLog>> obtenerPorRangoFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        List<AuditLog> auditorias = auditLogService.obtenerPorRangoFechas(inicio, fin);
        return ResponseEntity.ok(auditorias);
    }
}

