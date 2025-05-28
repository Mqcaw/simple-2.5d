class Wall {
  constructor(x1, y1, x2, y2, path, color) {
    this.a = createVector(x1, y1);
    this.b = createVector(x2, y2);
    this.texture = path;
    this.color = color;
  }

  show() {
    stroke(this.color[0], this.color[1], this.color[2]);
    line(this.a.x, this.a.y, this.b.x, this.b.y);
  }
}
