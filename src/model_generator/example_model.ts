import {Component, ComponentSaver} from "../model/Component";
import {Vec4} from "../model/Vec4";
import {Vec2} from "../model/Vec2";
import Tex from '../../shape/texture/tex_placeholder.jpg';
import {Mat4} from "../model/Mat4";
import {MathUtil} from "../util/MathUtil";


let toSave = new ComponentSaver("cube", Tex);

const CubeBasicPosition: Vec4[] = [
    new Vec4([100, -100, 100, 1]),
    new Vec4([100, 100, 100, 1]),
    new Vec4([-100, 100, 100, 1]),
    new Vec4([-100, -100, 100, 1]),
    new Vec4([100, -100, -100, 1]),
    new Vec4([100, 100, -100, 1]),
    new Vec4([-100, 100, -100, 1]),
    new Vec4([-100, -100, -100, 1]),
]
const completePosition: Vec4[] = [
    // front
    ...[CubeBasicPosition[0], CubeBasicPosition[1], CubeBasicPosition[2]],
    ...[CubeBasicPosition[0], CubeBasicPosition[2], CubeBasicPosition[3]],
    // right
    ...[CubeBasicPosition[0], CubeBasicPosition[4], CubeBasicPosition[5]],
    ...[CubeBasicPosition[0], CubeBasicPosition[5], CubeBasicPosition[1]],
    // back
    ...[CubeBasicPosition[4], CubeBasicPosition[7], CubeBasicPosition[6]],
    ...[CubeBasicPosition[4], CubeBasicPosition[6], CubeBasicPosition[5]],
    // left
    ...[CubeBasicPosition[7], CubeBasicPosition[3], CubeBasicPosition[2]],
    ...[CubeBasicPosition[7], CubeBasicPosition[2], CubeBasicPosition[6]],
    // top
    ...[CubeBasicPosition[1], CubeBasicPosition[5], CubeBasicPosition[6]],
    ...[CubeBasicPosition[1], CubeBasicPosition[6], CubeBasicPosition[2]],
    // bottom
    ...[CubeBasicPosition[4], CubeBasicPosition[0], CubeBasicPosition[3]],
    ...[CubeBasicPosition[4], CubeBasicPosition[3], CubeBasicPosition[7]],
];
const topleft: Vec2 = new Vec2([0, 0]);
const topright: Vec2 = new Vec2([1, 0]);
const bottomleft: Vec2 = new Vec2([0, 1]);
const bottomright: Vec2 = new Vec2([1, 1]);
const texCoords: Vec2[] = [
    // front
    ...[topleft, topright, bottomright],
    ...[topleft, bottomright, bottomleft],
    // right
    ...[topleft, topright, bottomright],
    ...[topleft, bottomright, bottomleft],
    // back
    ...[topleft, topright, bottomright],
    ...[topleft, bottomright, bottomleft],
    // left
    ...[topleft, topright, bottomright],
    ...[topleft, bottomright, bottomleft],
    // top
    ...[topleft, topright, bottomright],
    ...[topleft, bottomright, bottomleft],
    // bottom
    ...[topleft, topright, bottomright],
    ...[topleft, bottomright, bottomleft],
];

const tsc2 = Mat4.translation(150, 250, 0);
const tsc3 = Mat4.translation(-150, 250, 0);
const tsc4 = Mat4.translation(150, 500, 0);

const myCube = new Component("Parent", completePosition, texCoords);
const cube2 = new Component("Child1",
    MathUtil.multiplyMat4byVec4Array(tsc2, completePosition)
    , texCoords);
const cube3 = new Component("Child3",
    MathUtil.multiplyMat4byVec4Array(tsc3, completePosition)
    , texCoords);
const cube4 = new Component("Child2",
    MathUtil.multiplyMat4byVec4Array(tsc4, completePosition)
    , texCoords);

myCube.addChild(cube2);
myCube.addChild(cube3);
cube2.addChild(cube4);

toSave.addComponent(myCube);

const downloadToSaveJSON = () => {
    // make a link to download the file
    const link = document.createElement('a');
    link.download = 'example_model.json';
    link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(toSave));
    link.click();
}

export {downloadToSaveJSON};