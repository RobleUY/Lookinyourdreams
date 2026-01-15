// Sistema de menú
const Menu = {
    menuScreen: null,
    playButton: null,
    
    init() {
        this.menuScreen = document.getElementById('menu-screen');
        this.playButton = document.getElementById('play-button');
        
        if (this.playButton) {
            this.playButton.addEventListener('click', () => this.startGame());
            this.playButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.startGame();
            });
        }
    },
    
    startGame() {
        if (GameState.isPlaying) return;
        
        GameState.isPlaying = true;
        
        // Ocultar menú
        if (this.menuScreen) {
            this.menuScreen.classList.add('hidden');
        }
        
        // En PC, activar pointer lock y ocultar cursor
        if (!GameState.isMobile) {
            document.body.classList.add('playing');
            document.body.requestPointerLock();
        }
    },
    
    showMenu() {
        GameState.isPlaying = false;
        
        if (this.menuScreen) {
            this.menuScreen.classList.remove('hidden');
        }
        
        document.body.classList.remove('playing');
        
        if (document.pointerLockElement) {
            document.exitPointerLock();
        }
    }
};
