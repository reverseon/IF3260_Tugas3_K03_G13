import {Vec2} from "./Vec2";

class Vec3 {
    memory: number[] = new Array(3);
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
    public set z(value: number) {
        this.memory[2] = value;
    }
    public get z(): number {
        return this.memory[2];
    }
    public get xy(): Vec2 {
        return new Vec2([this.x, this.y]);
    }
    public get yz(): Vec2 {
        return new Vec2([this.y, this.z]);
    }
    public get xz(): Vec2 {
        return new Vec2([this.x, this.z]);
    }
    constructor(vec: number[]) {
        this.memory = vec;
    }
    static zero(): Vec3 {
        return new Vec3([0, 0, 0]);
    }
    static one(): Vec3 {
        return new Vec3([1, 1, 1]);
    }
    static up(): Vec3 {
        return new Vec3([0, 1, 0]);
    }
    static down(): Vec3 {
        return new Vec3([0, -1, 0]);
    }
    static left(): Vec3 {
        return new Vec3([-1, 0, 0]);
    }
    static right(): Vec3 {
        return new Vec3([1, 0, 0]);
    }
    static forward(): Vec3 {
        return new Vec3([0, 0, 1]);
    }
    static backward(): Vec3 {
        return new Vec3([0, 0, -1]);
    }
    normalize(): Vec3 {
        let len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + 0.000000001);
        return new Vec3([this.x / len, this.y / len, this.z / len]);
    }
    print(): void {
        console.log(`[${this.x}, ${this.y}, ${this.z}]`);
    }
    toFloat32Array(): Float32Array {
        return new Float32Array(this.memory);
    }
    multiply_scalar(scalar: number): Vec3 {
        return new Vec3([this.x * scalar, this.y * scalar, this.z * scalar]);
    }
    add(vec: Vec3): Vec3 {
        return new Vec3([this.x + vec.x, this.y + vec.y, this.z + vec.z]);
    }
    subtract(vec: Vec3): Vec3 {
        return new Vec3([this.x - vec.x, this.y - vec.y, this.z - vec.z]);
    }
    dot(vec: Vec3): number {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z;
    }
    cross(vec: Vec3): Vec3 {
        return new Vec3([this.y * vec.z - this.z * vec.y, this.z * vec.x - this.x * vec.z, this.x * vec.y - this.y * vec.x]);
    }
    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    distance(vec: Vec3): number {
        return Math.sqrt(Math.pow(this.x - vec.x, 2) + Math.pow(this.y - vec.y, 2) + Math.pow(this.z - vec.z, 2));
    }
    angle(vec: Vec3): number {
        return Math.acos(this.dot(vec) / (this.length() * vec.length()));
    }
    lerp(vec: Vec3, t: number): Vec3 {
        return new Vec3([this.x + (vec.x - this.x) * t, this.y + (vec.y - this.y) * t, this.z + (vec.z - this.z) * t]);
    }
    equals(vec: Vec3): boolean {
        return this.x == vec.x && this.y == vec.y && this.z == vec.z;
    }
}

export { Vec3 };