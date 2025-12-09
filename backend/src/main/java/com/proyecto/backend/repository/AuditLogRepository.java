package com.proyecto.backend.repository;

import com.proyecto.backend.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByEntidad(String entidad);
    List<AuditLog> findByEntidadId(Long entidadId);
    List<AuditLog> findByUsuarioId(Long usuarioId);
    List<AuditLog> findByFechaOperacionBetween(LocalDateTime inicio, LocalDateTime fin);
}

