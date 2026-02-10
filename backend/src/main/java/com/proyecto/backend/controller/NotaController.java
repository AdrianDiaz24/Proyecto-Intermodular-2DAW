package com.proyecto.backend.controller;

import com.proyecto.backend.dto.NotaCreateDTO;
import com.proyecto.backend.dto.NotaDTO;
import com.proyecto.backend.dto.NotaUpdateDTO;
import com.proyecto.backend.service.NotaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/notas")
public class NotaController {

    @Autowired
    private NotaService notaService;

    @GetMapping
    public ResponseEntity<List<NotaDTO>> obtenerTodas() {
        List<NotaDTO> notas = notaService.obtenerTodas();
        return ResponseEntity.ok(notas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<NotaDTO> obtenerPorId(@PathVariable Long id) {
        NotaDTO nota = notaService.obtenerPorId(id);
        return ResponseEntity.ok(nota);
    }

    @GetMapping("/incidencia/{incidenciaId}")
    public ResponseEntity<List<NotaDTO>> obtenerPorIncidencia(@PathVariable Long incidenciaId) {
        List<NotaDTO> notas = notaService.obtenerPorIncidencia(incidenciaId);
        return ResponseEntity.ok(notas);
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<NotaDTO>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        List<NotaDTO> notas = notaService.obtenerPorUsuario(usuarioId);
        return ResponseEntity.ok(notas);
    }

    @GetMapping("/incidencia/{incidenciaId}/usuario/{usuarioId}")
    public ResponseEntity<List<NotaDTO>> obtenerPorIncidenciaYUsuario(
            @PathVariable Long incidenciaId,
            @PathVariable Long usuarioId) {
        List<NotaDTO> notas = notaService.obtenerPorIncidenciaYUsuario(incidenciaId, usuarioId);
        return ResponseEntity.ok(notas);
    }

    @GetMapping("/incidencia/{incidenciaId}/count")
    public ResponseEntity<Long> contarPorIncidencia(@PathVariable Long incidenciaId) {
        long count = notaService.contarPorIncidencia(incidenciaId);
        return ResponseEntity.ok(count);
    }

    @PostMapping
    public ResponseEntity<NotaDTO> crear(@Valid @RequestBody NotaCreateDTO createDTO) {
        NotaDTO nota = notaService.crear(createDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(nota);
    }

    @PutMapping("/{id}")
    public ResponseEntity<NotaDTO> actualizar(@PathVariable Long id, @Valid @RequestBody NotaUpdateDTO updateDTO) {
        NotaDTO nota = notaService.actualizar(id, updateDTO);
        return ResponseEntity.ok(nota);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        notaService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}
