// Sistema de menú
const Menu = {
    menuScreen: null,
    playButton: null,
    settingsButton: null,
    settingsPanel: null,
    closeSettingsBtn: null,
    saveSettingsBtn: null,
    
    // Sliders
    mouseSensSlider: null,
    touchSensSlider: null,
    mouseSensValue: null,
    touchSensValue: null,
    
    init() {
        this.menuScreen = document.getElementById('menu-screen');
        this.playButton = document.getElementById('play-button');
        this.settingsButton = document.getElementById('settings-button');
        this.settingsPanel = document.getElementById('settings-panel');
        this.closeSettingsBtn = document.getElementById('close-settings');
        this.saveSettingsBtn = document.getElementById('save-settings');
        
        this.mouseSensSlider = document.getElementById('mouse-sensitivity');
        this.touchSensSlider = document.getElementById('touch-sensitivity');
        this.mouseSensValue = document.getElementById('mouse-sens-value');
        this.touchSensValue = document.getElementById('touch-sens-value');
        
        // Crear estrellas animadas
        this.createStars();
        
        // Cargar configuración guardada
        this.loadSettings();
        
        // Event listeners
        if (this.playButton) {
            this.playButton.addEventListener('click', () => this.startGame());
            this.playButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.startGame();
            });
        }
        
        if (this.settingsButton) {
            this.settingsButton.addEventListener('click', () => this.openSettings());
        }
        
        if (this.closeSettingsBtn) {
            this.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
        }
        
        if (this.saveSettingsBtn) {
            this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());
        }
        
        // Actualizar valores en tiempo real
        if (this.mouseSensSlider) {
            this.mouseSensSlider.addEventListener('input', () => {
                this.mouseSensValue.textContent = this.mouseSensSlider.value;
            });
        }
        
        if (this.touchSensSlider) {
            this.touchSensSlider.addEventListener('input', () => {
                this.touchSensValue.textContent = this.touchSensSlider.value;
            });
        }
    },
    
    createStars() {
        const starsContainer = document.getElementById('stars');
        if (!starsContainer) return;
        
        for (let i = 0; i < 50; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            star.style.animationDuration = (2 + Math.random() * 2) + 's';
            starsContainer.appendChild(star);
        }
    },
    
    loadSettings() {
        const savedMouseSens = localStorage.getItem('mouseSensitivity');
        const savedTouchSens = localStorage.getItem('touchSensitivity');
        
        if (savedMouseSens) {
            this.mouseSensSlider.value = savedMouseSens;
            this.mouseSensValue.textContent = savedMouseSens;
            CONFIG.mouseSensitivity = this.sliderToSensitivity(savedMouseSens, 'mouse');
        }
        
        if (savedTouchSens) {
            this.touchSensSlider.value = savedTouchSens;
            this.touchSensValue.textContent = savedTouchSens;
            CONFIG.touchSensitivity = this.sliderToSensitivity(savedTouchSens, 'touch');
        }
    },
    
    sliderToSensitivity(value, type) {
        // Convertir valor del slider (1-100) a sensibilidad real
        if (type === 'mouse') {
            // Rango: 0.0005 a 0.005
            return 0.0005 + (value / 100) * 0.0045;
        } else {
            // Rango: 0.002 a 0.02
            return 0.002 + (value / 100) * 0.018;
        }
    },
    
    openSettings() {
        this.settingsPanel.classList.add('visible');
    },
    
    closeSettings() {
        this.settingsPanel.classList.remove('visible');
    },
    
    saveSettings() {
        const mouseValue = this.mouseSensSlider.value;
        const touchValue = this.touchSensSlider.value;
        
        // Guardar en localStorage
        localStorage.setItem('mouseSensitivity', mouseValue);
        localStorage.setItem('touchSensitivity', touchValue);
        
        // Aplicar configuración
        CONFIG.mouseSensitivity = this.sliderToSensitivity(mouseValue, 'mouse');
        CONFIG.touchSensitivity = this.sliderToSensitivity(touchValue, 'touch');
        
        this.closeSettings();
    },
    
    startGame() {
        if (GameState.isPlaying) return;
        
        GameState.isPlaying = true;
        
        // Ocultar menú y mostrar crosshair
        if (this.menuScreen) {
            this.menuScreen.classList.add('hidden');
        }
        
        document.body.classList.add('playing');
        
        // En PC, activar pointer lock
        if (!GameState.isMobile) {
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
