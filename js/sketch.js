let walls = [];
let player;
let keys = {};
let tileSize = 80;
let texturesPaths = ['assets/black.png', 'assets/stone.png', 'assets/oak_planks.png', 'assets/cobblestone.png', 'assets/grass_block_side.png'];
let textures = [];
let canvas;


function preload() {
  for (let i = 0; i < texturesPaths.length; i++) {
    textures[i] = loadImage(texturesPaths[i]);
    textures[i].loadPixels();
  }
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.elt.addEventListener('click', requestPointerLock);
  noCursor();
  player = new Player(80, 0.1);

  
  for (let i = 0; i < 5; i++) {
    walls.push(new Wall(random(width), random(height), random(width), random(height), Math.floor(random(textures.length - 1)) + 1, [random(255), random(255), random(255)]));
  }
  
  
  walls.push(new Wall(tileSize, tileSize, tileSize * 2, tileSize, 4, [random(255), random(255), random(255)]));
  walls.push(new Wall(tileSize, tileSize * 2, tileSize * 2, tileSize * 2, 4, [random(255), random(255), random(255)]));
  walls.push(new Wall(tileSize, tileSize, tileSize, tileSize * 2, 4, [random(255), random(255), random(255)]));
  walls.push(new Wall(tileSize * 2, tileSize, tileSize * 2, tileSize * 2, 4, [random(255), random(255), random(255)]));

  walls.push(new Wall(0, 0, width, 0, Math.floor(random(textures.length - 1)) + 1, [random(255), random(255), random(255)]));
  walls.push(new Wall(width, 0, width,  height, Math.floor(random(textures.length - 1)) + 1, [random(255), random(255), random(255)]));
  walls.push(new Wall(width, height, 0, height, Math.floor(random(textures.length - 1)) + 1, [random(255), random(255), random(255)]));
  walls.push(new Wall(0, height, 0, 0, Math.floor(random(textures.length - 1)) + 1, [random(255), random(255), random(255)]));
  

  document.addEventListener('mousemove', mouseMoved);
}

function draw() {
  background(0);

  handleInput();
  const scene = player.look(walls);
  render3D(scene);

  drawMiniMap(scene);
  drawCrosshair();

}

function render3D(scene) {
  const scale = height * 100;
  const verticalStep = 2;
  loadPixels();
  //let mod = parseFloat(slider.value).toFixed(2);
  let mod = player.mod;

  for (let j = 0; j < pixels.length; j += 4) {
    if (j <= (pixels.length / 2) + ((pixels.length / height) *  player.mod)) {
      pixels[j] = 140;
      pixels[j + 1] = 175;
      pixels[j + 2] = 254;
      pixels[j + 3] = 255;
    } else {
      pixels[j] = 184;
      pixels[j + 1] = 207;
      pixels[j + 2] = 249;
      pixels[j + 3] = 255;
    }
      
    }

  for (let i = 0; i < scene.length; i++) {
    const ray = scene[i];
    const img = ray.texture? textures[ray.texture] : textures[0];
    const imgWidth = img.width;
    const imgHeight = img.height;
    const dist = Math.max(ray.distance * Math.cos(ray.angleOffset), 0.001);
    let wallHeight = Math.min((1 / dist) * scale, height * 10);

    const topY = Math.floor(((height - wallHeight) / 2) + player.mod);

    const texX = Math.floor((ray.length / tileSize) * imgWidth) % imgWidth;

    const shade = map(dist, 0, 8000, 0, 1);

    img.loadPixels();


    for (let y = 0; y < wallHeight; y += verticalStep) {
      const screenY = topY + y;
      if (screenY < 0 || screenY >= height) continue;

      const texY = Math.floor((y / wallHeight) * imgHeight);
      const texIndex = 4 * (texY * imgWidth + texX);

      let r = img.pixels[texIndex];
      let g = img.pixels[texIndex + 1];
      let b = img.pixels[texIndex + 2];
      let a = img.pixels[texIndex + 3]

      r = Math.floor(r + (192 - r) * shade);
      g = Math.floor(g + (216 - g) * shade);
      b = Math.floor(b + (255 - b) * shade);

      const index = 4 * (screenY * width + i);
      pixels[index] = r;
      pixels[index + 1] = g;
      pixels[index + 2] = b;
      pixels[index + 3] = a;

      

      if (verticalStep > 1 && screenY + 1 < height) {
        for(let fillY = 1; fillY < verticalStep && (screenY + fillY) < height; fillY++) {
          const fillIndex = 4 * ((screenY + fillY) * width + i);
          pixels[fillIndex] = r;
          pixels[fillIndex + 1] = g;
          pixels[fillIndex + 2] = b;
          pixels[fillIndex + 3] = a;
        }
      }
    }
  }
  updatePixels();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  player.totalRays = width;
  loadPixels();
}

function handleInput() {
  let speed = player.speed;
  const angle = player.heading;
  const dir = createVector(cos(angle), sin(angle));
  const perp = createVector(-dir.y, dir.x);

  let movement = createVector(0, 0);
  if (keys["shift"]) speed = Math.floor(player.speed * 2);
  if (keys['w']) movement.add(dir.copy().mult(speed));
  if (keys['s']) movement.add(dir.copy().mult(-speed));
  if (keys['a']) movement.add(perp.copy().mult(-speed));
  if (keys['d']) movement.add(perp.copy().mult(speed));
  player.move(movement.x, movement.y);
}

function keyPressed(event) {
  keys[key.toLowerCase()] = true;

  if (!document.pointerLockElement) {
    requestPointerLock();
  }
}


function keyReleased(event) {
  keys[key.toLowerCase()] = false;
}

function mouseMoved(event) {
  if (document.pointerLockElement) {
    player.rotate(radians(event.movementX * player.sensitivity));
    player.mod += -event.movementY * player.sensitivity * 15;
  }
}

function mouseWheel(event) {

}

function requestPointerLock() {
  if (canvas.elt.requestPointerLock) {
    canvas.elt.requestPointerLock();
  }
}

function drawMiniMap(scene) {
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