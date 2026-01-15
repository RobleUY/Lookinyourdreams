// Loop principal del juego
const Game = {
    init() {
        // Detectar dispositivo
        detectMobile();
        
        // Inicializar sistemas
        GameScene.init();
        PlayerControls.init();
        Menu.init();
        
        // Inicializar controles móviles si es necesario
        if (GameState.isMobile) {
            Joystick.init();
            TouchCamera.init();
            MobileButtons.init();
        }
        
        // Iniciar loop
        this.animate();
    },
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        if (GameState.isPlaying) {
            PlayerControls.update(GameScene.camera);
        }
        
        GameScene.render();
    }
};

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    Game.init();
});
