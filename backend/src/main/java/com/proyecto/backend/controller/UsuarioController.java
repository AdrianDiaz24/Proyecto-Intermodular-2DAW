package com.proyecto.backend.controller;

import com.proyecto.backend.dto.UsuarioCreateDTO;
import com.proyecto.backend.dto.UsuarioDTO;
import com.proyecto.backend.dto.UsuarioUpdateDTO;
import com.proyecto.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    /**
     * GET /api/usuarios - Obtiene todos los usuarios
     */
    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> obtenerTodos() {
        List<UsuarioDTO> usuarios = usuarioService.obtenerTodos();
        return ResponseEntity.ok(usuarios);
    }

    /**
     * GET /api/usuarios/{id} - Obtiene un usuario por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> obtenerPorId(@PathVariable Long id) {
        UsuarioDTO usuario = usuarioService.obtenerPorId(id);
        return ResponseEntity.ok(usuario);
    }

    /**
     * GET /api/usuarios/username/{username} - Obtiene un usuario por nombre de usuario
     */
    @GetMapping("/username/{username}")
    public ResponseEntity<UsuarioDTO> obtenerPorUsername(@PathVariable String username) {
        UsuarioDTO usuario = usuarioService.obtenerPorUsername(username);
        return ResponseEntity.ok(usuario);
    }

    /**
     * GET /api/usuarios/email/{email} - Obtiene un usuario por correo electrónico
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<UsuarioDTO> obtenerPorEmail(@PathVariable String email) {
        UsuarioDTO usuario = usuarioService.obtenerPorEmail(email);
        return ResponseEntity.ok(usuario);
    }

    /**
     * POST /api/usuarios - Crea un nuevo usuario
     */
    @PostMapping
    public ResponseEntity<UsuarioDTO> crear(@Valid @RequestBody UsuarioCreateDTO createDTO) {
        UsuarioDTO usuario = usuarioService.crear(createDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }

    /**
     * PUT /api/usuarios/{id} - Actualiza un usuario existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioDTO> actualizar(@PathVariable Long id, @Valid @RequestBody UsuarioUpdateDTO updateDTO) {
        UsuarioDTO usuario = usuarioService.actualizar(id, updateDTO);
        return ResponseEntity.ok(usuario);
    }

    /**
     * DELETE /api/usuarios/{id} - Elimina un usuario
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        usuarioService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/usuarios/count - Obtiene el número total de usuarios
     */
    @GetMapping("/count")
    public ResponseEntity<Long> contar() {
        long count = usuarioService.contarUsuarios();
        return ResponseEntity.ok(count);
    }
}

