package com.proyecto.backend.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }

    public static ResourceNotFoundException withId(String entityName, Long id) {
        return new ResourceNotFoundException(entityName + " con ID " + id + " no encontrado");
    }
}

