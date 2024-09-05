import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js'; 
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


if (WebGL.isWebGL2Available()) { // Caso o navegador suporte WEBGL (Maioria dos casos)
    init()
} else { // Caso o navegador não suporte WEBGL
    const warning = WebGL.getWebGL2ErrorMessage(); 
    document.getElementById('container').appendChild(warning); 
}

function init() {
    // Inicializando a câmera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0.54, 1.37, 1.74);
    camera.lookAt(0, 0, 0);

    // Inicializando o renderizador
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Inicializando controles
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.update(); // Feito pois houveram modificações manuais na câmera
    
    // Inicializando a cena
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xaaaaaa);

    // Inicializando luzes
    const ambientLight = new THREE.AmbientLight(0x404040, 2); // luz ambiente
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // Carrega obj e material
    // loadObjFile(scene, "Julia_Sculpt");

    // Carrega FBX
    loadFBXFile(scene, "Julia_Sculpt")
    
    // Criação do elemento CUBO
    const cube = createCube();

    // Criação do elemento LINE
    const line = createLine();

    // Adição de elementos que devem ser renderizados na cena
    // scene.add( cube );
    // scene.add( line );

    // Função para animar
    function animate() {
        renderer.render( scene, camera );
        // cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;
        // console.log(camera.position)
        controls.update();
    }

    // Executa este loop de animação
    renderer.setAnimationLoop( animate );
}

function loadObjFile(scene, object_name) {
    // Carregar materiais (.mtl)
    const mtlLoader = new MTLLoader();
    mtlLoader.load(`materials/${object_name}.mtl`, (materials) => {
        materials.preload();

        // Carregar objeto (.obj) com o material carregado
        const objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(`models/${object_name}.obj`, (object) => {
            object.position.set(0, 0, 0);
            scene.add(object);
        });
    });
}

function loadFBXFile(scene, object_name) {
    const fbxLoader = new FBXLoader;
        fbxLoader.load(
          `models/${object_name}.fbx`,
          function (object) {
            let fbxModel = object;
            fbxModel.scale.set(0.01, 0.01, 0.01); // Ajuste o tamanho se necessário
            scene.add(fbxModel);
          },
          function (xhr) {
            console.log((xhr.loaded / xhr.total) * 100 + '% carregado');
          },
          function (error) {
            console.error('Ocorreu um erro ao carregar o modelo:', error);
          }
        );
}

function createLine() {
    const line_material = new THREE.LineBasicMaterial({ color: 0x0000ff });
    const points = [];
    points.push(new THREE.Vector3(-10, 0, 0));
    points.push(new THREE.Vector3(0, 10, 0));
    points.push(new THREE.Vector3(10, 0, 0));
    const line_geometry = new THREE.BufferGeometry().setFromPoints(points);
    return new THREE.Mesh(line_geometry, line_material);
}

function createCube() {
    const cube_geometry = new THREE.BoxGeometry(1, 1, 1);
    const cube_material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    return new THREE.Mesh(cube_geometry, cube_material);
}

