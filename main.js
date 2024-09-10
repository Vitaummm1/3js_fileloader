import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


if (WebGL.isWebGL2Available()) { // Caso o navegador suporte WEBGL (Maioria dos casos)
	init()
} else { // Caso o navegador não suporte WEBGL
	const warning = WebGL.getWebGL2ErrorMessage();
	document.getElementById('container').appendChild(warning);
}

function init() {
	// Inicializando a câmera
	const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
	camera.position.set(0.7, 1.37, 2.5);

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

	// Inicializa os event listeners
	initializeEvents(scene)

	// Adicionado grid
	const gridHelper = new THREE.GridHelper(100, 100); // Tamanho 100x100
	scene.add(gridHelper);

	// Inicializando luzes
	const ambientLight = new THREE.AmbientLight(0x404040, 2); // luz ambiente
	scene.add(ambientLight);

	const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
	directionalLight.position.set(10, 10, 10);
	scene.add(directionalLight);

	// Carrega obj e material
	// loadObjFile(scene, "Julia_Sculpt");

	// Carrega FBX
	loadFBXFile(scene, './assets/models/Julia_Sculpt.fbx');

	// Criação do elemento CUBO
	const cube = createCube();

	// Criação do elemento LINE
	const line = createLine();

	// Adição de elementos que devem ser renderizados na cena
	// scene.add( cube );
	// scene.add( line );

	// Função para animar
	function animate() {
		renderer.render(scene, camera);
		// cube.rotation.x += 0.01;
		// cube.rotation.y += 0.01;
		controls.update();
	}

	// Executa este loop de animação
	renderer.setAnimationLoop(animate);
}

function loadObjFile(scene, object_name) {
	let loadingInfo = document.getElementById('loading-text')
	loadingInfo.innerText = 'Carregando materiais... 0%';
	loadingInfo.style.display = 'block';

	// Carregar materiais (.mtl)
	const mtlLoader = new MTLLoader();
	mtlLoader.load(`./assets/materials/${object_name}.mtl`, (materials) => {
		materials.preload();

		// Carregar objeto (.obj) com o material carregado
		const objLoader = new OBJLoader();
		objLoader.setMaterials(materials);
		objLoader.load(`./assets/models/${object_name}.obj`, (object) => {
			object.position.set(0, 0, 0);
			scene.add(object);
			loadingInfo.style.display = 'none';
		},
		function (xhr) {
			let percentComplete = (xhr.loaded / (xhr.total > xhr.loaded ? xhr.total : xhr.loaded)) * 100;
			loadingInfo.innerText =
				'Carregando... ' + Math.round(percentComplete) + '%';
		},
		function (error) {
			console.error('Ocorreu um erro ao carregar o modelo:', error);
			loadingInfo.innerText =
				'Erro ao carregar o modelo';
		});
	}, function (xhr) {
		let percentComplete = (xhr.loaded / (xhr.total > xhr.loaded ? xhr.total : xhr.loaded)) * 100;
		loadingInfo.innerText =
			'Carregando materiais... ' + Math.round(percentComplete) + '%';
	},
		function (error) {
			console.error('Ocorreu um erro ao carregar o modelo:', error);
			loadingInfo.innerText =
				'Erro ao carregar os materiais';
		}
	);
}

function loadGLBFile(scene, file) {
	let loadingInfo = document.getElementById('loading-text')
	loadingInfo.innerText = 'Carregando... 0%';
	loadingInfo.style.display = 'block';

	const gltfLoader = new GLTFLoader;
	gltfLoader.load(
		file,
		function (object) {
			let gltfModel = object;
			// gltModel.scale.set(0.01, 0.01, 0.01); // Ajuste o tamanho se necessário
			scene.add(gltfModel.scene);

			// Remove o texto de carregamento quando o modelo for carregado
			loadingInfo.style.display = 'none';
		},
		function (xhr) {
			let percentComplete = (xhr.loaded / (xhr.total > xhr.loaded ? xhr.total : xhr.loaded)) * 100;
			loadingInfo.innerText =
				'Carregando... ' + Math.round(percentComplete) + '%';
		},
		function (error) {
			console.error('Ocorreu um erro ao carregar o modelo:', error);
			loadingInfo.innerText =
				'Erro ao carregar o modelo';
		}
	);
}

function loadFBXFile(scene, file) {
	let loadingInfo = document.getElementById('loading-text')
	loadingInfo.innerText = 'Carregando... 0%';
	loadingInfo.style.display = 'block';

	const fbxLoader = new FBXLoader;
	fbxLoader.load(
		file,
		function (object) {
			let fbxModel = object;
			fbxModel.scale.set(0.01, 0.01, 0.01); // Ajuste o tamanho se necessário
			scene.add(fbxModel);

			// Remove o texto de carregamento quando o modelo for carregado
			loadingInfo.style.display = 'none';
		},
		function (xhr) {
			let percentComplete = (xhr.loaded / (xhr.total > xhr.loaded ? xhr.total : xhr.loaded)) * 100;
			loadingInfo.innerText =
				'Carregando... ' + Math.round(percentComplete) + '%';
		},
		function (error) {
			console.error('Ocorreu um erro ao carregar o modelo:', error);
			loadingInfo.innerText =
				'Erro ao carregar o modelo';
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

function initializeEvents(scene) {
	const dropArea = document.getElementById('drop-area');
	let dragCounter = 0 // Contador criado para evitar bug entre dragover/dragleave e conflito com outros childs (canvas)

	window.addEventListener('dragenter', (event) => {
		event.preventDefault();
		dragCounter++;
		if (dragCounter === 1) {
			dropArea.style.display = 'flex';
		}
	});

	window.addEventListener('dragleave', (event) => {
		event.preventDefault();
		dragCounter--;
		if (dragCounter === 0) {
			dropArea.style.display = 'none';
		}
	});

	window.addEventListener('dragover', (event) => {
		event.preventDefault();
	});

	window.addEventListener('drop', (event) => {
		event.preventDefault();
		dropArea.style.display = 'none';
		dragCounter = 0;

		const file = event.dataTransfer.files[0];

		if (file && file.name.endsWith('.fbx')) {
			const reader = new FileReader();
			reader.addEventListener('load', (event) => {
				loadFBXFile(scene, event.target.result)
			});

			reader.readAsDataURL(file); // Lê o arquivo como URL
		} else {
			alert('Por favor, solte um arquivo .fbx');
		}
	});
}

