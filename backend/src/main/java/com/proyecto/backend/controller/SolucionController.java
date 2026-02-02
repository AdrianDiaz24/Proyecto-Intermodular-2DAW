package com.proyecto.backend.controller;

import com.proyecto.backend.dto.SolucionCreateDTO;
import com.proyecto.backend.dto.SolucionDTO;
import com.proyecto.backend.dto.SolucionUpdateDTO;
import com.proyecto.backend.service.SolucionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/soluciones")
public class SolucionController {

    @Autowired
    private SolucionService solucionService;

    /**
     * GET /api/soluciones - Obtiene todas las soluciones
     */
    @GetMapping
    public ResponseEntity<List<SolucionDTO>> obtenerTodas() {
        List<SolucionDTO> soluciones = solucionService.obtenerTodas();
        return ResponseEntity.ok(soluciones);
    }

    /**
     * GET /api/soluciones/{id} - Obtiene una solución por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<SolucionDTO> obtenerPorId(@PathVariable Long id) {
        SolucionDTO solucion = solucionService.obtenerPorId(id);
        return ResponseEntity.ok(solucion);
    }

    /**
     * GET /api/soluciones/incidencia/{incidenciaId} - Obtiene soluciones de una incidencia
     */
    @GetMapping("/incidencia/{incidenciaId}")
    public ResponseEntity<List<SolucionDTO>> obtenerPorIncidencia(@PathVariable Long incidenciaId) {
        List<SolucionDTO> soluciones = solucionService.obtenerPorIncidencia(incidenciaId);
        return ResponseEntity.ok(soluciones);
    }

    /**
     * GET /api/soluciones/usuario/{usuarioId} - Obtiene soluciones de un usuario
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<SolucionDTO>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        List<SolucionDTO> soluciones = solucionService.obtenerPorUsuario(usuarioId);
        return ResponseEntity.ok(soluciones);
    }

    /**
     * POST /api/soluciones - Crea una nueva solución
     */
    @PostMapping
    public ResponseEntity<SolucionDTO> crear(@Valid @RequestBody SolucionCreateDTO createDTO) {
        SolucionDTO solucion = solucionService.crear(createDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(solucion);
    }

    /**
     * PUT /api/soluciones/{id} - Actualiza una solución existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<SolucionDTO> actualizar(@PathVariable Long id, @Valid @RequestBody SolucionUpdateDTO updateDTO) {
        SolucionDTO solucion = solucionService.actualizar(id, updateDTO);
        return ResponseEntity.ok(solucion);
    }

    /**
     * DELETE /api/soluciones/{id} - Elimina una solución
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        solucionService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * POST /api/soluciones/{id}/voto - Agrega un voto a una solución
     */
    @PostMapping("/{id}/voto")
    public ResponseEntity<SolucionDTO> agregarVoto(@PathVariable Long id) {
        SolucionDTO solucion = solucionService.agregarVoto(id);
        return ResponseEntity.ok(solucion);
    }

    /**
     * GET /api/soluciones/incidencia/{incidenciaId}/mas-votadas - Obtiene soluciones más votadas de una incidencia
     */
    @GetMapping("/incidencia/{incidenciaId}/mas-votadas")
    public ResponseEntity<List<SolucionDTO>> obtenerMasVotadasPorIncidencia(@PathVariable Long incidenciaId) {
        List<SolucionDTO> soluciones = solucionService.obtenerMasVotadasPorIncidencia(incidenciaId);
        return ResponseEntity.ok(soluciones);
    }
}

