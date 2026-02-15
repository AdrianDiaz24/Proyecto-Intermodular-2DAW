package com.proyecto.backend.controller;

import com.proyecto.backend.dto.ComentarioIncidenciaDTO;
import com.proyecto.backend.dto.ComentarioIncidenciaCreateDTO;
import com.proyecto.backend.service.ComentarioIncidenciaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

/**
 * Controlador para gestionar comentarios en incidencias
 * Endpoints para crear, listar, actualizar y eliminar comentarios
 */
@RestController
@RequestMapping("/api/comentarios-incidencias")
public class ComentarioIncidenciaController {

    @Autowired
    private ComentarioIncidenciaService comentarioService;

    /**
     * GET /api/comentarios-incidencias - Obtiene todos los comentarios
     */
    @GetMapping
    public ResponseEntity<List<ComentarioIncidenciaDTO>> obtenerTodos() {
        List<ComentarioIncidenciaDTO> comentarios = comentarioService.obtenerTodos();
        return ResponseEntity.ok(comentarios);
    }

    /**
     * GET /api/comentarios-incidencias/{id} - Obtiene un comentario por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ComentarioIncidenciaDTO> obtenerPorId(@PathVariable Long id) {
        ComentarioIncidenciaDTO comentario = comentarioService.obtenerPorId(id);
        return ResponseEntity.ok(comentario);
    }

    /**
     * GET /api/comentarios-incidencias/incidencia/{incidenciaId} - Obtiene comentarios de una incidencia
     */
    @GetMapping("/incidencia/{incidenciaId}")
    public ResponseEntity<List<ComentarioIncidenciaDTO>> obtenerPorIncidencia(@PathVariable Long incidenciaId) {
        List<ComentarioIncidenciaDTO> comentarios = comentarioService.obtenerPorIncidencia(incidenciaId);
        return ResponseEntity.ok(comentarios);
    }

    /**
     * GET /api/comentarios-incidencias/usuario/{usuarioId} - Obtiene comentarios de un usuario
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ComentarioIncidenciaDTO>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        List<ComentarioIncidenciaDTO> comentarios = comentarioService.obtenerPorUsuario(usuarioId);
        return ResponseEntity.ok(comentarios);
    }

    /**
     * GET /api/comentarios-incidencias/incidencia/{incidenciaId}/soluciones - Obtiene soluciones de una incidencia
     */
    @GetMapping("/incidencia/{incidenciaId}/soluciones")
    public ResponseEntity<List<ComentarioIncidenciaDTO>> obtenerSolucionesIncidencia(@PathVariable Long incidenciaId) {
        List<ComentarioIncidenciaDTO> soluciones = comentarioService.obtenerSolucionesIncidencia(incidenciaId);
        return ResponseEntity.ok(soluciones);
    }

    /**
     * POST /api/comentarios-incidencias - Crea un nuevo comentario
     */
    @PostMapping
    public ResponseEntity<ComentarioIncidenciaDTO> crear(@Valid @RequestBody ComentarioIncidenciaCreateDTO createDTO) {
        ComentarioIncidenciaDTO comentario = comentarioService.crear(createDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(comentario);
    }

    /**
     * PUT /api/comentarios-incidencias/{id} - Actualiza un comentario existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<ComentarioIncidenciaDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody ComentarioIncidenciaCreateDTO updateDTO) {
        ComentarioIncidenciaDTO comentario = comentarioService.actualizar(id, updateDTO);
        return ResponseEntity.ok(comentario);
    }

    /**
     * DELETE /api/comentarios-incidencias/{id} - Elimina un comentario
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        comentarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * PATCH /api/comentarios-incidencias/{id}/solucion - Marca/desmarca un comentario como solución
     */
    @PatchMapping("/{id}/solucion")
    public ResponseEntity<ComentarioIncidenciaDTO> marcarComoSolucion(
            @PathVariable Long id,
            @RequestParam boolean esSolucion) {
        ComentarioIncidenciaDTO comentario = comentarioService.marcarComoSolucion(id, esSolucion);
        return ResponseEntity.ok(comentario);
    }
}
