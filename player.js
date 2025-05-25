class Player {
  constructor(fov = 60, sensitivity = 0.1) {
    this.pos = createVector(width / 2, height / 2);
    this.fov = radians(fov);
    this.heading = 0;
    this.totalRays = width;
    this.sensitivity = sensitivity;
    this.updateRays();
  }

  updateRays() {
    this.rays = [];
    const halfFOV = this.fov / 2;
    for (let i = 0; i < this.totalRays; i++) {
      const angle = map(i, 0, this.totalRays, -halfFOV, halfFOV) + this.heading;
      this.rays.push(new Ray(this.pos, angle));
    }
  }

  rotate(a) {
    this.heading += a;
    this.updateRays();
  }

  move(dx, dy) {
    this.pos.add(dx, dy);
    this.updateRays();
  }

  look(walls, returnDataOnly = false) {
  const scene = [];

  for (let i = 0; i < this.rays.length; i++) {
    const ray = this.rays[i];
    const angle = this.heading - this.fov / 2 + (i * this.fov / this.rays.length);
    ray.setAngle(angle);

    let closest = null;
    let record = Infinity;
    let color;

    for (let wall of walls) {
      const pt = ray.cast(wall);
      if (pt) {
        const d = p5.Vector.dist(this.pos, pt);
        const l = p5.Vector.dist(wall.a, pt);
        if (d < record) {
          record = d;
          length = l;
          closest = pt;
          color = wall.color;
        }
      }
    }

    const angleOffset = angle - this.heading;

    scene.push({
      point: closest || this.pos.copy(),
      distance: record,
      angleOffset: angleOffset, 
      color: color,
      length: length
    });
  }
    return scene;
  }
}
