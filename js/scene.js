// Configuración de la escena Three.js
const GameScene = {
    scene: null,
    camera: null,
    renderer: null,
    
    init() {
        // Crear escena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb);
        
        // Crear cámara
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, CONFIG.playerHeight, 0);
        
        // Crear renderer
        const canvas = document.getElementById('canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas, 
            antialias: false 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;
        
        // Configurar luces
        this.setupLights();
        
        // Crear mundo
        this.createWorld();
        
        // Manejar resize
        window.addEventListener('resize', () => this.onResize());
    },
    
    setupLights() {
        // Luz ambiental
        const ambient = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambient);
        
        // Luz direccional (sol)
        const sun = new THREE.DirectionalLight(0xffffff, 0.5);
        sun.position.set(50, 50, 50);
        sun.castShadow = true;
        sun.shadow.mapSize.width = 512;
        sun.shadow.mapSize.height = 512;
        sun.shadow.camera.left = -30;
        sun.shadow.camera.right = 30;
        sun.shadow.camera.top = 30;
        sun.shadow.camera.bottom = -30;
        this.scene.add(sun);
    },
    
    createWorld() {
        // Suelo
        const floorGeometry = new THREE.PlaneGeometry(50, 50);
        const floorMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 });
        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        this.scene.add(floor);
        
        // Columnas
        const columnGeometry = new THREE.CylinderGeometry(1, 1, 8, 8);
        const columnMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        
        const positions = [
            [24, 4, 24],
            [-24, 4, 24],
            [24, 4, -24],
            [-24, 4, -24]
        ];
        
        positions.forEach(pos => {
            const column = new THREE.Mesh(columnGeometry, columnMaterial);
            column.position.set(pos[0], pos[1], pos[2]);
            column.castShadow = true;
            this.scene.add(column);
        });
    },
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    
    render() {
        this.renderer.render(this.scene, this.camera);
    }
};
