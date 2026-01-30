package com.proyecto.backend.service;

import com.proyecto.backend.model.Usuario;
import com.proyecto.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    /**
     * Carga los detalles del usuario por nombre de usuario O email
     * Permite login tanto con username como con email
     *
     * @param usernameOrEmail Nombre de usuario o email
     * @return UserDetails del usuario
     * @throws UsernameNotFoundException Si el usuario no existe
     */
    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        // Primero intentar buscar por username
        Usuario usuario = usuarioRepository.findByUsername(usernameOrEmail)
                .orElseGet(() ->
                    // Si no encuentra por username, buscar por email
                    usuarioRepository.findByEmail(usernameOrEmail)
                        .orElseThrow(() -> new UsernameNotFoundException(
                            "Usuario con username o email '" + usernameOrEmail + "' no encontrado"))
                );

        return new User(
                usuario.getUsername(),
                usuario.getPassword(),
                true, // enabled
                true, // accountNonExpired
                true, // credentialsNonExpired
                true, // accountNonLocked
                getAuthorities(usuario)
        );
    }

    /**
     * Convierte el rol del usuario en autoridades de Spring Security
     */
    private Collection<? extends GrantedAuthority> getAuthorities(Usuario usuario) {
        Collection<GrantedAuthority> authorities = new ArrayList<>();

        if (usuario.getRole() != null) {
            authorities.add(new SimpleGrantedAuthority("ROLE_" + usuario.getRole().name()));
        }

        return authorities;
    }
}

