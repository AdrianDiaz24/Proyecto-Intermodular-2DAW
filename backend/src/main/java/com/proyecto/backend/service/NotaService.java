package com.proyecto.backend.service;

import com.proyecto.backend.dto.NotaCreateDTO;
import com.proyecto.backend.dto.NotaDTO;
import com.proyecto.backend.dto.NotaUpdateDTO;
import com.proyecto.backend.exception.ResourceNotFoundException;
import com.proyecto.backend.model.Incidencia;
import com.proyecto.backend.model.Nota;
import com.proyecto.backend.model.Usuario;
import com.proyecto.backend.repository.IncidenciaRepository;
import com.proyecto.backend.repository.NotaRepository;
import com.proyecto.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotaService {

    @Autowired
    private NotaRepository notaRepository;

    @Autowired
    private IncidenciaRepository incidenciaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AuditLogService auditLogService;

    public List<NotaDTO> obtenerTodas() {
        return notaRepository.findAll()
                .stream()
                .map(NotaDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public NotaDTO obtenerPorId(Long id) {
        Nota nota = notaRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.withId("Nota", id));
        return NotaDTO.fromEntity(nota);
    }

    public List<NotaDTO> obtenerPorIncidencia(Long incidenciaId) {
        incidenciaRepository.findById(incidenciaId)
                .orElseThrow(() -> ResourceNotFoundException.withId("Incidencia", incidenciaId));

        return notaRepository.findByIncidenciaId(incidenciaId)
                .stream()
                .map(NotaDTO::fromEntity)
                .collect(Collectors.toList());
    }


    public List<NotaDTO> obtenerPorUsuario(Long usuarioId) {
        usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> ResourceNotFoundException.withId("Usuario", usuarioId));

        return notaRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(NotaDTO::fromEntity)
                .collect(Collectors.toList());
    }


    public List<NotaDTO> obtenerPorIncidenciaYUsuario(Long incidenciaId, Long usuarioId) {
        incidenciaRepository.findById(incidenciaId)
                .orElseThrow(() -> ResourceNotFoundException.withId("Incidencia", incidenciaId));
        usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> ResourceNotFoundException.withId("Usuario", usuarioId));

        return notaRepository.findByIncidenciaIdAndUsuarioId(incidenciaId, usuarioId)
                .stream()
                .map(NotaDTO::fromEntity)
                .collect(Collectors.toList());
    }


    public long contarPorIncidencia(Long incidenciaId) {
        incidenciaRepository.findById(incidenciaId)
                .orElseThrow(() -> ResourceNotFoundException.withId("Incidencia", incidenciaId));

        return notaRepository.countByIncidenciaId(incidenciaId);
    }


    public NotaDTO crear(NotaCreateDTO createDTO) {
        Incidencia incidencia = incidenciaRepository.findById(createDTO.getIncidenciaId())
                .orElseThrow(() -> ResourceNotFoundException.withId("Incidencia", createDTO.getIncidenciaId()));


        Usuario usuario = obtenerUsuarioAutenticado();

        Nota nota = new Nota();
        nota.setContenido(createDTO.getContenido());
        nota.setIncidencia(incidencia);
        nota.setUsuario(usuario);
        nota.setCreatedAt(LocalDateTime.now());
        nota.setUpdatedAt(LocalDateTime.now());

        Nota notaGuardada = notaRepository.save(nota);


        auditLogService.registrarOperacion("CREAR", "Nota", notaGuardada.getId(), usuario.getId(), usuario.getUsername(), "Nota creada en incidencia " + incidencia.getId());

        return NotaDTO.fromEntity(notaGuardada);
    }


    public NotaDTO actualizar(Long id, NotaUpdateDTO updateDTO) {
        Nota nota = notaRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.withId("Nota", id));

        Usuario usuario = obtenerUsuarioAutenticado();

        if (!nota.getUsuario().getId().equals(usuario.getId())) {
            throw new ResourceNotFoundException("No tienes permiso para actualizar esta nota");
        }

        nota.setContenido(updateDTO.getContenido());
        nota.setUpdatedAt(LocalDateTime.now());

        Nota notaActualizada = notaRepository.save(nota);

        auditLogService.registrarOperacion("ACTUALIZAR", "Nota", notaActualizada.getId(), usuario.getId(), usuario.getUsername(), "Nota actualizada");

        return NotaDTO.fromEntity(notaActualizada);
    }


    public void eliminar(Long id) {
        Nota nota = notaRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.withId("Nota", id));

        Usuario usuario = obtenerUsuarioAutenticado();

        if (!nota.getUsuario().getId().equals(usuario.getId()) && usuario.getRole() != Usuario.Role.ADMIN) {
            throw new ResourceNotFoundException("No tienes permiso para eliminar esta nota");
        }

        notaRepository.deleteById(id);


        auditLogService.registrarOperacion("ELIMINAR", "Nota", id, usuario.getId(), usuario.getUsername(), "Nota eliminada");
    }

    private Usuario obtenerUsuarioAutenticado() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }
}
