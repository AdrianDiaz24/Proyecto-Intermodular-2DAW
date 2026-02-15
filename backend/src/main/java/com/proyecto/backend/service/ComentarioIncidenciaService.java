package com.proyecto.backend.service;

import com.proyecto.backend.dto.ComentarioIncidenciaDTO;
import com.proyecto.backend.dto.ComentarioIncidenciaCreateDTO;
import com.proyecto.backend.dto.UsuarioDTO;
import com.proyecto.backend.model.ComentarioIncidencia;
import com.proyecto.backend.model.Usuario;
import com.proyecto.backend.repository.ComentarioIncidenciaRepository;
import com.proyecto.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para gestionar comentarios en incidencias
 */
@Service
public class ComentarioIncidenciaService {

    @Autowired
    private ComentarioIncidenciaRepository comentarioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Obtiene todos los comentarios
     */
    public List<ComentarioIncidenciaDTO> obtenerTodos() {
        return comentarioRepository.findAll()
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un comentario por ID
     */
    public ComentarioIncidenciaDTO obtenerPorId(Long id) {
        ComentarioIncidencia comentario = comentarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comentario no encontrado"));
        return convertirADTO(comentario);
    }

    /**
     * Obtiene comentarios de una incidencia
     */
    public List<ComentarioIncidenciaDTO> obtenerPorIncidencia(Long incidenciaId) {
        return comentarioRepository.findByIncidenciaId(incidenciaId)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene comentarios de un usuario
     */
    public List<ComentarioIncidenciaDTO> obtenerPorUsuario(Long usuarioId) {
        return comentarioRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene soluciones de una incidencia
     */
    public List<ComentarioIncidenciaDTO> obtenerSolucionesIncidencia(Long incidenciaId) {
        return comentarioRepository.findByIncidenciaIdAndEsSolucionTrue(incidenciaId)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    /**
     * Crea un nuevo comentario
     */
    public ComentarioIncidenciaDTO crear(ComentarioIncidenciaCreateDTO createDTO) {
        // Validar que el usuario existe
        Usuario usuario = usuarioRepository.findById(createDTO.getUsuarioId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        ComentarioIncidencia comentario = new ComentarioIncidencia();
        comentario.setContenido(createDTO.getContenido());
        comentario.setIncidenciaId(createDTO.getIncidenciaId());
        comentario.setUsuarioId(createDTO.getUsuarioId());
        comentario.setEsSolucion(createDTO.isEsSolucion());
        comentario.setCreatedAt(LocalDateTime.now());
        comentario.setUpdatedAt(LocalDateTime.now());

        ComentarioIncidencia guardado = comentarioRepository.save(comentario);
        return convertirADTO(guardado);
    }

    /**
     * Actualiza un comentario existente
     */
    public ComentarioIncidenciaDTO actualizar(Long id, ComentarioIncidenciaCreateDTO updateDTO) {
        ComentarioIncidencia comentario = comentarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comentario no encontrado"));

        comentario.setContenido(updateDTO.getContenido());
        comentario.setEsSolucion(updateDTO.isEsSolucion());
        comentario.setUpdatedAt(LocalDateTime.now());

        ComentarioIncidencia actualizado = comentarioRepository.save(comentario);
        return convertirADTO(actualizado);
    }

    /**
     * Elimina un comentario
     */
    public void eliminar(Long id) {
        ComentarioIncidencia comentario = comentarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comentario no encontrado"));
        comentarioRepository.delete(comentario);
    }

    /**
     * Marca o desmarca un comentario como solución
     */
    public ComentarioIncidenciaDTO marcarComoSolucion(Long id, boolean esSolucion) {
        ComentarioIncidencia comentario = comentarioRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comentario no encontrado"));

        comentario.setEsSolucion(esSolucion);
        comentario.setUpdatedAt(LocalDateTime.now());

        ComentarioIncidencia actualizado = comentarioRepository.save(comentario);
        return convertirADTO(actualizado);
    }

    /**
     * Convierte un ComentarioIncidencia a ComentarioIncidenciaDTO
     */
    private ComentarioIncidenciaDTO convertirADTO(ComentarioIncidencia comentario) {
        UsuarioDTO usuarioDTO = null;
        if (comentario.getUsuario() != null) {
            usuarioDTO = new UsuarioDTO();
            usuarioDTO.setId(comentario.getUsuario().getId());
            usuarioDTO.setUsername(comentario.getUsuario().getUsername());
            usuarioDTO.setEmail(comentario.getUsuario().getEmail());
        }

        return new ComentarioIncidenciaDTO(
                comentario.getId(),
                comentario.getContenido(),
                comentario.getIncidenciaId(),
                comentario.getUsuarioId(),
                usuarioDTO,
                comentario.isEsSolucion(),
                comentario.getCreatedAt(),
                comentario.getUpdatedAt()
        );
    }
}
