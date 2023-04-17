import {Vec4} from "./Vec4";
import {Mat4} from "./Mat4";
import {Vec3} from "./Vec3";

enum CameraMode {
    Perspective,
    Orthographic,
    Oblique
}

class CameraSettings {
    // ...
    public mode: CameraMode = CameraMode.Perspective;
    public rotationRad: Vec4 = new Vec4([0, 0, 0, 0]);
    public translation: Vec4 = new Vec4([0, 0, 0, 0]);
    public scale: Vec4 = new Vec4([1, 1, 1, 1]);
    public shading: boolean = true;
    public light: Vec4 = new Vec4([0.5, 0.7, 1, 0]);
    public fov: number = 45;
    public aspect: number = 1;
    public near: number = 1;
    public far: number = 2000;
    public width: number = 1;
    public height: number = 1;
    public depth: number = 1;
    public theta: number = 0;
    public phi: number = 0;
    public centeredAt: Vec4 = new Vec4([0, 0, 0, 0]);

    getViewMatrix(): Mat4 {
        // invert z axis
        // let invertz = Mat4.scale(1, 1, -1);
        let translationMatrix = Mat4.translation(this.translation.x, this.translation.y, this.translation.z);
        let rotationMatrix = Mat4.rotation_y(this.rotationRad.y)
        // let scaleMatrix = Mat4.scale(this.scale.x, this.scale.y, this.scale.z);
        // console.log("scaleMatrix", scaleMatrix)
        let viewMatrix = rotationMatrix.mul(translationMatrix)
        console.log("viewMatrix")
        viewMatrix.print()
        console.log("rotationRad", this.rotationRad.y)
        console.log("rotationMatrix")
        rotationMatrix.print()
        console.log("translationMatrix")
        translationMatrix.print()
        const lookAtMatrix = Mat4.look_at(
            new Vec3([
                viewMatrix.memory[12],
                viewMatrix.memory[13],
                viewMatrix.memory[14],
            ]),
            this.centeredAt.xyz,
            Vec3.up()
        )
        console.log("centeredAt", this.centeredAt.xyz)
        return lookAtMatrix.inverse()
    }
    getProjectionMatrix(): Mat4 {
        switch (this.mode) {
            case CameraMode.Perspective:
                return Mat4.perspective(this.fov, this.aspect, this.near, this.far);
            case CameraMode.Orthographic:
                return Mat4.orthographic(this.width, this.height, this.depth);
            case CameraMode.Oblique:
                return Mat4.oblique(this.theta, this.phi, this.width, this.height, this.depth);
        }
    }
    setPerspectiveMode(fov: number, aspect: number, near: number, far: number, scale: Vec4, centeredAt: Vec4, camPos: Vec4) {
        this.mode = CameraMode.Perspective;
        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;
        this.centeredAt = centeredAt;
        this.translation = camPos;
        this.scale = scale;
    }

    setOrthographicMode(width: number, height: number, depth: number, scale: Vec4, centeredAt: Vec4, camPos: Vec4) {
        this.mode = CameraMode.Orthographic;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.centeredAt = centeredAt;
        this.translation = camPos;
        this.scale = scale;
    }

    setObliqueMode(theta: number, phi: number, width: number, height: number, depth: number, scale: Vec4, centeredAt: Vec4, camPos: Vec4) {
        this.mode = CameraMode.Oblique;
        this.theta = theta;
        this.phi = phi;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.centeredAt = centeredAt;
        this.translation = camPos;
        this.scale = scale;
    }
}

export {CameraSettings, CameraMode};