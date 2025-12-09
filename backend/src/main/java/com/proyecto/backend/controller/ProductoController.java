package com.proyecto.backend.controller;

import com.proyecto.backend.dto.ProductoCreateDTO;
import com.proyecto.backend.dto.ProductoDTO;
import com.proyecto.backend.dto.ProductoUpdateDTO;
import com.proyecto.backend.model.Usuario;
import com.proyecto.backend.repository.UsuarioRepository;
import com.proyecto.backend.service.ProductoService;
import com.proyecto.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"}, allowCredentials = "true")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * GET /api/productos - Obtiene todos los productos
     */
    @GetMapping
    public ResponseEntity<List<ProductoDTO>> obtenerTodos() {
        List<ProductoDTO> productos = productoService.obtenerTodos();
        return ResponseEntity.ok(productos);
    }

    /**
     * GET /api/productos/{id} - Obtiene un producto por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductoDTO> obtenerPorId(@PathVariable Long id) {
        ProductoDTO producto = productoService.obtenerPorId(id);
        return ResponseEntity.ok(producto);
    }

    /**
     * GET /api/productos/usuario/{usuarioId} - Obtiene productos de un usuario
     */
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<ProductoDTO>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        List<ProductoDTO> productos = productoService.obtenerPorUsuario(usuarioId);
        return ResponseEntity.ok(productos);
    }

    /**
     * POST /api/productos - Crea un nuevo producto
     */
    @PostMapping
    public ResponseEntity<ProductoDTO> crear(@Valid @RequestBody ProductoCreateDTO createDTO) {
        ProductoDTO producto = productoService.crear(createDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(producto);
    }

    /**
     * PUT /api/productos/{id} - Actualiza un producto existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<ProductoDTO> actualizar(@PathVariable Long id, @Valid @RequestBody ProductoUpdateDTO updateDTO) {
        ProductoDTO producto = productoService.actualizar(id, updateDTO);
        return ResponseEntity.ok(producto);
    }

    /**
     * DELETE /api/productos/{id} - Elimina un producto (SOLO ADMIN)
     * Las incidencias y soluciones se borran automáticamente
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id, Authentication authentication) {
        // Obtener usuario autenticado de la BD
        Usuario usuarioActual = usuarioRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        productoService.eliminar(id, usuarioActual);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/productos/{id}/incidencias/count - Obtiene el número de incidencias de un producto
     */
    @GetMapping("/{id}/incidencias/count")
    public ResponseEntity<Long> contarIncidencias(@PathVariable Long id) {
        long count = productoService.contarIncidencias(id);
        return ResponseEntity.ok(count);
    }

    /**
     * GET /api/productos/{id}/incidencias/abiertas - Obtiene el número de incidencias abiertas de un producto
     */
    @GetMapping("/{id}/incidencias/abiertas")
    public ResponseEntity<Long> contarIncidenciasAbiertas(@PathVariable Long id) {
        long count = productoService.contarIncidenciasAbiertas(id);
        return ResponseEntity.ok(count);
    }
}

