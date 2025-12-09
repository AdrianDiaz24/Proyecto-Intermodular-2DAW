package com.proyecto.backend.service;

import com.proyecto.backend.model.AuditLog;
import com.proyecto.backend.repository.AuditLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AuditLogService {

    @Autowired
    private AuditLogRepository auditLogRepository;

    /**
     * Registra una operación en el log de auditoría
     */
    public AuditLog registrarOperacion(String operacion, String entidad, Long entidadId,
                                       Long usuarioId, String usuarioUsername, String cambios) {
        AuditLog log = new AuditLog();
        log.setOperacion(operacion);
        log.setEntidad(entidad);
        log.setEntidadId(entidadId);
        log.setUsuarioId(usuarioId);
        log.setUsuarioUsername(usuarioUsername);
        log.setCambios(cambios);
        log.setFechaOperacion(LocalDateTime.now());

        return auditLogRepository.save(log);
    }

    /**
     * Registra con detalles adicionales
     */
    public AuditLog registrarOperacion(String operacion, String entidad, Long entidadId,
                                       Long usuarioId, String usuarioUsername, String cambios, String detalles) {
        AuditLog log = registrarOperacion(operacion, entidad, entidadId, usuarioId, usuarioUsername, cambios);
        log.setDetalles(detalles);
        return auditLogRepository.save(log);
    }

    /**
     * Obtiene el historial de auditoría de una entidad
     */
    public List<AuditLog> obtenerHistorialEntidad(String entidad, Long entidadId) {
        return auditLogRepository.findByEntidadId(entidadId);
    }

    /**
     * Obtiene el historial de operaciones de un usuario
     */
    public List<AuditLog> obtenerHistorialUsuario(Long usuarioId) {
        return auditLogRepository.findByUsuarioId(usuarioId);
    }

    /**
     * Obtiene auditorías dentro de un rango de fechas
     */
    public List<AuditLog> obtenerPorRangoFechas(LocalDateTime inicio, LocalDateTime fin) {
        return auditLogRepository.findByFechaOperacionBetween(inicio, fin);
    }

    /**
     * Obtiene todas las auditorías de un tipo de entidad
     */
    public List<AuditLog> obtenerPorEntidad(String entidad) {
        return auditLogRepository.findByEntidad(entidad);
    }
}

