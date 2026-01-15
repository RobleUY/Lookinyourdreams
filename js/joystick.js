// Sistema de Joystick para móviles
const Joystick = {
    active: false,
    touchId: null,
    baseX: 0,
    baseY: 0,
    stickX: 0,
    stickY: 0,
    inputX: 0,
    inputY: 0,
    maxDistance: 45,
    
    base: null,
    stick: null,
    container: null,
    
    init() {
        this.container = document.getElementById('joystick-container');
        this.base = document.getElementById('joystick-base');
        this.stick = document.getElementById('joystick-stick');
        
        if (!this.container || !this.base || !this.stick) return;
        
        // Eventos táctiles para el joystick
        this.base.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
        document.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: false });
        document.addEventListener('touchcancel', (e) => this.onTouchEnd(e), { passive: false });
    },
    
    onTouchStart(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (this.active) return;
        
        const touch = e.changedTouches[0];
        this.touchId = touch.identifier;
        this.active = true;
        
        const rect = this.base.getBoundingClientRect();
        this.baseX = rect.left + rect.width / 2;
        this.baseY = rect.top + rect.height / 2;
        
        this.updateStickPosition(touch.clientX, touch.clientY);
    },
    
    onTouchMove(e) {
        if (!this.active) return;
        
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (touch.identifier === this.touchId) {
                e.preventDefault();
                this.updateStickPosition(touch.clientX, touch.clientY);
                break;
            }
        }
    },
    
    onTouchEnd(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            const touch = e.changedTouches[i];
            if (touch.identifier === this.touchId) {
                this.reset();
                break;
            }
        }
    },
    
    updateStickPosition(touchX, touchY) {
        let deltaX = touchX - this.baseX;
        let deltaY = touchY - this.baseY;
        
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        if (distance > this.maxDistance) {
            deltaX = (deltaX / distance) * this.maxDistance;
            deltaY = (deltaY / distance) * this.maxDistance;
        }
        
        this.stickX = deltaX;
        this.stickY = deltaY;
        
        // Normalizar input (-1 a 1)
        this.inputX = deltaX / this.maxDistance;
        this.inputY = deltaY / this.maxDistance;
        
        // Actualizar posición visual del stick
        this.stick.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px))`;
    },
    
    reset() {
        this.active = false;
        this.touchId = null;
        this.stickX = 0;
        this.stickY = 0;
        this.inputX = 0;
        this.inputY = 0;
        this.stick.style.transform = 'translate(-50%, -50%)';
    },
    
    getInput() {
        return {
            x: this.inputX,
            y: this.inputY,
            active: this.active
        };
    }
};
