package com.proyecto.backend.controller;

import com.proyecto.backend.dto.IncidenciaCreateDTO;
import com.proyecto.backend.dto.IncidenciaDTO;
import com.proyecto.backend.dto.IncidenciaUpdateDTO;
import com.proyecto.backend.model.Incidencia;
import com.proyecto.backend.service.IncidenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/incidencias")
public class IncidenciaController {

    @Autowired
    private IncidenciaService incidenciaService;

    /**
     * GET /api/incidencias - Obtiene todas las incidencias
     */
    @GetMapping
    public ResponseEntity<List<IncidenciaDTO>> obtenerTodas() {
        List<IncidenciaDTO> incidencias = incidenciaService.obtenerTodas();
        return ResponseEntity.ok(incidencias);
    }

    /**
     * GET /api/incidencias/{id} - Obtiene una incidencia por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<IncidenciaDTO> obtenerPorId(@PathVariable Long id) {
        IncidenciaDTO incidencia = incidenciaService.obtenerPorId(id);
        return ResponseEntity.ok(incidencia);
    }

    /**
     * GET /api/incidencias/producto/{productoId} - Obtiene incidencias de un producto
     */
    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<IncidenciaDTO>> obtenerPorProducto(@PathVariable Long productoId) {
        List<IncidenciaDTO> incidencias = incidenciaService.obtenerPorProducto(productoId);
        return ResponseEntity.ok(incidencias);
    }

    /**
     * GET /api/incidencias/usuario/{usuarioId} - Obtiene incidencias de un usuario
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<IncidenciaDTO>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        List<IncidenciaDTO> incidencias = incidenciaService.obtenerPorUsuario(usuarioId);
        return ResponseEntity.ok(incidencias);
    }

    /**
     * GET /api/incidencias/estado/{estado} - Obtiene incidencias por estado
     */
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<IncidenciaDTO>> obtenerPorEstado(@PathVariable String estado) {
        Incidencia.Estado estadoEnum = Incidencia.Estado.valueOf(estado.toUpperCase());
        List<IncidenciaDTO> incidencias = incidenciaService.obtenerPorEstado(estadoEnum);
        return ResponseEntity.ok(incidencias);
    }

    /**
     * POST /api/incidencias - Crea una nueva incidencia
     */
    @PostMapping
    public ResponseEntity<IncidenciaDTO> crear(@Valid @RequestBody IncidenciaCreateDTO createDTO) {
        IncidenciaDTO incidencia = incidenciaService.crear(createDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(incidencia);
    }

    /**
     * PUT /api/incidencias/{id} - Actualiza una incidencia existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<IncidenciaDTO> actualizar(@PathVariable Long id, @Valid @RequestBody IncidenciaUpdateDTO updateDTO) {
        IncidenciaDTO incidencia = incidenciaService.actualizar(id, updateDTO);
        return ResponseEntity.ok(incidencia);
    }

    /**
     * PATCH /api/incidencias/{id}/estado/{nuevoEstado} - Cambia el estado de una incidencia
     */
    @PatchMapping("/{id}/estado/{nuevoEstado}")
    public ResponseEntity<IncidenciaDTO> cambiarEstado(@PathVariable Long id, @PathVariable String nuevoEstado) {
        IncidenciaDTO incidencia = incidenciaService.cambiarEstado(id, nuevoEstado.toUpperCase());
        return ResponseEntity.ok(incidencia);
    }

    /**
     * DELETE /api/incidencias/{id} - Elimina una incidencia
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        incidenciaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/incidencias/stats/abiertas - Cuenta incidencias abiertas
     */
    @GetMapping("/stats/abiertas")
    public ResponseEntity<Long> contarAbiertas() {
        long count = incidenciaService.contarAbiertas();
        return ResponseEntity.ok(count);
    }

    /**
     * GET /api/incidencias/stats/en-progreso - Cuenta incidencias en progreso
     */
    @GetMapping("/stats/en-progreso")
    public ResponseEntity<Long> contarEnProgreso() {
        long count = incidenciaService.contarEnProgreso();
        return ResponseEntity.ok(count);
    }

    /**
     * GET /api/incidencias/stats/cerradas - Cuenta incidencias cerradas
     */
    @GetMapping("/stats/cerradas")
    public ResponseEntity<Long> contarCerradas() {
        long count = incidenciaService.contarCerradas();
        return ResponseEntity.ok(count);
    }
}

