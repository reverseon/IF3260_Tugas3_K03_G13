import {Vec4} from "../model/Vec4";
import {Vec3} from "../model/Vec3";
import {Mat4} from "../model/Mat4";
import {Vec2} from "../model/Vec2";

abstract class MathUtil {
    public static normalOfTriangle = (a: Vec3, b: Vec3, c: Vec3): Vec3 => {
        const ab = b.subtract(a);
        const ac = c.subtract(a);
        return ab.cross(ac).normalize();
    }
    public static centerOfVertices = (vertices: Vec4[]): Vec4 => {
        let center = Vec4.zero();
        for (let i = 0; i < vertices.length; i++) {
            center = center.add(vertices[i]);
        }
        return center.multiply_scalar(1 / vertices.length);
    }
    public static makeFloat32ArrayFromVec4Array = (array: Vec4[]): Float32Array => {
        const result = new Float32Array(array.length * 4);
        for (let i = 0; i < array.length; i++) {
            const vec = array[i];
            result[i * 4] = vec.x;
            result[i * 4 + 1] = vec.y;
            result[i * 4 + 2] = vec.z;
            result[i * 4 + 3] = vec.w;
        }
        return result;
    }
    public static makeFloat32ArrayFromVec3Array = (array: Vec3[]): Float32Array => {
        const result = new Float32Array(array.length * 3);
        for (let i = 0; i < array.length; i++) {
            const vec = array[i];
            result[i * 3] = vec.x;
            result[i * 3 + 1] = vec.y;
            result[i * 3 + 2] = vec.z;
        }
        return result;
    }

    public static makeFloat32ArrayFromVec2Array = (array: Vec2[]): Float32Array => {
        const result = new Float32Array(array.length * 2);
        for (let i = 0; i < array.length; i++) {
            const vec = array[i];
            result[i * 2] = vec.x;
            result[i * 2 + 1] = vec.y;
        }
        return result;
    }

    public static makeNormalArray = (array: Vec4[]): Vec4[] => {
        const result: Vec4[] = [];
        for (let i = 0; i < array.length; i += 3) {
            const v1 = array[i];
            const v2 = array[i + 1];
            const v3 = array[i + 2];
            const normalvec3 = MathUtil.normalOfTriangle(v1.xyz, v2.xyz, v3.xyz)
            const normal = new Vec4([normalvec3.x, normalvec3.y, normalvec3.z, 0]);
            result.push(normal);
            result.push(normal);
            result.push(normal);
        }
        return result;
    }

    public static multiplyMat4byVec4Array = (mat: Mat4, array: Vec4[]): Vec4[] => {
        const result: Vec4[] = [];
        for (let i = 0; i < array.length; i++) {
            result.push(mat.mul_vec4(array[i]));
        }
        return result;
    }
}

export { MathUtil };