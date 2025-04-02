let mirrors = [];
const numMirrors = 7;
let angle = 0;
let particles = [];
const roomSize = 1000; // How large the surrounding space is

// --- UI Elements ---
let speedSlider;
let directionButton;
let speedValueSpan;
let rotationSpeed = 0.01;
let rotationDirection = 1; // 1 for clockwise, -1 for counter-clockwise


function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL); // Use WEBGL for 3D

  // --- Create UI Controls ---
  speedSlider = select('#speedSlider');
  directionButton = select('#directionButton');
  speedValueSpan = select('#speedValue');

  // Set initial value display and add listener
  speedValueSpan.html(rotationSpeed.toFixed(3));
  speedSlider.input(() => {
      rotationSpeed = parseFloat(speedSlider.value());
      speedValueSpan.html(rotationSpeed.toFixed(3));
  });

  // Add listener for direction button
  directionButton.mousePressed(() => {
      rotationDirection *= -1; // Toggle direction
  });


  // --- Initialize Mirrors ---
  // Place mirrors randomly within a sphere around the center
  let placementRadius = roomSize * 0.3; // How far out mirrors can be
  for (let i = 0; i < numMirrors; i++) {
    let r = random(placementRadius * 0.5, placementRadius); // Random distance from center
    let theta = random(TWO_PI); // Random angle around Y axis
    let phi = random(-PI / 3, PI / 3); // Random angle up/down from horizontal plane

    let x = r * cos(theta) * cos(phi);
    let y = r * sin(phi); // Use phi for height
    let z = r * sin(theta) * cos(phi);

    mirrors.push({
      position: createVector(x, y, z),
      rotationOffset: random(TWO_PI), // Give each mirror a unique starting rotation
      width: random(80, 150),
      height: random(120, 250)
    });
  }
}

function draw() {
  background(0); // Black background

  // --- Camera and Lighting ---
  orbitControl(); // Allows mouse dragging to rotate the view

  ambientLight(50); // Basic ambient light
  pointLight(255, 255, 255, 0, 0, 0); // White light from the center (plasma)
  directionalLight(100, 150, 255, 0.5, 0.5, -1); // A bluish directional light

  // --- Update Rotation Angle ---
  angle += rotationSpeed * rotationDirection;

  // --- Draw the "Room" (optional wireframe box) ---
  push();
  noFill();
  stroke(50); // Dark grey lines
  strokeWeight(2);
  box(roomSize);
  pop();


  // --- Draw Mirrors ---
  for (let i = 0; i < mirrors.length; i++) {
    let m = mirrors[i];

    push(); // Isolate transformations for this mirror

    translate(m.position.x, m.position.y, m.position.z); // Move to mirror's position

    // Rotate the mirror around its Y-axis
    rotateY(angle + m.rotationOffset);
    // You could add rotateX or rotateZ here for more complex tumbling

    // Mirror Appearance
    specularMaterial(200); // Shiny material
    shininess(80);        // How concentrated the shine is
    noStroke();           // No outline for a cleaner look

    // Draw the mirror as a plane
    plane(m.width, m.height);

    pop(); // Restore previous drawing state
  }

  // --- Plasma Particle Generator ---
  // Emit new particles occasionally
   if (frameCount % 2 === 0) { // Emit every 2 frames
      particles.push(new Particle(createVector(0, 0, 0)));
   }


  // Update and display particles
  // Loop backwards is important when removing items from array
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) {
      particles.splice(i, 1); // Remove dead particles
    }
  }
}

// --- Particle Class ---
class Particle {
  constructor(position) {
    this.position = position.copy();
    // Random velocity radiating outwards
    this.velocity = p5.Vector.random3D().mult(random(1, 4));
    this.lifespan = 255; // Start fully opaque
    // Plasma-like colors (cyan, magenta, yellow, white)
    this.color = random([
        color(0, 255, 255, this.lifespan), // Cyan
        color(255, 0, 255, this.lifespan), // Magenta
        color(255, 255, 0, this.lifespan), // Yellow
        color(255, 255, 255, this.lifespan) // White
        ]);
    this.size = random(2, 5);
  }

  update() {
    this.position.add(this.velocity);
    this.lifespan -= 3; // Fade out rate
     // Update alpha channel of the color
     this.color.setAlpha(this.lifespan);
  }

  display() {
    push();
    translate(this.position.x, this.position.y, this.position.z);
    noStroke();
    // Use emissiveMaterial for particles to make them glow independently of light
    emissiveMaterial(red(this.color), green(this.color), blue(this.color), this.lifespan);
    sphere(this.size); // Draw particle as a small sphere
    pop();
  }

  isDead() {
    return this.lifespan <= 0;
  }
}

// Adjust canvas size if window is resized
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}