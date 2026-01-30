package com.proyecto.backend.controller;

import com.proyecto.backend.dto.LoginRequest;
import com.proyecto.backend.dto.LoginResponse;
import com.proyecto.backend.dto.UsuarioCreateDTO;
import com.proyecto.backend.dto.UsuarioDTO;
import com.proyecto.backend.exception.BusinessLogicException;
import com.proyecto.backend.service.UsuarioService;
import com.proyecto.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201"}, allowCredentials = "true")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UsuarioService usuarioService;

    /**
     * POST /api/auth/login - Autentica un usuario y retorna un token JWT
     *
     * @param loginRequest Credenciales (username y password)
     * @return LoginResponse con token JWT
     * @throws AuthenticationException Si las credenciales son inválidas
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Autenticar usuario (puede ser username o email)
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );

            // El authentication.getName() devuelve el username real (no el email)
            String authenticatedUsername = authentication.getName();

            // Generar token JWT con el username real
            String token = jwtUtil.generateToken(authenticatedUsername);

            // Obtener detalles del usuario usando el username autenticado
            UsuarioDTO usuario = usuarioService.obtenerPorUsername(authenticatedUsername);

            // Retornar respuesta con token
            LoginResponse response = new LoginResponse(
                    token,
                    usuario.getId(),
                    usuario.getUsername(),
                    usuario.getEmail(),
                    usuario.getRole()
            );

            return ResponseEntity.ok(response);

        } catch (AuthenticationException e) {
            throw new BusinessLogicException("Credenciales inválidas. Verifique su usuario y contraseña.");
        }
    }

    /**
     * POST /api/auth/register - Registra un nuevo usuario
     *
     * @param createDTO Datos del nuevo usuario
     * @return UsuarioDTO del usuario creado
     */
    @PostMapping("/register")
    public ResponseEntity<UsuarioDTO> register(@Valid @RequestBody UsuarioCreateDTO createDTO) {
        // Establecer role por defecto como USER
        if (createDTO.getRole() == null || createDTO.getRole().isEmpty()) {
            createDTO.setRole("USER");
        }

        UsuarioDTO usuario = usuarioService.crear(createDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
    }

    /**
     * GET /api/auth/validate - Valida si un token es válido
     * Requiere el header: Authorization: Bearer {token}
     *
     * @return true si el token es válido
     */
    @GetMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            boolean isValid = jwtUtil.validateToken(token);
            return ResponseEntity.ok(isValid);
        }
        return ResponseEntity.ok(false);
    }

    /**
     * GET /api/auth/me - Obtiene los detalles del usuario autenticado
     * Requiere el header: Authorization: Bearer {token}
     *
     * @return Detalles del usuario
     */
    @GetMapping("/me")
    public ResponseEntity<UsuarioDTO> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            String username = jwtUtil.getUsernameFromToken(token);

            if (username != null) {
                UsuarioDTO usuario = usuarioService.obtenerPorUsername(username);
                return ResponseEntity.ok(usuario);
            }
        }
        throw new BusinessLogicException("Token inválido o expirado");
    }
}

