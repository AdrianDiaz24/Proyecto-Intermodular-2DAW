package com.proyecto.backend.service;

import com.proyecto.backend.dto.UsuarioCreateDTO;
import com.proyecto.backend.dto.UsuarioDTO;
import com.proyecto.backend.dto.UsuarioUpdateDTO;
import com.proyecto.backend.exception.BusinessLogicException;
import com.proyecto.backend.exception.ResourceNotFoundException;
import com.proyecto.backend.exception.ValidationException;
import com.proyecto.backend.model.Usuario;
import com.proyecto.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Obtiene todos los usuarios
     */
    public List<UsuarioDTO> obtenerTodos() {
        return usuarioRepository.findAll()
                .stream()
                .map(UsuarioDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un usuario por ID
     */
    public UsuarioDTO obtenerPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.withId("Usuario", id));
        return UsuarioDTO.fromEntity(usuario);
    }

    /**
     * Obtiene un usuario por nombre de usuario
     */
    public UsuarioDTO obtenerPorUsername(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario '" + username + "' no encontrado"));
        return UsuarioDTO.fromEntity(usuario);
    }

    /**
     * Obtiene un usuario por correo electrónico
     */
    public UsuarioDTO obtenerPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario con correo '" + email + "' no encontrado"));
        return UsuarioDTO.fromEntity(usuario);
    }

    /**
     * Crea un nuevo usuario
     *
     * @param createDTO Datos del usuario a crear
     * @return Usuario creado
     * @throws BusinessLogicException Si el username o email ya existen
     */
    public UsuarioDTO crear(UsuarioCreateDTO createDTO) {
        // Validar que el username no exista
        if (usuarioRepository.findByUsername(createDTO.getUsername()).isPresent()) {
            throw new BusinessLogicException("El nombre de usuario '" + createDTO.getUsername() + "' ya está registrado");
        }

        // Validar que el email no exista
        if (usuarioRepository.findByEmail(createDTO.getEmail()).isPresent()) {
            throw new BusinessLogicException("El correo electrónico '" + createDTO.getEmail() + "' ya está registrado");
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(createDTO.getUsername());
        usuario.setEmail(createDTO.getEmail());
        usuario.setPassword(passwordEncoder.encode(createDTO.getPassword()));
        usuario.setTelefono(createDTO.getTelefono());
        usuario.setRole(Usuario.Role.valueOf(createDTO.getRole()));

        Usuario usuarioGuardado = usuarioRepository.save(usuario);

        // Registrar en auditoría
        auditLogService.registrarOperacion(
                "CREATE",
                "Usuario",
                usuarioGuardado.getId(),
                usuarioGuardado.getId(),
                usuarioGuardado.getUsername(),
                "Usuario creado: " + usuarioGuardado.getUsername()
        );

        return UsuarioDTO.fromEntity(usuarioGuardado);
    }

    /**
     * Actualiza un usuario existente
     *
     * @param id ID del usuario
     * @param updateDTO Datos a actualizar
     * @return Usuario actualizado
     * @throws ResourceNotFoundException Si el usuario no existe
     * @throws BusinessLogicException Si intenta cambiar a username/email que ya existen
     */
    public UsuarioDTO actualizar(Long id, UsuarioUpdateDTO updateDTO) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.withId("Usuario", id));

        String cambios = "";

        // Validar y actualizar username
        if (updateDTO.getUsername() != null && !updateDTO.getUsername().isEmpty()) {
            if (!usuario.getUsername().equals(updateDTO.getUsername()) &&
                usuarioRepository.findByUsername(updateDTO.getUsername()).isPresent()) {
                throw new BusinessLogicException("El nombre de usuario '" + updateDTO.getUsername() + "' ya está registrado");
            }
            cambios += "Username: " + usuario.getUsername() + " -> " + updateDTO.getUsername() + "; ";
            usuario.setUsername(updateDTO.getUsername());
        }

        // Validar y actualizar email
        if (updateDTO.getEmail() != null && !updateDTO.getEmail().isEmpty()) {
            if (!usuario.getEmail().equals(updateDTO.getEmail()) &&
                usuarioRepository.findByEmail(updateDTO.getEmail()).isPresent()) {
                throw new BusinessLogicException("El correo electrónico '" + updateDTO.getEmail() + "' ya está registrado");
            }
            cambios += "Email: " + usuario.getEmail() + " -> " + updateDTO.getEmail() + "; ";
            usuario.setEmail(updateDTO.getEmail());
        }

        // Actualizar contraseña
        if (updateDTO.getPassword() != null && !updateDTO.getPassword().isEmpty()) {
            cambios += "Password actualizado; ";
            usuario.setPassword(passwordEncoder.encode(updateDTO.getPassword()));
        }

        // Actualizar teléfono
        if (updateDTO.getTelefono() != null) {
            cambios += "Teléfono: " + usuario.getTelefono() + " -> " + updateDTO.getTelefono() + "; ";
            usuario.setTelefono(updateDTO.getTelefono());
        }

        // Actualizar rol
        if (updateDTO.getRole() != null && !updateDTO.getRole().isEmpty()) {
            cambios += "Role: " + usuario.getRole() + " -> " + updateDTO.getRole() + "; ";
            usuario.setRole(Usuario.Role.valueOf(updateDTO.getRole()));
        }

        Usuario usuarioActualizado = usuarioRepository.save(usuario);

        // Registrar en auditoría
        auditLogService.registrarOperacion(
                "UPDATE",
                "Usuario",
                usuarioActualizado.getId(),
                usuarioActualizado.getId(),
                usuarioActualizado.getUsername(),
                cambios
        );

        return UsuarioDTO.fromEntity(usuarioActualizado);
    }

    /**
     * Elimina un usuario
     * Las incidencias y soluciones se borran automáticamente (cascada)
     * Los productos NO se borran, solo pierden la referencia al usuario
     *
     * @param id ID del usuario a eliminar
     * @throws ResourceNotFoundException Si el usuario no existe
     */
    public void eliminar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.withId("Usuario", id));

        // Los productos NO se borran, solo pierden la referencia al usuario
        // Las incidencias y soluciones se borran automáticamente por CascadeType.ALL

        usuarioRepository.deleteById(id);

        // Registrar en auditoría
        auditLogService.registrarOperacion(
                "DELETE",
                "Usuario",
                id,
                id,
                usuario.getUsername(),
                "Usuario eliminado: " + usuario.getUsername() +
                " (Productos conservados, incidencias y soluciones eliminadas automáticamente)"
        );
    }

    /**
     * Valida las credenciales de un usuario (para uso futuro en autenticación)
     */
    public boolean validarCredenciales(String username, String password) {
        Optional<Usuario> usuario = usuarioRepository.findByUsername(username);
        if (usuario.isEmpty()) {
            return false;
        }

        return passwordEncoder.matches(password, usuario.get().getPassword());
    }

    /**
     * Cuenta el número total de usuarios
     */
    public long contarUsuarios() {
        return usuarioRepository.count();
    }
}

