package com.proyecto.backend.service;

import com.proyecto.backend.dto.ProductoCreateDTO;
import com.proyecto.backend.dto.ProductoDTO;
import com.proyecto.backend.dto.ProductoUpdateDTO;
import com.proyecto.backend.exception.BusinessLogicException;
import com.proyecto.backend.exception.ResourceNotFoundException;
import com.proyecto.backend.model.Incidencia;
import com.proyecto.backend.model.Producto;
import com.proyecto.backend.model.Usuario;
import com.proyecto.backend.repository.ProductoRepository;
import com.proyecto.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private AuditLogService auditLogService;

    /**
     * Obtiene todos los productos
     */
    public List<ProductoDTO> obtenerTodos() {
        return productoRepository.findAll()
                .stream()
                .map(ProductoDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene un producto por ID
     */
    public ProductoDTO obtenerPorId(Long id) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.withId("Producto", id));
        return ProductoDTO.fromEntity(producto);
    }

    /**
     * Obtiene todos los productos de un usuario
     */
    public List<ProductoDTO> obtenerPorUsuario(Long usuarioId) {
        usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> ResourceNotFoundException.withId("Usuario", usuarioId));

        return productoRepository.findByUsuarioId(usuarioId)
                .stream()
                .map(ProductoDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Crea un nuevo producto
     *
     * @param createDTO Datos del producto
     * @return Producto creado
     * @throws ResourceNotFoundException Si el usuario no existe
     */
    public ProductoDTO crear(ProductoCreateDTO createDTO) {
        Usuario usuario = usuarioRepository.findById(createDTO.getUsuarioId())
                .orElseThrow(() -> ResourceNotFoundException.withId("Usuario", createDTO.getUsuarioId()));

        Producto producto = new Producto();
        producto.setNombre(createDTO.getNombre());
        producto.setMarca(createDTO.getMarca());
        producto.setModelo(createDTO.getModelo());
        producto.setUsuario(usuario);

        Producto productoGuardado = productoRepository.save(producto);

        // Registrar en auditoría
        auditLogService.registrarOperacion(
                "CREATE",
                "Producto",
                productoGuardado.getId(),
                usuario.getId(),
                usuario.getUsername(),
                "Producto creado: " + productoGuardado.getNombre() + " (" + productoGuardado.getMarca() + " " + productoGuardado.getModelo() + ")"
        );

        return ProductoDTO.fromEntity(productoGuardado);
    }

    /**
     * Actualiza un producto existente
     *
     * @param id ID del producto
     * @param updateDTO Datos a actualizar
     * @return Producto actualizado
     * @throws ResourceNotFoundException Si el producto no existe
     */
    public ProductoDTO actualizar(Long id, ProductoUpdateDTO updateDTO) {
        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.withId("Producto", id));

        String cambios = "";

        if (updateDTO.getNombre() != null && !updateDTO.getNombre().isEmpty()) {
            cambios += "Nombre: " + producto.getNombre() + " -> " + updateDTO.getNombre() + "; ";
            producto.setNombre(updateDTO.getNombre());
        }

        if (updateDTO.getMarca() != null && !updateDTO.getMarca().isEmpty()) {
            cambios += "Marca: " + producto.getMarca() + " -> " + updateDTO.getMarca() + "; ";
            producto.setMarca(updateDTO.getMarca());
        }

        if (updateDTO.getModelo() != null && !updateDTO.getModelo().isEmpty()) {
            cambios += "Modelo: " + producto.getModelo() + " -> " + updateDTO.getModelo() + "; ";
            producto.setModelo(updateDTO.getModelo());
        }

        Producto productoActualizado = productoRepository.save(producto);

        // Registrar en auditoría
        auditLogService.registrarOperacion(
                "UPDATE",
                "Producto",
                productoActualizado.getId(),
                producto.getUsuario().getId(),
                producto.getUsuario().getUsername(),
                cambios
        );

        return ProductoDTO.fromEntity(productoActualizado);
    }

    /**
     * Elimina un producto (SOLO ADMIN)
     * Las incidencias y soluciones se borran automáticamente (cascada)
     *
     * @param id ID del producto a eliminar
     * @param usuarioActual Usuario que solicita la eliminación
     * @throws ResourceNotFoundException Si el producto no existe
     * @throws BusinessLogicException Si el usuario no es ADMIN
     */
    public void eliminar(Long id, Usuario usuarioActual) {
        // Validar que sea ADMIN
        if (usuarioActual.getRole() != Usuario.Role.ADMIN) {
            throw new BusinessLogicException(
                    "No tiene permisos para eliminar productos. Solo los administradores pueden hacerlo."
            );
        }

        Producto producto = productoRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.withId("Producto", id));

        // Las incidencias y soluciones se borran automáticamente por CascadeType.ALL
        // en Producto.incidencias

        Usuario usuario = producto.getUsuario();
        productoRepository.deleteById(id);

        // Registrar en auditoría
        auditLogService.registrarOperacion(
                "DELETE",
                "Producto",
                id,
                usuarioActual.getId(),
                usuarioActual.getUsername(),
                "Producto eliminado: " + producto.getNombre() +
                " (Incidencias y soluciones eliminadas automáticamente)"
        );
    }

    /**
     * Obtiene el número de incidencias de un producto
     */
    public long contarIncidencias(Long productoId) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> ResourceNotFoundException.withId("Producto", productoId));
        return producto.getIncidencias() != null ? producto.getIncidencias().size() : 0;
    }

    /**
     * Obtiene el número de incidencias abiertas de un producto
     */
    public long contarIncidenciasAbiertas(Long productoId) {
        Producto producto = productoRepository.findById(productoId)
                .orElseThrow(() -> ResourceNotFoundException.withId("Producto", productoId));

        return producto.getIncidencias() != null ?
                producto.getIncidencias()
                        .stream()
                        .filter(i -> i.getEstado() == Incidencia.Estado.ABIERTA ||
                                   i.getEstado() == Incidencia.Estado.EN_PROGRESO)
                        .count() : 0;
    }
}
