package com.proyecto.backend.service;

import com.proyecto.backend.dto.SolucionCreateDTO;
import com.proyecto.backend.dto.SolucionDTO;
import com.proyecto.backend.dto.SolucionUpdateDTO;
import com.proyecto.backend.exception.BusinessLogicException;
import com.proyecto.backend.exception.ResourceNotFoundException;
import com.proyecto.backend.model.Incidencia;
import com.proyecto.backend.model.Solucion;
import com.proyecto.backend.model.Usuario;
import com.proyecto.backend.repository.IncidenciaRepository;
import com.proyecto.backend.repository.SolucionRepository;
import com.proyecto.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class SolucionService {

    @Autowired
    private SolucionRepository solucionRepository;

    @Autowired
    private IncidenciaRepository incidenciaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AuditLogService auditLogService;

    /**
     * Obtiene todas las soluciones
     */
    public List<SolucionDTO> obtenerTodas() {
        return solucionRepository.findAll()
                .stream()
                .map(SolucionDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene una solución por ID
     */
    public SolucionDTO obtenerPorId(Long id) {
        Solucion solucion = solucionRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.withId("Solución", id));
        return SolucionDTO.fromEntity(solucion);
    }

    /**
     * Obtiene todas las soluciones de una incidencia
     */
    public List<SolucionDTO> obtenerPorIncidencia(Long incidenciaId) {
        incidenciaRepository.findById(incidenciaId)
                .orElseThrow(() -> ResourceNotFoundException.withId("Incidencia", incidenciaId));

        return solucionRepository.findByIncidenciaId(incidenciaId)
                .stream()
                .map(SolucionDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene todas las soluciones de un usuario
     */
    public List<SolucionDTO> obtenerPorUsuario(Long usuarioId) {
        usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> ResourceNotFoundException.withId("Usuario", usuarioId));

        return solucionRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(SolucionDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Crea una nueva solución
     *
     * @param createDTO Datos de la solución
     * @return Solución creada
     * @throws ResourceNotFoundException Si la incidencia o usuario no existen
     * @throws BusinessLogicException Si la incidencia ya está cerrada
     */
    public SolucionDTO crear(SolucionCreateDTO createDTO) {
        Incidencia incidencia = incidenciaRepository.findById(createDTO.getIncidenciaId())
                .orElseThrow(() -> ResourceNotFoundException.withId("Incidencia", createDTO.getIncidenciaId()));

        Usuario usuario = usuarioRepository.findById(createDTO.getUsuarioId())
                .orElseThrow(() -> ResourceNotFoundException.withId("Usuario", createDTO.getUsuarioId()));

        // Validación de lógica de negocio: no permitir soluciones en incidencias cerradas
        if (incidencia.getEstado() == Incidencia.Estado.CERRADA) {
            throw new BusinessLogicException(
                    "No se puede agregar una solución a una incidencia cerrada. " +
                    "La incidencia debe estar abierta o en progreso."
            );
        }

        Solucion solucion = new Solucion();
        solucion.setDescripcion(createDTO.getDescripcion());
        solucion.setIncidencia(incidencia);
        solucion.setUsuario(usuario);
        solucion.setVotos(0);
        solucion.setFechaPublicacion(LocalDateTime.now());

        Solucion solucionGuardada = solucionRepository.save(solucion);

        // Registrar en auditoría
        auditLogService.registrarOperacion(
                "CREATE",
                "Solución",
                solucionGuardada.getId(),
                usuario.getId(),
                usuario.getUsername(),
                "Solución propuesta para incidencia: " + incidencia.getTitulo()
        );

        return SolucionDTO.fromEntity(solucionGuardada);
    }

    /**
     * Actualiza una solución existente
     *
     * @param id ID de la solución
     * @param updateDTO Datos a actualizar
     * @return Solución actualizada
     * @throws ResourceNotFoundException Si la solución no existe
     */
    public SolucionDTO actualizar(Long id, SolucionUpdateDTO updateDTO) {
        Solucion solucion = solucionRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.withId("Solución", id));

        String cambios = "";

        if (updateDTO.getDescripcion() != null && !updateDTO.getDescripcion().isEmpty()) {
            cambios += "Descripción actualizada; ";
            solucion.setDescripcion(updateDTO.getDescripcion());
        }

        if (updateDTO.getVotos() != null) {
            cambios += "Votos: " + solucion.getVotos() + " -> " + updateDTO.getVotos() + "; ";
            solucion.setVotos(updateDTO.getVotos());
        }

        Solucion solucionActualizada = solucionRepository.save(solucion);

        // Registrar en auditoría
        auditLogService.registrarOperacion(
                "UPDATE",
                "Solución",
                solucionActualizada.getId(),
                solucion.getUsuario().getId(),
                solucion.getUsuario().getUsername(),
                cambios
        );

        return SolucionDTO.fromEntity(solucionActualizada);
    }

    /**
     * Elimina una solución
     *
     * @param id ID de la solución a eliminar
     * @throws ResourceNotFoundException Si la solución no existe
     */
    public void eliminar(Long id) {
        Solucion solucion = solucionRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.withId("Solución", id));

        Usuario usuario = solucion.getUsuario();
        solucionRepository.deleteById(id);

        // Registrar en auditoría
        auditLogService.registrarOperacion(
                "DELETE",
                "Solución",
                id,
                usuario.getId(),
                usuario.getUsername(),
                "Solución eliminada para incidencia: " + solucion.getIncidencia().getTitulo()
        );
    }

    /**
     * Agrega un voto a una solución (LÓGICA DE NEGOCIO: no permite votos del mismo usuario)
     *
     * Este método simplemente incrementa el contador de votos.
     * Para implementar la validación de "un voto por usuario", se necesaría
     * una tabla intermedia "voto" que relacione usuarios con soluciones.
     * Por ahora, incrementamos el contador general.
     *
     * @param id ID de la solución
     * @return Solución actualizada
     * @throws ResourceNotFoundException Si la solución no existe
     */
    public SolucionDTO agregarVoto(Long id) {
        Solucion solucion = solucionRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.withId("Solución", id));

        solucion.setVotos(solucion.getVotos() + 1);
        Solucion solucionActualizada = solucionRepository.save(solucion);

        // Registrar en auditoría
        auditLogService.registrarOperacion(
                "UPDATE",
                "Solución",
                solucionActualizada.getId(),
                solucion.getUsuario().getId(),
                solucion.getUsuario().getUsername(),
                "Voto agregado. Votos totales: " + solucionActualizada.getVotos()
        );

        return SolucionDTO.fromEntity(solucionActualizada);
    }

    /**
     * Obtiene las soluciones más votadas de una incidencia
     */
    public List<SolucionDTO> obtenerMasVotadasPorIncidencia(Long incidenciaId) {
        incidenciaRepository.findById(incidenciaId)
                .orElseThrow(() -> ResourceNotFoundException.withId("Incidencia", incidenciaId));

        return solucionRepository.findByIncidenciaId(incidenciaId)
                .stream()
                .sorted((s1, s2) -> s2.getVotos().compareTo(s1.getVotos()))
                .map(SolucionDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Cuenta el número de soluciones de una incidencia
     */
    public long contarPorIncidencia(Long incidenciaId) {
        return solucionRepository.findByIncidenciaId(incidenciaId).size();
    }
}

