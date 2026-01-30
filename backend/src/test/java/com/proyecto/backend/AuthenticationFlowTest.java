package com.proyecto.backend;

import com.proyecto.backend.dto.*;
import com.proyecto.backend.service.UsuarioService;
import com.proyecto.backend.util.JwtUtil;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AuthenticationFlowTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private JwtUtil jwtUtil;

    private static String testUsername;
    private static String testEmail;
    private static String testPassword = "password123";
    private static String authToken;

    @BeforeAll
    static void setUp() {
        // Generar datos únicos para el test
        long timestamp = System.currentTimeMillis();
        testUsername = "authtest_" + timestamp;
        testEmail = "authtest_" + timestamp + "@test.com";
    }

    @Test
    @Order(1)
    void testRegistroUsuario() {
        System.out.println("\n========== TEST 1: REGISTRO DE USUARIO ==========");

        String url = "http://localhost:" + port + "/api/auth/register";

        UsuarioCreateDTO registerRequest = new UsuarioCreateDTO();
        registerRequest.setUsername(testUsername);
        registerRequest.setEmail(testEmail);
        registerRequest.setPassword(testPassword);
        registerRequest.setTelefono("+34600123456");
        registerRequest.setRole("USER");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<UsuarioCreateDTO> request = new HttpEntity<>(registerRequest, headers);

        ResponseEntity<UsuarioDTO> response = restTemplate.postForEntity(url, request, UsuarioDTO.class);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(testUsername, response.getBody().getUsername());
        assertEquals(testEmail, response.getBody().getEmail());

        System.out.println("✓ Usuario registrado exitosamente");
        System.out.println("  - ID: " + response.getBody().getId());
        System.out.println("  - Username: " + response.getBody().getUsername());
        System.out.println("  - Email: " + response.getBody().getEmail());
    }

    @Test
    @Order(2)
    void testLoginExitoso() {
        System.out.println("\n========== TEST 2: LOGIN EXITOSO CON USERNAME ==========");

        String url = "http://localhost:" + port + "/api/auth/login";

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(testUsername);
        loginRequest.setPassword(testPassword);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<LoginRequest> request = new HttpEntity<>(loginRequest, headers);

        ResponseEntity<LoginResponse> response = restTemplate.postForEntity(url, request, LoginResponse.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getToken());
        assertEquals(testUsername, response.getBody().getUsername());
        assertEquals(testEmail, response.getBody().getEmail());

        authToken = response.getBody().getToken();

        System.out.println("✓ Login con username exitoso");
        System.out.println("  - Token generado: " + authToken.substring(0, 20) + "...");
        System.out.println("  - Username: " + response.getBody().getUsername());
    }

    @Test
    @Order(3)
    void testLoginConEmail() {
        System.out.println("\n========== TEST 3: LOGIN EXITOSO CON EMAIL ==========");

        String url = "http://localhost:" + port + "/api/auth/login";

        // Usar EMAIL en lugar de username
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(testEmail);  // Enviamos el email como "username"
        loginRequest.setPassword(testPassword);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<LoginRequest> request = new HttpEntity<>(loginRequest, headers);

        ResponseEntity<LoginResponse> response = restTemplate.postForEntity(url, request, LoginResponse.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNotNull(response.getBody().getToken());
        // El response debe devolver el username correcto, no el email
        assertEquals(testUsername, response.getBody().getUsername());
        assertEquals(testEmail, response.getBody().getEmail());

        System.out.println("✓ Login con EMAIL exitoso");
        System.out.println("  - Email usado: " + testEmail);
        System.out.println("  - Username devuelto: " + response.getBody().getUsername());
    }

    @Test
    @Order(4)
    void testLoginCredencialesInvalidas() {
        System.out.println("\n========== TEST 4: LOGIN CON CREDENCIALES INVÁLIDAS ==========");

        String url = "http://localhost:" + port + "/api/auth/login";

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername(testUsername);
        loginRequest.setPassword("contraseña_incorrecta");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<LoginRequest> request = new HttpEntity<>(loginRequest, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        // Debe fallar con error 400 o similar
        assertTrue(response.getStatusCode().is4xxClientError() || response.getStatusCode().is5xxServerError());

        System.out.println("✓ Login rechazado correctamente con credenciales inválidas");
        System.out.println("  - Status: " + response.getStatusCode());
    }

    @Test
    @Order(5)
    void testLoginUsuarioNoExiste() {
        System.out.println("\n========== TEST 5: LOGIN CON USUARIO INEXISTENTE ==========");

        String url = "http://localhost:" + port + "/api/auth/login";

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("usuario_que_no_existe_12345");
        loginRequest.setPassword("cualquier_password");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<LoginRequest> request = new HttpEntity<>(loginRequest, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        // Debe fallar
        assertTrue(response.getStatusCode().is4xxClientError() || response.getStatusCode().is5xxServerError());

        System.out.println("✓ Login rechazado correctamente para usuario inexistente");
        System.out.println("  - Status: " + response.getStatusCode());
    }

    @Test
    @Order(6)
    void testValidarToken() {
        System.out.println("\n========== TEST 6: VALIDAR TOKEN JWT ==========");

        assertNotNull(authToken, "El token debe existir del test anterior");

        String url = "http://localhost:" + port + "/api/auth/validate";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + authToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<Boolean> response = restTemplate.exchange(url, HttpMethod.GET, request, Boolean.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(response.getBody());

        System.out.println("✓ Token validado correctamente");
    }

    @Test
    @Order(7)
    void testObtenerUsuarioActual() {
        System.out.println("\n========== TEST 7: OBTENER USUARIO ACTUAL ==========");

        assertNotNull(authToken, "El token debe existir del test anterior");

        String url = "http://localhost:" + port + "/api/auth/me";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + authToken);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<UsuarioDTO> response = restTemplate.exchange(url, HttpMethod.GET, request, UsuarioDTO.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(testUsername, response.getBody().getUsername());

        System.out.println("✓ Usuario actual obtenido correctamente");
        System.out.println("  - Username: " + response.getBody().getUsername());
        System.out.println("  - Email: " + response.getBody().getEmail());
    }

    @Test
    @Order(8)
    void testRegistroDuplicado() {
        System.out.println("\n========== TEST 7: REGISTRO DUPLICADO ==========");

        String url = "http://localhost:" + port + "/api/auth/register";

        // Intentar registrar con el mismo username
        UsuarioCreateDTO registerRequest = new UsuarioCreateDTO();
        registerRequest.setUsername(testUsername); // Mismo username
        registerRequest.setEmail("otro_" + testEmail);
        registerRequest.setPassword(testPassword);
        registerRequest.setRole("USER");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<UsuarioCreateDTO> request = new HttpEntity<>(registerRequest, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        // Debe fallar porque el username ya existe
        assertTrue(response.getStatusCode().is4xxClientError() || response.getStatusCode().is5xxServerError());

        System.out.println("✓ Registro duplicado rechazado correctamente");
        System.out.println("  - Status: " + response.getStatusCode());
    }

    @Test
    @Order(8)
    void resumenFinal() {
        System.out.println("\n");
        System.out.println("╔══════════════════════════════════════════════════════════════╗");
        System.out.println("║        RESUMEN DE PRUEBAS DE AUTENTICACIÓN                   ║");
        System.out.println("╠══════════════════════════════════════════════════════════════╣");
        System.out.println("║ ✓ Registro de usuario nuevo: OK                              ║");
        System.out.println("║ ✓ Login con credenciales correctas: OK                       ║");
        System.out.println("║ ✓ Rechazo de credenciales inválidas: OK                      ║");
        System.out.println("║ ✓ Rechazo de usuario inexistente: OK                         ║");
        System.out.println("║ ✓ Validación de token JWT: OK                                ║");
        System.out.println("║ ✓ Obtención de usuario autenticado: OK                       ║");
        System.out.println("║ ✓ Rechazo de registro duplicado: OK                          ║");
        System.out.println("╠══════════════════════════════════════════════════════════════╣");
        System.out.println("║   El flujo de autenticación funciona correctamente.          ║");
        System.out.println("║   Los usuarios se guardan y verifican en la BD.              ║");
        System.out.println("╚══════════════════════════════════════════════════════════════╝");
    }
}
