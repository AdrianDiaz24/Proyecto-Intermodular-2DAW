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
     * Carga los detalles del usuario por nombre de usuario
     *
     * @param username Nombre de usuario
     * @return UserDetails del usuario
     * @throws UsernameNotFoundException Si el usuario no existe
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario '" + username + "' no encontrado"));

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

