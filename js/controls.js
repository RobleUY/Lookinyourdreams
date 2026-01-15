// Sistema de controles del jugador
const PlayerControls = {
    keys: {},
    yaw: 0,
    pitch: 0,
    velocityY: 0,
    isGrounded: true,
    
    init() {
        // Controles de teclado
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Control del mouse para PC
        document.addEventListener('mousemove', (e) => {
            if (!GameState.isPointerLocked || GameState.isMobile) return;
            
            this.yaw -= e.movementX * CONFIG.mouseSensitivity;
            this.pitch -= e.movementY * CONFIG.mouseSensitivity;
            this.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.pitch));
        });
        
        // Pointer lock para PC
        document.addEventListener('pointerlockchange', () => {
            GameState.isPointerLocked = document.pointerLockElement === document.body;
        });
    },
    
    update(camera) {
        if (!GameState.isPlaying) return;
        
        const direction = new THREE.Vector3();
        const right = new THREE.Vector3();
        
        direction.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
        right.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
        
        let currentSpeed = CONFIG.moveSpeed;
        
        // Sprint (PC o móvil)
        if (this.keys['shift'] || (GameState.isMobile && TouchManager.isSprinting)) {
            currentSpeed *= CONFIG.sprintMultiplier;
        }
        
        // Movimiento con teclado (PC)
        if (this.keys['w']) camera.position.add(direction.clone().multiplyScalar(currentSpeed));
        if (this.keys['s']) camera.position.add(direction.clone().multiplyScalar(-currentSpeed));
        if (this.keys['a']) camera.position.add(right.clone().multiplyScalar(-currentSpeed));
        if (this.keys['d']) camera.position.add(right.clone().multiplyScalar(currentSpeed));
        
        // Movimiento con joystick (móvil)
        if (GameState.isMobile) {
            const joystickInput = TouchManager.getJoystickInput();
            if (joystickInput.active) {
                camera.position.add(direction.clone().multiplyScalar(-joystickInput.y * currentSpeed));
                camera.position.add(right.clone().multiplyScalar(joystickInput.x * currentSpeed));
            }
        }
        
        // Salto
        const wantsJump = this.keys[' '] || (GameState.isMobile && TouchManager.isJumping);
        if (wantsJump && this.isGrounded) {
            this.velocityY = CONFIG.jumpForce;
            this.isGrounded = false;
        }
        
        // Gravedad
        this.velocityY -= CONFIG.gravity;
        camera.position.y += this.velocityY;
        
        // Colisión con el suelo
        if (camera.position.y <= CONFIG.playerHeight) {
            camera.position.y = CONFIG.playerHeight;
            this.velocityY = 0;
            this.isGrounded = true;
        }
        
        // Aplicar rotación de cámara
        camera.rotation.order = 'YXZ';
        camera.rotation.y = this.yaw;
        camera.rotation.x = this.pitch;
    }
};
