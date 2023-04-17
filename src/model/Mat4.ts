import {Vec4} from "./Vec4";
import {Vec3} from "./Vec3";

class Mat4 {
    memory: number[] = new Array(16); // 4x4 matrix, stored in column-major order
    constructor(mat: number[]) {
        this.memory = mat;
    }
    get(row: number, col: number): number {
        return this.memory[col * 4 + row];
    }
    inverse(): Mat4 {
        let m = this.memory;
        var m00 = m[0 * 4 + 0];
        var m01 = m[0 * 4 + 1];
        var m02 = m[0 * 4 + 2];
        var m03 = m[0 * 4 + 3];
        var m10 = m[1 * 4 + 0];
        var m11 = m[1 * 4 + 1];
        var m12 = m[1 * 4 + 2];
        var m13 = m[1 * 4 + 3];
        var m20 = m[2 * 4 + 0];
        var m21 = m[2 * 4 + 1];
        var m22 = m[2 * 4 + 2];
        var m23 = m[2 * 4 + 3];
        var m30 = m[3 * 4 + 0];
        var m31 = m[3 * 4 + 1];
        var m32 = m[3 * 4 + 2];
        var m33 = m[3 * 4 + 3];
        var tmp_0  = m22 * m33;
        var tmp_1  = m32 * m23;
        var tmp_2  = m12 * m33;
        var tmp_3  = m32 * m13;
        var tmp_4  = m12 * m23;
        var tmp_5  = m22 * m13;
        var tmp_6  = m02 * m33;
        var tmp_7  = m32 * m03;
        var tmp_8  = m02 * m23;
        var tmp_9  = m22 * m03;
        var tmp_10 = m02 * m13;
        var tmp_11 = m12 * m03;
        var tmp_12 = m20 * m31;
        var tmp_13 = m30 * m21;
        var tmp_14 = m10 * m31;
        var tmp_15 = m30 * m11;
        var tmp_16 = m10 * m21;
        var tmp_17 = m20 * m11;
        var tmp_18 = m00 * m31;
        var tmp_19 = m30 * m01;
        var tmp_20 = m00 * m21;
        var tmp_21 = m20 * m01;
        var tmp_22 = m00 * m11;
        var tmp_23 = m10 * m01;

        var t0 = (tmp_0 * m11 + tmp_3 * m21 + tmp_4 * m31) -
            (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
        var t1 = (tmp_1 * m01 + tmp_6 * m21 + tmp_9 * m31) -
            (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
        var t2 = (tmp_2 * m01 + tmp_7 * m11 + tmp_10 * m31) -
            (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
        var t3 = (tmp_5 * m01 + tmp_8 * m11 + tmp_11 * m21) -
            (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

        var d = 1.0 / (m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3);

        return new Mat4 ([
            d * t0,
            d * t1,
            d * t2,
            d * t3,
            d * ((tmp_1 * m10 + tmp_2 * m20 + tmp_5 * m30) -
                (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30)),
            d * ((tmp_0 * m00 + tmp_7 * m20 + tmp_8 * m30) -
                (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30)),
            d * ((tmp_3 * m00 + tmp_6 * m10 + tmp_11 * m30) -
                (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30)),
            d * ((tmp_4 * m00 + tmp_9 * m10 + tmp_10 * m20) -
                (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20)),
            d * ((tmp_12 * m13 + tmp_15 * m23 + tmp_16 * m33) -
                (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33)),
            d * ((tmp_13 * m03 + tmp_18 * m23 + tmp_21 * m33) -
                (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33)),
            d * ((tmp_14 * m03 + tmp_19 * m13 + tmp_22 * m33) -
                (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33)),
            d * ((tmp_17 * m03 + tmp_20 * m13 + tmp_23 * m23) -
                (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23)),
            d * ((tmp_14 * m22 + tmp_17 * m32 + tmp_13 * m12) -
                (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22)),
            d * ((tmp_20 * m32 + tmp_12 * m02 + tmp_19 * m22) -
                (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02)),
            d * ((tmp_18 * m12 + tmp_23 * m32 + tmp_15 * m02) -
                (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12)),
            d * ((tmp_22 * m22 + tmp_16 * m02 + tmp_21 * m12) -
                (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02))
        ]);
    }
    print_memory() {
        console.log(this.memory);
    }
    print() {
        console.log(this.get(0, 0), this.get(0, 1), this.get(0, 2), this.get(0, 3));
        console.log(this.get(1, 0), this.get(1, 1), this.get(1, 2), this.get(1, 3));
        console.log(this.get(2, 0), this.get(2, 1), this.get(2, 2), this.get(2, 3));
        console.log(this.get(3, 0), this.get(3, 1), this.get(3, 2), this.get(3, 3));
    }
    transpose(): Mat4 {
        return new Mat4([
            this.get(0, 0), this.get(1, 0), this.get(2, 0), this.get(3, 0),
            this.get(0, 1), this.get(1, 1), this.get(2, 1), this.get(3, 1),
            this.get(0, 2), this.get(1, 2), this.get(2, 2), this.get(3, 2),
            this.get(0, 3), this.get(1, 3), this.get(2, 3), this.get(3, 3),
        ]);
    }
    toFloat32Array(): Float32Array {
        return new Float32Array(this.memory);
    }
    mul(other: Mat4): Mat4 {
        // column major matrix multiplication
        let a = this.memory;
        let b = other.memory;
        var a00 = a[0 * 4 + 0];
        var a01 = a[0 * 4 + 1];
        var a02 = a[0 * 4 + 2];
        var a03 = a[0 * 4 + 3];
        var a10 = a[1 * 4 + 0];
        var a11 = a[1 * 4 + 1];
        var a12 = a[1 * 4 + 2];
        var a13 = a[1 * 4 + 3];
        var a20 = a[2 * 4 + 0];
        var a21 = a[2 * 4 + 1];
        var a22 = a[2 * 4 + 2];
        var a23 = a[2 * 4 + 3];
        var a30 = a[3 * 4 + 0];
        var a31 = a[3 * 4 + 1];
        var a32 = a[3 * 4 + 2];
        var a33 = a[3 * 4 + 3];
        var b00 = b[0 * 4 + 0];
        var b01 = b[0 * 4 + 1];
        var b02 = b[0 * 4 + 2];
        var b03 = b[0 * 4 + 3];
        var b10 = b[1 * 4 + 0];
        var b11 = b[1 * 4 + 1];
        var b12 = b[1 * 4 + 2];
        var b13 = b[1 * 4 + 3];
        var b20 = b[2 * 4 + 0];
        var b21 = b[2 * 4 + 1];
        var b22 = b[2 * 4 + 2];
        var b23 = b[2 * 4 + 3];
        var b30 = b[3 * 4 + 0];
        var b31 = b[3 * 4 + 1];
        var b32 = b[3 * 4 + 2];
        var b33 = b[3 * 4 + 3];
        return new Mat4([
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ]);
    }
    mul_vec4(other: Vec4): Vec4 {
        let x = other.x, y = other.y, z = other.z, w = other.w;
        return new Vec4(
            [this.get(0, 0) * x + this.get(0, 1) * y + this.get(0, 2) * z + this.get(0, 3) * w,
            this.get(1, 0) * x + this.get(1, 1) * y + this.get(1, 2) * z + this.get(1, 3) * w,
            this.get(2, 0) * x + this.get(2, 1) * y + this.get(2, 2) * z + this.get(2, 3) * w,
            this.get(3, 0) * x + this.get(3, 1) * y + this.get(3, 2) * z + this.get(3, 3) * w]
        );
    }
    static identity(): Mat4 {
        return new Mat4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }
    static translation(x: number, y: number, z: number): Mat4 {
        return new Mat4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            x, y, z, 1
        ]);
    }
    static scale(x: number, y: number, z: number): Mat4 {
        return new Mat4([
            x, 0, 0, 0,
            0, y, 0, 0,
            0, 0, z, 0,
            0, 0, 0, 1
        ]);
    }
    static rotation_x(angle: number): Mat4 {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        return new Mat4([
            1, 0, 0, 0,
            0, c, s, 0,
            0, -s, c, 0,
            0, 0, 0, 1
        ]);
    }
    static rotation_y(angle: number): Mat4 {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        return new Mat4([
            c, 0, -s, 0,
            0, 1, 0, 0,
            s, 0, c, 0,
            0, 0, 0, 1
        ]);
    }
    static rotation_z(angle: number): Mat4 {
        let c = Math.cos(angle);
        let s = Math.sin(angle);
        return new Mat4([
            c, s, 0, 0,
            -s, c, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }
    static orthographic(width: number, height: number, depth: number): Mat4 {
        //space x: -width/2 to width/2
        //space y: -height/2 to height/2
        //space z: -depth/2 to depth/2
        return new Mat4([
            2 / width, 0, 0, 0,
            0, 2 / height, 0, 0,
            0, 0, -2 / depth, 0,
            0, 0, 0, 1
        ]);
    }
    static perspective(fovRad: number, aspect: number, near: number, far: number): Mat4 {
        let f = Math.tan(Math.PI * 0.5 - 0.5 * fovRad);
        let nf = 1 / (near - far);
        // console.log("f", f);
        // console.log("nf", nf);
        return new Mat4([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (far + near) * nf, -1,
            0, 0, (2 * far * near) * nf, 0
        ]);
    }
    static look_at(eye: Vec3, center: Vec3, up: Vec3): Mat4 {
        // let z = Ops.vec4sub(eye, center).normalize();
        // console.log(Ops.vec4sub(eye, center));
        // let x = Ops.vec4sub(up, z).normalize();
        // let y = Ops.vec4cross(z, x).normalize();
        // console.log("x, y, z", x, y, z);
        // console.log("eye", eye);
        // console.log("left hand side", Ops.vec4dot(x, eye), Ops.vec4dot(y, eye), Ops.vec4dot(z, eye));
        // return new Mat4([
        //     x.x, x.y, x.z, -Ops.vec4dot(x, eye),
        //     y.x, y.y, y.z, -Ops.vec4dot(y, eye),
        //     z.x, z.y, z.z, -Ops.vec4dot(z, eye),
        //     0, 0, 0, 1
        // ]);
        // console.log("eye", eye);
        // console.log("center", center);
        // console.log("up", up);
        let z = eye.subtract(center).normalize();
        let x = up.cross(z).normalize();
        let y = z.cross(x).normalize();
        // console.log("x, y, z", x, y, z);
        // column major
        return new Mat4([
            x.x, x.y, x.z, 0,
            y.x, y.y, y.z, 0,
            z.x, z.y, z.z, 0,
            eye.x, eye.y, eye.z, 1
        ]);
    }
    static oblique(theta: number, phi: number, w: number, h: number, d: number): Mat4 {
        let epsilon = 0.00001;
        let cotTheta = -1 / Math.tan(theta + epsilon);
        let cotPhi = -1 / Math.tan(phi+ epsilon);
        let oblique = new Mat4([
            1, 0, 0, 0,
            0, 1, 0, 0,
            cotTheta, cotPhi, 1, 0,
            0, 0, 0, 1
        ]);
        let ortho = Mat4.orthographic(w, h, d);
        return oblique.mul(ortho);
    }
}

export { Mat4 }