import {Vec2} from "./Vec2";
import {Vec3} from "./Vec3";

class Vec4 {
    memory: number[] = new Array(4);
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
    public set w(value: number) {
        this.memory[3] = value;
    }
    public get w(): number {
        return this.memory[3];
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
    public get xyz(): Vec3 {
        return new Vec3([this.x, this.y, this.z]);
    }

    constructor(vec: number[]) {
        this.memory = vec;
    }
    static zero(): Vec4 {
        return new Vec4([0, 0, 0, 0]);
    }
    static one(): Vec4 {
        return new Vec4([1, 1, 1, 1]);
    }
    normalize(): Vec4 {
        let len = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w) + 0.0001;
        return new Vec4([this.x / len, this.y / len, this.z / len, this.w / len]);
    }
    print(): void {
        console.log(`[${this.x}, ${this.y}, ${this.z}, ${this.w}]`);
    }
    toFloat32Array(): Float32Array {
        return new Float32Array(this.memory);
    }
    multiply_scalar(scalar: number): Vec4 {
        return new Vec4([this.x * scalar, this.y * scalar, this.z * scalar, this.w * scalar]);
    }
    add(vec: Vec4): Vec4 {
        return new Vec4([this.x + vec.x, this.y + vec.y, this.z + vec.z, this.w + vec.w]);
    }
    subtract(vec: Vec4): Vec4 {
        return new Vec4([this.x - vec.x, this.y - vec.y, this.z - vec.z, this.w - vec.w]);
    }
    dot(vec: Vec4): number {
        return this.x * vec.x + this.y * vec.y + this.z * vec.z + this.w * vec.w;
    }
    cross(vec: Vec4): Vec4 {
        return new Vec4([
            this.y * vec.z - this.z * vec.y,
            this.z * vec.x - this.x * vec.z,
            this.x * vec.y - this.y * vec.x,
            0
        ]);
    }
    length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    }
    length_squared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    }
    distance(vec: Vec4): number {
        return Math.sqrt((this.x - vec.x) * (this.x - vec.x) + (this.y - vec.y) * (this.y - vec.y) + (this.z - vec.z) * (this.z - vec.z) + (this.w - vec.w) * (this.w - vec.w));
    }
}

export { Vec4 };