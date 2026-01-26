package com.proyecto.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "productos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Producto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 50)
    private String marca;

    @Column(length = 50)
    private String modelo;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    private byte[] imagen;

    @Column(precision = 10, scale = 2)
    private BigDecimal peso;

    @Column(precision = 10, scale = 2)
    private BigDecimal ancho;

    @Column(precision = 10, scale = 2)
    private BigDecimal largo;

    @Column(precision = 10, scale = 2)
    private BigDecimal alto;

    @Column(name = "consumo_electrico", length = 50)
    private String consumoElectrico;

    @Column(name = "otras_caracteristicas", columnDefinition = "TEXT")
    private String otrasCaracteristicas;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Incidencia> incidencias = new ArrayList<>();
}

