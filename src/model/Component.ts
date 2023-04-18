import {Vec4} from "./Vec4";
import {Mat4} from "./Mat4";
import {MathUtil} from "../util/MathUtil";
import {Vec2} from "./Vec2";

class Component {
    static idCounter: number = 0;
    public id: number = Component.idCounter++;
    public animationMatrix?: Mat4[]
    public static currentFrame: number = 0;
    public name: string;
    public children?: Component[];
    public positionArray: Vec4[];
    public texCoordArray: Vec2[];
    public translation: Vec4 = new Vec4([0, 0, 0, 0]);
    public rotationRad: Vec4 = new Vec4([0, 0, 0, 0]);
    public scale: Vec4 = new Vec4([1, 1, 1, 1]);

    constructor(name: string, positionArray: Vec4[], texCoordArray: Vec2[]) {
        this.name = name;
        this.children = undefined;
        this.positionArray = positionArray;
        this.texCoordArray = texCoordArray;
    }
    public get worldMatrix(): Mat4 {
        // console.log("relcenter"); console.log(this.relativeCenter);
        // console.log("translation"); console.log(this.translation);
        // console.log("rotation"); console.log(this.rotationRad);
        // console.log("scale"); console.log(this.scale);
        let toCenterMatrix = Mat4.translation(this.relativeCenter.x, this.relativeCenter.y, this.relativeCenter.z);
        let translationMatrix = Mat4.translation(this.translation.x, this.translation.y, this.translation.z);
        let rotationMatrix = Mat4.rotation_y(this.rotationRad.y).mul(Mat4.rotation_x(this.rotationRad.x)).mul(Mat4.rotation_z(this.rotationRad.z));
        let scaleMatrix = Mat4.scale(this.scale.x, this.scale.y, this.scale.z);
        let toOriginMatrix = Mat4.translation(-this.relativeCenter.x, -this.relativeCenter.y, -this.relativeCenter.z);
        if (this.animationMatrix !== undefined && Component.currentFrame < this.animationMatrix.length) {
            return toCenterMatrix.mul(this.animationMatrix[Component.currentFrame]).mul(translationMatrix).mul(rotationMatrix).mul(scaleMatrix).mul(toOriginMatrix);
        }
        return toCenterMatrix.mul(translationMatrix).mul(rotationMatrix).mul(scaleMatrix).mul(toOriginMatrix);
    }
    public resetTransformation() {
        this.translation = new Vec4([0, 0, 0, 0]);
        this.rotationRad = new Vec4([0, 0, 0, 0]);
        this.scale = new Vec4([1, 1, 1, 1]);
    }
    public get relativeCenter(): Vec4 {
        return MathUtil.centerOfVertices(this.positionArray);
    }
    public searchComponentById(id: number): Component | undefined {
        if (this.id === id) {
            return this;
        }
        if (this.isThereAChild()) {
            for (let i = 0; i < this.children!.length; i++) {
                let result = this.children![i].searchComponentById(id);
                if (result !== undefined) {
                    return result;
                }
            }
        }
        return undefined;
    }
    public searchComponentByName(name: string): Component | undefined {
        if (this.name === name) {
            return this;
        }
        if (this.isThereAChild()) {
            for (let i = 0; i < this.children!.length; i++) {
                let result = this.children![i].searchComponentByName(name);
                if (result !== undefined) {
                    return result;
                }
            }
        }
        return undefined;
    }

    public get center(): Vec4 {
        // console.log("WorldMatrix")
        // console.log(this.worldMatrix)
        // console.log("RelativeCenter")
        // console.log(this.relativeCenter)
        // console.log("Center")
        // console.log(this.worldMatrix.mul_vec4(this.relativeCenter))
        return this.worldMatrix.mul_vec4(this.relativeCenter);
    }
    public addChild(child: Component) {
        if (this.children === undefined) {
            this.children = [];
        }
        this.children.push(child);
    }
    public isThereAChild() : boolean {
        return this.children !== undefined && this.children.length > 0;
    }
    static _vec4ArrayLoad(json: any): Vec4[] {
        const v4 = [];
        for (let i = 0; i < json.length; i++) {
            v4.push(Vec4.loadFromJson(json[i]));
        }
        return v4;
    }
    static _vec2ArrayLoad(json: any): Vec2[] {
        const v2 = [];
        for (let i = 0; i < json.length; i++) {
            v2.push(Vec2.loadFromJson(json[i]));
        }
        return v2;
    }
    static loadfromJSON(json: any): Component {
        let component = new Component(json.name,
            Component._vec4ArrayLoad(json.positionArray),
            Component._vec2ArrayLoad(json.texCoordArray)
            );
        component.translation = Vec4.loadFromJson(json.translation);
        component.rotationRad = Vec4.loadFromJson(json.rotationRad);
        component.scale = Vec4.loadFromJson(json.scale);
        if (json.children !== undefined) {
            component.children = [];
            for (let i = 0; i < json.children.length; i++) {
                component.children.push(Component.loadfromJSON(json.children[i]));
            }
        }
        return component;
    }
}

class ComponentSaver {
    public name: string;
    public topLevelComponents: Component[];
    public totalAnimationFrames: number = 0;
    public texturePath: string;
    public animationMatrixPath: string = ""
    public constructor(name: string, texturePath: string, totalAnimationFrames: number = 0) {
        this.name = name;
        this.topLevelComponents = [];
        this.texturePath = texturePath;
        this.totalAnimationFrames = totalAnimationFrames;
    }
    public isAnimation(): boolean {
        return this.totalAnimationFrames > 0;
    }
    public addComponent(component: Component) {
        this.topLevelComponents.push(component);
    }
    static loadfromJSON(json: any): ComponentSaver {
        let componentSaver = new ComponentSaver(json.name, json.texturePath, json.totalAnimationFrames);
        componentSaver.animationMatrixPath = json.animationMatrixPath;
        for (let i = 0; i < json.topLevelComponents.length; i++) {
            componentSaver.topLevelComponents.push(Component.loadfromJSON(json.topLevelComponents[i]));
        }
        return componentSaver;
    }
}
export { Component, ComponentSaver };