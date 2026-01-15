// Gestor centralizado de toques - evita conflictos entre joystick y cámara
const TouchManager = {
    touches: new Map(), // Almacena todos los toques activos
    joystickTouchId: null,
    cameraTouchId: null,
    jumpTouchId: null,
    sprintTouchId: null,
    
    // Referencias a elementos
    joystickBase: null,
    joystickStick: null,
    joystickContainer: null,
    jumpButton: null,
    sprintButton: null,
    
    // Estado del joystick
    joystickBaseX: 0,
    joystickBaseY: 0,
    joystickInputX: 0,
    joystickInputY: 0,
    joystickMaxDistance: 45,
    joystickActive: false,
    
    // Estado de cámara
    cameraLastX: 0,
    cameraLastY: 0,
    
    // Estado de botones
    isJumping: false,
    isSprinting: false,
    
    init() {
        this.joystickContainer = document.getElementById('joystick-container');
        this.joystickBase = document.getElementById('joystick-base');
        this.joystickStick = document.getElementById('joystick-stick');
        this.jumpButton = document.getElementById('jump-button');
        this.sprintButton = document.getElementById('sprint-button');
        
        // Un solo listener global para todos los eventos táctiles
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        document.addEventListener('touchcancel', (e) => this.handleTouchEnd(e), { passive: false });
    },
    
    handleTouchStart(e) {
        if (!GameState.isPlaying) return;
        
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            
            // Guardar el toque
            this.touches.set(touch.identifier, {
                x: touch.clientX,
                y: touch.clientY,
                target: target
            });
            
            // Determinar qué control activar
            if (this.isInsideElement(touch, this.joystickBase) && this.joystickTouchId === null) {
                e.preventDefault();
                this.startJoystick(touch);
            } 
            else if (this.isInsideElement(touch, this.jumpButton) && this.jumpTouchId === null) {
                e.preventDefault();
                this.jumpTouchId = touch.identifier;
                this.isJumping = true;
            }
            else if (this.isInsideElement(touch, this.sprintButton) && this.sprintTouchId === null) {
                e.preventDefault();
                this.sprintTouchId = touch.identifier;
                this.isSprinting = true;
                this.sprintButton.classList.add('active');
            }
            else if (this.cameraTouchId === null && 
                     !this.isInsideElement(touch, this.joystickContainer) &&
                     !this.isInsideElement(touch, this.jumpButton) &&
                     !this.isInsideElement(touch, this.sprintButton)) {
                // Toque para cámara (cualquier lugar que no sea un control)
                this.cameraTouchId = touch.identifier;
                this.cameraLastX = touch.clientX;
                this.cameraLastY = touch.clientY;
            }
        }
    },
    
    handleTouchMove(e) {
        if (!GameState.isPlaying) return;
        
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            
            // Actualizar posición guardada
            if (this.touches.has(touch.identifier)) {
                this.touches.get(touch.identifier).x = touch.clientX;
                this.touches.get(touch.identifier).y = touch.clientY;
            }
            
            // Mover joystick
            if (touch.identifier === this.joystickTouchId) {
                e.preventDefault();
                this.updateJoystick(touch);
            }
            
            // Mover cámara
            if (touch.identifier === this.cameraTouchId) {
                e.preventDefault();
                this.updateCamera(touch);
            }
        }
    },
    
    handleTouchEnd(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            
            // Eliminar de la lista de toques
            this.touches.delete(touch.identifier);
            
            // Liberar joystick
            if (touch.identifier === this.joystickTouchId) {
                this.resetJoystick();
            }
            
            // Liberar cámara
            if (touch.identifier === this.cameraTouchId) {
                this.cameraTouchId = null;
            }
            
            // Liberar salto
            if (touch.identifier === this.jumpTouchId) {
                this.jumpTouchId = null;
                this.isJumping = false;
            }
            
            // Liberar sprint
            if (touch.identifier === this.sprintTouchId) {
                this.sprintTouchId = null;
                this.isSprinting = false;
                this.sprintButton.classList.remove('active');
            }
        }
    },
    
    isInsideElement(touch, element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return touch.clientX >= rect.left && 
               touch.clientX <= rect.right && 
               touch.clientY >= rect.top && 
               touch.clientY <= rect.bottom;
    },
    
    startJoystick(touch) {
        this.joystickTouchId = touch.identifier;
        this.joystickActive = true;
        
        const rect = this.joystickBase.getBoundingClientRect();
        this.joystickBaseX = rect.left + rect.width / 2;
        this.joystickBaseY = rect.top + rect.height / 2;
        
        this.updateJoystick(touch);
    },
    
    updateJoystick(touch) {
        let deltaX = touch.clientX - this.joystickBaseX;
        let deltaY = touch.clientY - this.joystickBaseY;
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance > this.joystickMaxDistance) {
            deltaX = (deltaX / distance) * this.joystickMaxDistance;
            deltaY = (deltaY / distance) * this.joystickMaxDistance;
        }
        
        // Normalizar input (-1 a 1)
        this.joystickInputX = deltaX / this.joystickMaxDistance;
        this.joystickInputY = deltaY / this.joystickMaxDistance;
        
        // Actualizar visual
        this.joystickStick.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
    },
    
    resetJoystick() {
        this.joystickTouchId = null;
        this.joystickActive = false;
        this.joystickInputX = 0;
        this.joystickInputY = 0;
        this.joystickStick.style.transform = 'translate(-50%, -50%)';
    },
    
    updateCamera(touch) {
        const deltaX = touch.clientX - this.cameraLastX;
        const deltaY = touch.clientY - this.cameraLastY;
        
        PlayerControls.yaw -= deltaX * CONFIG.touchSensitivity;
        PlayerControls.pitch -= deltaY * CONFIG.touchSensitivity;
        PlayerControls.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, PlayerControls.pitch));
        
        this.cameraLastX = touch.clientX;
        this.cameraLastY = touch.clientY;
    },
    
    getJoystickInput() {
        return {
            x: this.joystickInputX,
            y: this.joystickInputY,
            active: this.joystickActive
        };
    }
};
