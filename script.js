// Import Three.js (if needed in your environment)
// Make sure Three.js and OrbitControls are included in your HTML

// -----------------------------
// Scene Setup
// -----------------------------

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Create camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(3, 3, 5);

// Create renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// -----------------------------
// Lighting
// -----------------------------

// Directional light (creates shadows)
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
light.castShadow = true;
scene.add(light);

// Ambient light (soft global light)
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

// -----------------------------
// Green Plane (Ground)
// -----------------------------

const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0x00aa00
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
scene.add(plane);

// -----------------------------
// Molecule Group (so ONLY molecule rotates)
// -----------------------------

const molecule = new THREE.Group();
scene.add(molecule);

// -----------------------------
// Carbon Atom (Red)
// -----------------------------

const carbonGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const carbonMaterial = new THREE.MeshStandardMaterial({
  color: 0xff0000
});
const carbon = new THREE.Mesh(carbonGeometry, carbonMaterial);
carbon.castShadow = true;
molecule.add(carbon);

// -----------------------------
// Hydrogen Atoms (Blue)
// -----------------------------

const hydrogenGeometry = new THREE.SphereGeometry(0.3, 32, 32);
const hydrogenMaterial = new THREE.MeshStandardMaterial({
  color: 0x0000ff
});

// Tetrahedral positions
const positions = [
  [1, 1, 1],
  [-1, -1, 1],
  [-1, 1, -1],
  [1, -1, -1]
];

positions.forEach(pos => {
  const hydrogen = new THREE.Mesh(hydrogenGeometry, hydrogenMaterial);
  hydrogen.position.set(pos[0], pos[1], pos[2]).normalize().multiplyScalar(1.5);
  hydrogen.castShadow = true;
  molecule.add(hydrogen);

  // -----------------------------
  // Bonds (White Cylinders)
  // -----------------------------
  
  const bondGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.5, 32);
  const bondMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xaaaaaa
  });

  const bond = new THREE.Mesh(bondGeometry, bondMaterial);
  bond.castShadow = true;

  // Position bond between carbon and hydrogen
  bond.position.copy(hydrogen.position).multiplyScalar(0.5);

  // Make cylinder point correctly
  bond.lookAt(hydrogen.position);
  bond.rotateX(Math.PI / 2);

  molecule.add(bond);
});

// -----------------------------
// Mouse Controls (OrbitControls)
// -----------------------------

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableZoom = false;
controls.target.set(0, 0, 0);

// -----------------------------
// Animation Loop
// -----------------------------

function animate() {
  requestAnimationFrame(animate);

  // Slow automatic rotation
  molecule.rotation.y += 0.01;

  controls.update();
  renderer.render(scene, camera);
}

animate();

// -----------------------------
// Responsive Resize
// -----------------------------

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});