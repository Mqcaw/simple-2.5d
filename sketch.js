let walls = [];
let player;
let keys = {};
let img;

function preload() {
  img = loadImage('stone.png');
  img.loadPixels();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
  player = new Player(80, 0.1);

  for (let i = 0; i < 5; i++) {
    walls.push(new Wall(random(width), random(height), random(width), random(height), [random(255), random(255), random(255)]));
  }

  walls.push(new Wall(0, 0, width, 0, [random(255), random(255), random(255)]));
  walls.push(new Wall(width, 0, width, height, [random(255), random(255), random(255)]));
  walls.push(new Wall(width, height, 0, height, [random(255), random(255), random(255)]));
  walls.push(new Wall(0, height, 0, 0, [random(255), random(255), random(255)]));
}

function draw() {
  background(0);
  handleInput();
  const scene = player.look(walls);
  render3D(scene);
  drawMiniMap();
  drawCrosshair();
}

function render3D(scene) {
  loadPixels();
  img.loadPixels();
  const scale = height * 100;

  for (let i = 0; i < scene.length; i++) {
    const ray = scene[i];
    const dist = Math.max(ray.distance * Math.cos(ray.angleOffset), 0.001);
    const wallHeight = Math.min((1 / dist) * scale, height);
    const topY = Math.floor((height - wallHeight) / 2);

    const texX = Math.floor((ray.texOffset ?? 0.5) * img.width) % img.width;

    for (let y = 0; y < wallHeight; y++) {
      const screenY = topY + y;
      if (screenY < 0 || screenY >= height) continue;

      const texY = Math.floor((y / wallHeight) * img.height);
      const texIndex = 4 * (texY * img.width + texX);

      let r = img.pixels[texIndex];
      let g = img.pixels[texIndex + 1];
      let b = img.pixels[texIndex + 2];

      
      const shade = map(dist, 0, max(width, height), 1, 0)
      r *= shade;
      g *= shade;
      b *= shade;
      

      const x = i;
      const index = 4 * (screenY * width + x);
      pixels[index] = r;
      pixels[index + 1] = g;
      pixels[index + 2] = b;
      pixels[index + 3] = 255;
    }
  }

  updatePixels(); // Push all pixels to the screen
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function handleInput() {
  const speed = 4;
  const angle = player.heading;
  const dir = createVector(cos(angle), sin(angle));
  const perp = createVector(-dir.y, dir.x);

  let movement = createVector(0, 0);
  if (keys['w']) movement.add(dir.copy().mult(speed));
  if (keys['s']) movement.add(dir.copy().mult(-speed));
  if (keys['a']) movement.add(perp.copy().mult(-speed));
  if (keys['d']) movement.add(perp.copy().mult(speed));
  player.move(movement.x, movement.y);
}

function keyPressed() {
  keys[key.toLowerCase()] = true;

  if (!document.pointerLockElement) {
    requestPointerLock();
  }
}

function keyReleased() {
  keys[key.toLowerCase()] = false;
}

function mouseMoved(event) {
  if (document.pointerLockElement) {
    player.rotate(radians(event.movementX * player.sensitivity));
  }
}

function mouseWheel(event) {

}

function requestPointerLock() {
  const canvas = document.querySelector('canvas');
  if (canvas.requestPointerLock) {
    canvas.requestPointerLock();
  }
}

function drawMiniMap() {
  const scale = 0.15;
  const w = width * scale;
  const h = height * scale;

  push();
  translate(10, 10);

  noStroke();
  fill(0);
  rect(0, 0, w, h);

  noFill();
  stroke(255);
  rect(0, 0, w, h);

  for (let wall of walls) {
    stroke(wall.color[0], wall.color[1], wall.color[2]);
    line(
      wall.a.x * scale, wall.a.y * scale,
      wall.b.x * scale, wall.b.y * scale
    );
  }

  stroke(100, 255, 100, 100);
  const scene = player.look(walls, true);
  for (let i = 0; i < scene.length; i++) {
    const pt = scene[i].point;
    line(
      player.pos.x * scale, player.pos.y * scale,
      pt.x * scale, pt.y * scale
    );
  }

  fill(255, 255, 0);
  noStroke();
  ellipse(player.pos.x * scale, player.pos.y * scale, 6);

  stroke(255, 255, 0);
  const dir = p5.Vector.fromAngle(player.heading).mult(20);
  line(
    player.pos.x * scale,
    player.pos.y * scale,
    (player.pos.x + dir.x) * scale,
    (player.pos.y + dir.y) * scale
  );

  pop();
}

function drawCrosshair() {
  let thickness = 2;
  let length = 15;
  fill(255);
  noStroke();
  rect((width / 2) - (thickness / 2), (height / 2) - (length / 2), thickness, length);
  rect((width / 2) - (length / 2), (height / 2) - (thickness / 2), length, thickness);
}