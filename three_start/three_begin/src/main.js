import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'lil-gui';
import { gsap } from 'gsap';

import Card from './Card';


window.addEventListener('load', function() {
  init();
});

function init() {
  
  const gui = new GUI();
  const COLORS = ['#ff6e6e', '#31e0c1', '#006fff', '#ffd732'];

  // 1_렌더러
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });

  // 1-1 렌더사이즈
  renderer.setClearColor(0x00aaff, 0.5);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 2_씬
  const scene = new THREE.Scene();

  // 3_카메라
  const camera = new THREE.PerspectiveCamera(
    75, //fov
    window.innerWidth / window.innerHeight, // 종횡비
    0.1, //near distance 
    1000,  //far distance 
  );

  // 10_Orbit 컨트롤러 ( 카메라의 위치가 변경 ) 
  // 컨트롤의 업데이트 메소드를 호출해줘야 함 
  const controls = new OrbitControls(camera, renderer.domElement);

  controls.autoRotate = true;
  controls.autoRotateSpeed = 2.5;
  controls.rotateSpeed = 0.75;
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.minPolarAngle = Math.PI / 2 - Math.PI / 3;
  controls.maxPolarAngle = Math.PI / 2 + Math.PI / 3;
  

  // //--------- 4_ 지오메트리 추가  ---------------------
  // const geometry = new THREE.IcosahedronGeometry(1);
  
  // //5_머터리얼 추가 
  // const material = new THREE.MeshStandardMaterial({
  //    color: 0x00ff00,
  //    emissive: 0x111111, 
  //   });
  
  // // //6_큐브 메쉬로 묶음 (6 <= 4+5 )
  // const cube = new THREE.Mesh(geometry, material);

  // // //7_씬에 큐브를 추가함 ( 2 <= 6(4+5))
  // scene.add(cube);

  //카드 메쉬 
  const card = new Card({
    width: 10,
    height: 15.8,
    radius: 0.5,
    color: COLORS[0],
  });

  card.mesh.rotation.z = Math.PI * 0.1;

  scene.add(card.mesh);

  //바닥 만들어보기 
  // const phongMaterial = new THREE.MeshPhongMaterial({
  //   color: 0x00ffff,
  // });
  // const planeGeometry = new THREE.PlaneGeometry(25, 25);
  // const planeMesh = new THREE.Mesh(planeGeometry, phongMaterial);
  // planeMesh.rotateX(-Math.PI / 2)
  // planeMesh.receiveShadow = true
  // scene.add(planeMesh)


  // Instantiate a loader (경로가 같은곳에 있어야 하네;; 상위폴더는안되네;;)
  // const loader = new GLTFLoader();
  // loader.load(
  //   'models/test.glb',
  //   function (glb) {
  //       console.log(glb);
  //       const root = glb.scene;
  //       root.scale.set(0.4,0.4,0.4)
  //       scene.add(root);
  //   },
  //   (xhr) => {
  //       console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
  //   },
  //   (error) => {
  //       console.log(error);
  //   }
  // )

  //--------------- gsap  -------------------------------
  gsap.to(card.mesh.rotation, { y: -Math.Pi * 4, duration: 2.5, ease: 'back.out(4)' });

  const cardFolder = gui.addFolder('Card');
  
  cardFolder
    .add(card.mesh.material, 'roughness')
    .min(0)
    .max(1)
    .step(0.01)
    .name('material.roughess');

  cardFolder
    .add(card.mesh.material, 'metalness')
    .min(0)
    .max(1)
    .step(0.01)
    .name('material.metalness');


  //3-1_카메라 포지션 설정 
  camera.position.z = 80;
  camera.position.y = 80;
  // camera.position.set(3, 4, 5);

  //3-2_카메라 look at 으로 constraint 강제, 제약시키기
  // camera.lookAt(planeMesh.position);

  
  // 8_조명 추가, 위치 ( 씬에 추가 ) 
  
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  ambientLight.position.set(-5, -5, -5);
  scene.add(ambientLight);

  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
  const directionalLight2 = directionalLight1.clone();

  directionalLight1.position.set(1, 1, 3);
  directionalLight2.position.set(-1, 1, -3);
  
  scene.add(directionalLight1, directionalLight2);
  

  //렌더러로 씬과 카메라를 렌더함. (1 <= 2(6=4+5) + 3 )
  // renderer.render(scene, camera); 
  
  // 컴퓨터성능과 무관한 기준 시간 설정
  // const clock = new THREE.Clock(); 
  
  
  //9_애니메이션 렌더함수가 매프레임마다 호출되도록 해놓은건가?
  function render() {
    // const elapsedTime = clock.getElapsedTime();
    controls.update();
    // cube.rotation.x = elapsedTime;
    // cube.rotation.y = elapsedTime;
    // THREE.MathUtils.degToRad(45);  //입력한 도를 라디안으로 변환 시켜줌
    // cube.rotation.x += clock.getDelta();
    // cube.position.y = Math.sin(cube.rotation.x); //sin값은 0~1사이 움직임


    renderer.render(scene, camera);
    requestAnimationFrame(render);
  
  }

  //9-1 렌더호출
  render();


  //화면 리사이징 업데이트 함수 & 카메라 종횡비도 같이 업데이트 필요
  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  };

  window.addEventListener('resize', handleResize);


  //버튼만들기 css 수정, 버튼누름기능추가
  const container = document.querySelector('.container');

  COLORS.forEach( color => {
    const button = document.createElement('button');
    button.style.backgroundColor = color;
    button.addEventListener('click', () => {
      card.mesh.material.color = new THREE.Color(color);
    })
    container.appendChild(button);

  });


  //----- 11_GUI ----- 
  // const gui = new GUI();
  // // 최대최소값을 설정하면 슬라이드효과가 활성화 됨 ( 스텝도되네 )
  // gui
  //   .add(cube.position, 'y')
  //   .min(-3)
  //   .max(3)
  //   .step(0.1)

  // gui.add(cube, 'visible');


  //Physics World 
  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0), // m/s2
  });

  const groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC, 
    shape: new CANNON.Plane(), 
  })
  groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0 ) //make it face up 
  world.addBody(groundBody)

}



//애니메이션
//OribitControl
//GUI 컨트롤 => npm lil-gui 라이브러리 설치법
//충돌물리효과


