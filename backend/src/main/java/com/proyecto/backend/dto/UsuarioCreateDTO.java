package com.proyecto.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioCreateDTO {

    private String username;
    private String email;
    private String password;
    private String role; // "USER" o "ADMIN"
}

