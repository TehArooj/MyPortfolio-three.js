import * as THREE from "../node_modules/three/build/three.module.js";
import * as dat from "../node_modules/dat.gui/build/dat.gui.module.js";
//import { gsap } from "gsap";
import { OrbitControls } from "https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js";
const gui = new dat.GUI();

const world = {
  plane: {
    width: 24,
    height: 24,
    widthSegments: 25,
    heightSegments: 25,
  },
};

const generatePlane = () => {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
  );

  // vertice position randomization
  const { array } = planeMesh.geometry.attributes.position;

  for (let i = 0; i < array.length; i += 3) {
    const x = array[i];
    const y = array[i + 1];
    const z = array[i + 2];

    array[i] = x + (Math.random() - 0.5);
    array[i + 1] = y + (Math.random() - 0.5);
    array[i + 2] = z + Math.random();
  }

  // color attribute addition
  const colors = [];
  for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4);
  }

  planeMesh.geometry.setAttribute(
    "color",
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  );
};

gui.add(world.plane, "width", 1, 50).onChange(() => {
  generatePlane();
});

gui.add(world.plane, "height", 1, 50).onChange(() => {
  generatePlane();
});

gui.add(world.plane, "widthSegments", 1, 50).onChange(() => {
  generatePlane();
});

gui.add(world.plane, "heightSegments", 1, 50).onChange(() => {
  generatePlane();
});

const raycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio); //used to set good quality pixels according to device
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);
camera.position.z = 5;

const planeGeometry = new THREE.PlaneGeometry(
  world.plane.width,
  world.plane.height,
  world.plane.widthSegments,
  world.plane.heightSegments
);
const planeMaterial = new THREE.MeshPhongMaterial({
  //color: 0x781c68,
  side: THREE.DoubleSide,
  flatShading: true,
  vertexColors: true,
}); //color in hexa decimal

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

scene.add(planeMesh);

// vertice position randomization
const { array } = planeMesh.geometry.attributes.position;

for (let i = 0; i < array.length; i += 3) {
  const x = array[i];
  const y = array[i + 1];
  const z = array[i + 2];

  array[i] = x + (Math.random() - 0.5);
  array[i + 1] = y + (Math.random() - 0.5);
  array[i + 2] = z + Math.random();
}

planeMesh.geometry.attributes.position.originalPosotion =
  planeMesh.geometry.attributes.position.array;

// color attribute addition
const colors = [];
for (let i = 0; i < planeMesh.geometry.attributes.position.count; i++) {
  colors.push(0, 0.19, 0.4);
}

planeMesh.geometry.setAttribute(
  "color",
  new THREE.BufferAttribute(new Float32Array(colors), 3)
);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, 0, 1);
scene.add(light);

const backLight = new THREE.DirectionalLight(0xffffff, 1);
backLight.position.set(0, 0, -1);
scene.add(backLight);

const mouse = {
  x: undefined,
  y: undefined,
};

let frame = 0;
const animate = () => {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  raycaster.setFromCamera(mouse, camera);

  frame += 0.01;
  const { array, originalPosotion } = planeMesh.geometry.attributes.position;
  for (let i = 0; i < array.length; i += 3) {
    //x
    array[i] = originalPosotion[i] + Math.cos(frame) * 0.01;
  }
  planeMesh.geometry.attributes.position.needsUpdate = true;

  const intersects = raycaster.intersectObject(planeMesh);
  if (intersects.length > 0) {
    const { color } = intersects[0].object.geometry.attributes;

    //vertice 1
    color.setX(intersects[0].face.a, 0.1);
    color.setY(intersects[0].face.a, 0.5);
    color.setZ(intersects[0].face.a, 1);

    //vertice 2
    color.setX(intersects[0].face.b, 0.1);
    color.setY(intersects[0].face.b, 0.5);
    color.setZ(intersects[0].face.b, 1);

    //vertice 3
    color.setX(intersects[0].face.c, 0.1);
    color.setY(intersects[0].face.c, 0.5);
    color.setZ(intersects[0].face.c, 1);

    intersects[0].object.geometry.attributes.color.needsUpdate = true;
  }

  // animate the hover

  /*const initialColor = {
    r: 0,
    g: 0.19,
    b: 0.4,
  };
  const hoverColor = {
    r: 0.1,
    g: 0.5,
    b: 1,
  };
  gsap.to(hoverColor, {
    r: initialColor.r,
    g: initialColor.g,
    b: initialColor.b,
    duration: 1,
    onUpdate: () => {
      //vertice 1
      color.setX(intersects[0].face.a, hoverColor.r);
      color.setY(intersects[0].face.a, hoverColor.g);
      color.setZ(intersects[0].face.a, hoverColor.b);

      //vertice 2
      color.setX(intersects[0].face.b, hoverColor.r);
      color.setY(intersects[0].face.b, hoverColor.g);
      color.setZ(intersects[0].face.b, hoverColor.b);

      //vertice 3
      color.setX(intersects[0].face.c, hoverColor.r);
      color.setY(intersects[0].face.c, hoverColor.g);
      color.setZ(intersects[0].face.c, hoverColor.b);

      color.needsUpdate = true;
    },
  });*/
  //planeMesh.rotation.x += 0.01;
  //planeMesh.rotation.y += 0.01;
};

animate();

addEventListener("mousemove", (event) => {
  event.preventDefault();
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});
