class Vec2 {
    memory: number[] = new Array(2);
    public get x(): number {
        return this.memory[0];
    }
    public set x(value: number) {
        this.memory[0] = value;
    }
    public set y(value: number) {
        this.memory[1] = value;
    }
    public get y(): number {
        return this.memory[1];
    }
    constructor(vec: number[]) {
        this.memory = vec;
    }
    static zero(): Vec2 {
        return new Vec2([0, 0]);
    }
    normalize(): Vec2 {
        let len = Math.sqrt(this.x * this.x + this.y * this.y) + 0.0001;
        return new Vec2([this.x / len, this.y / len]);
    }
    print(): void {
        console.log(`[${this.x}, ${this.y}]`);
    }
    toFloat32Array(): Float32Array {
        return new Float32Array(this.memory);
    }
    multiply_scalar(scalar: number): Vec2 {
        return new Vec2([this.x * scalar, this.y * scalar]);
    }
    add(vec: Vec2): Vec2 {
        return new Vec2([this.x + vec.x, this.y + vec.y]);
    }
    subtract(vec: Vec2): Vec2 {
        return new Vec2([this.x - vec.x, this.y - vec.y]);
    }
    dot(vec: Vec2): number {
        return this.x * vec.x + this.y * vec.y;
    }
    cross(vec: Vec2): number {
        return this.x * vec.y - this.y * vec.x;
    }
    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    distance(vec: Vec2): number {
        return Math.sqrt(Math.pow(this.x - vec.x, 2) + Math.pow(this.y - vec.y, 2));
    }
    angle(vec: Vec2): number {
        return Math.acos(this.dot(vec) / (this.length() * vec.length()));
    }
    lerp(vec: Vec2, t: number): Vec2 {
        return this.add(vec.subtract(this).multiply_scalar(t));
    }
}

export { Vec2 };