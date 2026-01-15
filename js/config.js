// Configuración del juego
const CONFIG = {
    moveSpeed: 0.15,
    sprintMultiplier: 1.8,
    mouseSensitivity: 0.002,
    touchSensitivity: 0.008, // Aumentada para mejor respuesta en móvil
    jumpForce: 0.25,
    gravity: 0.012,
    playerHeight: 1.6
};

// Estado del juego
const GameState = {
    isPlaying: false,
    isMobile: false,
    isPointerLocked: false
};

// Detectar si es móvil
function detectMobile() {
    GameState.isMobile = (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
    );
    return GameState.isMobile;
}
