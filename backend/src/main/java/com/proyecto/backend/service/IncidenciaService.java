package com.proyecto.backend.service;

import com.proyecto.backend.dto.IncidenciaCreateDTO;
import com.proyecto.backend.dto.IncidenciaDTO;
import com.proyecto.backend.dto.IncidenciaUpdateDTO;
import com.proyecto.backend.exception.BusinessLogicException;
import com.proyecto.backend.exception.ResourceNotFoundException;
import com.proyecto.backend.model.Incidencia;
import com.proyecto.backend.model.Producto;
import com.proyecto.backend.model.Usuario;
import com.proyecto.backend.repository.IncidenciaRepository;
import com.proyecto.backend.repository.ProductoRepository;
import com.proyecto.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class IncidenciaService {

    @Autowired
    private IncidenciaRepository incidenciaRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AuditLogService auditLogService;

    /**
     * Obtiene todas las incidencias
     */
    public List<IncidenciaDTO> obtenerTodas() {
        return incidenciaRepository.findAll()
                .stream()
                .map(IncidenciaDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene una incidencia por ID
     */
    public IncidenciaDTO obtenerPorId(Long id) {
        Incidencia incidencia = incidenciaRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.withId("Incidencia", id));
        return IncidenciaDTO.fromEntity(incidencia);
    }

    /**
     * Obtiene todas las incidencias de un producto
     */
    public List<IncidenciaDTO> obtenerPorProducto(Long productoId) {
        productoRepository.findById(productoId)
                .orElseThrow(() -> ResourceNotFoundException.withId("Producto", productoId));

        return incidenciaRepository.findByProductoId(productoId)
                .stream()
                .map(IncidenciaDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene todas las incidencias de un usuario
     */
    public List<IncidenciaDTO> obtenerPorUsuario(Long usuarioId) {
        usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> ResourceNotFoundException.withId("Usuario", usuarioId));

        return incidenciaRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(IncidenciaDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene incidencias por estado
     */
    public List<IncidenciaDTO> obtenerPorEstado(Incidencia.Estado estado) {
        return incidenciaRepository.findByEstado(estado)
                .stream()
                .map(IncidenciaDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Crea una nueva incidencia
     *
     * @param createDTO Datos de la incidencia
     * @return Incidencia creada
     * @throws ResourceNotFoundException Si el producto o usuario no existen
     */
    public IncidenciaDTO crear(IncidenciaCreateDTO createDTO) {
        Producto producto = productoRepository.findById(createDTO.getProductoId())
                .orElseThrow(() -> ResourceNotFoundException.withId("Producto", createDTO.getProductoId()));

        Usuario usuario = usuarioRepository.findById(createDTO.getUsuarioId())
                .orElseThrow(() -> ResourceNotFoundException.withId("Usuario", createDTO.getUsuarioId()));

        Incidencia incidencia = new Incidencia();
        incidencia.setTitulo(createDTO.getTitulo());
        incidencia.setDescripcion(createDTO.getDescripcion());
        incidencia.setProducto(producto);
        incidencia.setUsuario(usuario);
        incidencia.setEstado(Incidencia.Estado.ABIERTA);
        incidencia.setFechaCreacion(LocalDateTime.now());

        Incidencia incidenciaGuardada = incidenciaRepository.save(incidencia);

        // Registrar en auditoría
        auditLogService.registrarOperacion(
                "CREATE",
                "Incidencia",
                incidenciaGuardada.getId(),
                usuario.getId(),
                usuario.getUsername(),
                "Incidencia creada: " + incidenciaGuardada.getTitulo() + " (Producto: " + producto.getNombre() + ")"
        );

        return IncidenciaDTO.fromEntity(incidenciaGuardada);
    }

    /**
     * Actualiza una incidencia existente
     *
     * LÓGICA DE NEGOCIO: Si la incidencia tiene soluciones, solo permite cambiar a estado CERRADA
     *
     * @param id ID de la incidencia
     * @param updateDTO Datos a actualizar
     * @return Incidencia actualizada
     * @throws ResourceNotFoundException Si la incidencia no existe
     * @throws BusinessLogicException Si incumple las reglas de negocio
     */
    public IncidenciaDTO actualizar(Long id, IncidenciaUpdateDTO updateDTO) {
        Incidencia incidencia = incidenciaRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.withId("Incidencia", id));

        String cambios = "";

        if (updateDTO.getTitulo() != null && !updateDTO.getTitulo().isEmpty()) {
            cambios += "Título: " + incidencia.getTitulo() + " -> " + updateDTO.getTitulo() + "; ";
            incidencia.setTitulo(updateDTO.getTitulo());
        }

        if (updateDTO.getDescripcion() != null && !updateDTO.getDescripcion().isEmpty()) {
            cambios += "Descripción actualizada; ";
            incidencia.setDescripcion(updateDTO.getDescripcion());
        }

        // Validación de lógica de negocio para cambio de estado
        if (updateDTO.getEstado() != null && !updateDTO.getEstado().isEmpty()) {
            Incidencia.Estado nuevoEstado = Incidencia.Estado.valueOf(updateDTO.getEstado());

            // Si la incidencia tiene soluciones, solo permite cerrarla
            if (incidencia.getSoluciones() != null && !incidencia.getSoluciones().isEmpty()) {
                if (nuevoEstado != Incidencia.Estado.CERRADA) {
                    throw new BusinessLogicException(
                            "No se puede cambiar el estado a " + nuevoEstado +
                            " porque la incidencia tiene soluciones propuestas. Solo se puede cerrar."
                    );
                }
            }

            cambios += "Estado: " + incidencia.getEstado() + " -> " + nuevoEstado + "; ";
            incidencia.setEstado(nuevoEstado);
        }

        Incidencia incidenciaActualizada = incidenciaRepository.save(incidencia);

        // Registrar en auditoría
        auditLogService.registrarOperacion(
                "UPDATE",
                "Incidencia",
                incidenciaActualizada.getId(),
                incidencia.getUsuario().getId(),
                incidencia.getUsuario().getUsername(),
                cambios
        );

        return IncidenciaDTO.fromEntity(incidenciaActualizada);
    }

    /**
     * Elimina una incidencia
     *
     * @param id ID de la incidencia a eliminar
     * @throws ResourceNotFoundException Si la incidencia no existe
     */
    public void eliminar(Long id) {
        Incidencia incidencia = incidenciaRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.withId("Incidencia", id));

        Usuario usuario = incidencia.getUsuario();
        incidenciaRepository.deleteById(id);

        // Registrar en auditoría
        auditLogService.registrarOperacion(
                "DELETE",
                "Incidencia",
                id,
                usuario.getId(),
                usuario.getUsername(),
                "Incidencia eliminada: " + incidencia.getTitulo()
        );
    }

    /**
     * Cambia el estado de una incidencia
     */
    public IncidenciaDTO cambiarEstado(Long id, String nuevoEstado) {
        IncidenciaUpdateDTO updateDTO = new IncidenciaUpdateDTO();
        updateDTO.setEstado(nuevoEstado);
        return actualizar(id, updateDTO);
    }

    /**
     * Cuenta el número de incidencias abiertas
     */
    public long contarAbiertas() {
        return incidenciaRepository.findByEstado(Incidencia.Estado.ABIERTA).size();
    }

    /**
     * Cuenta el número de incidencias en progreso
     */
    public long contarEnProgreso() {
        return incidenciaRepository.findByEstado(Incidencia.Estado.EN_PROGRESO).size();
    }

    /**
     * Cuenta el número de incidencias cerradas
     */
    public long contarCerradas() {
        return incidenciaRepository.findByEstado(Incidencia.Estado.CERRADA).size();
    }
}

