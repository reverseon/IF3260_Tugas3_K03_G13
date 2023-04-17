import {Vec4} from "./Vec4";
import {Mat4} from "./Mat4";
import {MathUtil} from "../util/MathUtil";

class Component {
    public name: string;
    public isRoot: boolean;
    public parent: Component | null;
    public children?: Component[];
    public positionArray: Vec4[];
    public colorArray: Vec4[];
    public translation: Vec4 = new Vec4([0, 0, 0, 0]);
    public rotationRad: Vec4 = new Vec4([0, 0, 0, 0]);
    public scale: Vec4 = new Vec4([1, 1, 1, 1]);

    constructor(name: string, positionArray: Vec4[], colorArray: Vec4[], parent?: Component, worldMatrix?: Mat4) {
        this.name = name;
        this.isRoot = parent === undefined;
        this.parent = parent === undefined ? null : parent;
        this.children = [];
        this.colorArray = colorArray;
        this.positionArray = positionArray;
    }
    public get worldMatrix(): Mat4 {
        let translationMatrix = Mat4.translation(this.translation.x, this.translation.y, this.translation.z);
        let rotationMatrix = Mat4.rotation_y(this.rotationRad.y).mul(Mat4.rotation_x(this.rotationRad.x)).mul(Mat4.rotation_z(this.rotationRad.z));
        let scaleMatrix = Mat4.scale(this.scale.x, this.scale.y, this.scale.z);
        return translationMatrix.mul(rotationMatrix).mul(scaleMatrix)
    }
    public reset() {
        this.translation = new Vec4([0, 0, 0, 0]);
        this.rotationRad = new Vec4([0, 0, 0, 0]);
        this.scale = new Vec4([1, 1, 1, 1]);
    }
    public get center(): Vec4 {
        return MathUtil.centerOfVertices(MathUtil.multiplyMat4byVec4Array(this.worldMatrix, this.positionArray));
    }
}

class ComponentRoot extends Component {
    constructor(name: string, positionArray: Vec4[], colorArray: Vec4[]) {
        super(name, positionArray, colorArray);
    }
}

export { Component, ComponentRoot };