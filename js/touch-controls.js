// Sistema de controles táctiles para rotación de cámara
const TouchCamera = {
    active: false,
    touchId: null,
    lastX: 0,
    lastY: 0,
    
    init() {
        document.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
        document.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: false });
        document.addEventListener('touchcancel', (e) => this.onTouchEnd(e), { passive: false });
    },
    
    onTouchStart(e) {
        if (!GameState.isPlaying || !GameState.isMobile) return;
        
        // Ignorar toques en el joystick y botones
        const target = e.target;
        if (target.closest('#joystick-container') || 
            target.closest('#jump-button') || 
            target.closest('#sprint-button')) {
            return;
        }
        
        // Solo usar el primer toque disponible para la cámara
        if (this.active) return;
        
        const touch = e.changedTouches[0];
        this.touchId = touch.identifier;
        this.active = true;
        this.lastX = touch.clientX;
        this.lastY = touch.clientY;
    },
    
    onTouchMove(e) {
        if (!this.active || !GameState.isPlaying) return;
        
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (touch.identifier === this.touchId) {
                const deltaX = touch.clientX - this.lastX;
                const deltaY = touch.clientY - this.lastY;
                
                // Actualizar rotación de cámara
                PlayerControls.yaw -= deltaX * CONFIG.touchSensitivity;
                PlayerControls.pitch -= deltaY * CONFIG.touchSensitivity;
                PlayerControls.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, PlayerControls.pitch));
                
                this.lastX = touch.clientX;
                this.lastY = touch.clientY;
                break;
            }
        }
    },
    
    onTouchEnd(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (touch.identifier === this.touchId) {
                this.active = false;
                this.touchId = null;
                break;
            }
        }
    }
};

// Botones de acción móvil
const MobileButtons = {
    jumpButton: null,
    sprintButton: null,
    isJumping: false,
    isSprinting: false,
    
    init() {
        this.jumpButton = document.getElementById('jump-button');
        this.sprintButton = document.getElementById('sprint-button');
        
        if (this.jumpButton) {
            this.jumpButton.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.isJumping = true;
            }, { passive: false });
            
            this.jumpButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.isJumping = false;
            }, { passive: false });
        }
        
        if (this.sprintButton) {
            this.sprintButton.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.isSprinting = true;
                this.sprintButton.classList.add('active');
            }, { passive: false });
            
            this.sprintButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.isSprinting = false;
                this.sprintButton.classList.remove('active');
            }, { passive: false });
        }
    }
};
