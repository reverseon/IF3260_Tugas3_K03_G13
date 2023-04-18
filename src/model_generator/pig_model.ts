import {Component, ComponentSaver} from "../model/Component";
import {Vec4} from "../model/Vec4";
import {Vec2} from "../model/Vec2";
import Tex from '../../shape/texture/tex_placeholder.jpg';
import {Mat4} from "../model/Mat4";
import {MathUtil} from "../util/MathUtil";

let toSave = new ComponentSaver("Pig", Tex);

const pigBasePosition: Vec4[] =[
    //body
    new Vec4([150, -100, 200, 1]),
    new Vec4([150, 100, 200, 1]),
    new Vec4([-150, 100, 200, 1]),
    new Vec4([-150, -100, 200, 1]),
    new Vec4([150, -100, -200, 1]),
    new Vec4([150, 100, -200, 1]),
    new Vec4([-150, 100, -200, 1]),
    new Vec4([-150, -100, -200, 1]),

    //head
    new Vec4([100, -50, 350, 1]),
    new Vec4([100, 150, 350, 1]),
    new Vec4([-100, 150, 350, 1]),
    new Vec4([-100, -50, 350, 1]),
    new Vec4([100, -50, 200, 1]),
    new Vec4([100, 150, 200, 1]),
    new Vec4([-100, 150, 200, 1]),
    new Vec4([-100, -50, 200, 1]),

    //front-right-leg
    new Vec4([130, -200, 150, 1]),
    new Vec4([130, -100, 150, 1]),
    new Vec4([30, -100, 150, 1]),
    new Vec4([30, -200, 150, 1]),
    new Vec4([130, -200,50, 1]),
    new Vec4([130, -100, 50, 1]),
    new Vec4([30, -100, 50, 1]),
    new Vec4([30, -200, 50, 1]),

    //front-left-leg
    new Vec4([-30, -200, 150, 1]),
    new Vec4([-30, -100, 150, 1]),
    new Vec4([-130, -100, 150, 1]),
    new Vec4([-130, -200, 150, 1]),
    new Vec4([-30, -200, 50, 1]),
    new Vec4([-30, -100, 50, 1]),
    new Vec4([-130, -100, 50, 1]),
    new Vec4([-130, -200,50, 1]),

    //back-right-leg
    new Vec4([130, -200,-50, 1]),
    new Vec4([130, -100, -50, 1]),
    new Vec4([30, -100, -50, 1]),
    new Vec4([30, -200, -50, 1]),
    new Vec4([130, -200, -150, 1]),
    new Vec4([130, -100, -150, 1]),
    new Vec4([30, -100, -150, 1]),
    new Vec4([30, -200, -150, 1]),

    //back-left-leg
    new Vec4([-30, -200, -50, 1]),
    new Vec4([-30, -100, -50, 1]),
    new Vec4([-130, -100, -50, 1]),
    new Vec4([-130, -200,-50, 1]),
    new Vec4([-30, -200, -150, 1]),
    new Vec4([-30, -100, -150, 1]),
    new Vec4([-130, -100, -150, 1]),
    new Vec4([-130, -200, -150, 1]),
]

const bodyPosition: Vec4[] = [
    ...[pigBasePosition[0], pigBasePosition[1], pigBasePosition[2]],
    ...[pigBasePosition[0], pigBasePosition[2], pigBasePosition[3]],
    // right
    ...[pigBasePosition[0], pigBasePosition[4], pigBasePosition[5]],
    ...[pigBasePosition[0], pigBasePosition[5], pigBasePosition[1]],
    // back
    ...[pigBasePosition[4], pigBasePosition[7], pigBasePosition[6]],
    ...[pigBasePosition[4], pigBasePosition[6], pigBasePosition[5]],
    // left
    ...[pigBasePosition[7], pigBasePosition[3], pigBasePosition[2]],
    ...[pigBasePosition[7], pigBasePosition[2], pigBasePosition[6]],
    // top
    ...[pigBasePosition[1], pigBasePosition[5], pigBasePosition[6]],
    ...[pigBasePosition[1], pigBasePosition[6], pigBasePosition[2]],
    // bottom
    ...[pigBasePosition[4], pigBasePosition[0], pigBasePosition[3]],
    ...[pigBasePosition[4], pigBasePosition[3], pigBasePosition[7]],
]

const headPosition: Vec4[] = [
    // front-head
    ...[pigBasePosition[8], pigBasePosition[9], pigBasePosition[10]],
    ...[pigBasePosition[8], pigBasePosition[10], pigBasePosition[11]],
     // right-head
     ...[pigBasePosition[8], pigBasePosition[12], pigBasePosition[13]],
     ...[pigBasePosition[8], pigBasePosition[13], pigBasePosition[9]],
     // back-head
    ...[pigBasePosition[12], pigBasePosition[15], pigBasePosition[14]],
    ...[pigBasePosition[12], pigBasePosition[14], pigBasePosition[13]],
    // left-head
    ...[pigBasePosition[15], pigBasePosition[11], pigBasePosition[10]],
    ...[pigBasePosition[15], pigBasePosition[10], pigBasePosition[14]],
    // top-head
    ...[pigBasePosition[9], pigBasePosition[13], pigBasePosition[14]],
    ...[pigBasePosition[9], pigBasePosition[14], pigBasePosition[10]],
    // bottom-head
    ...[pigBasePosition[12], pigBasePosition[8], pigBasePosition[11]],
    ...[pigBasePosition[12], pigBasePosition[11], pigBasePosition[15]],
]


const frontRightLegPosition: Vec4[] = [
     // front-right-leg
     ...[pigBasePosition[16], pigBasePosition[17], pigBasePosition[18]],
     ...[pigBasePosition[16], pigBasePosition[18], pigBasePosition[19]],
     // right
    ...[pigBasePosition[16], pigBasePosition[20], pigBasePosition[21]],
    ...[pigBasePosition[16], pigBasePosition[21], pigBasePosition[17]],
    // back
    ...[pigBasePosition[20], pigBasePosition[23], pigBasePosition[22]],
    ...[pigBasePosition[20], pigBasePosition[22], pigBasePosition[21]],
    // left
    ...[pigBasePosition[23], pigBasePosition[19], pigBasePosition[18]],
    ...[pigBasePosition[23], pigBasePosition[18], pigBasePosition[22]],
    // top
    ...[pigBasePosition[17], pigBasePosition[21], pigBasePosition[22]],
    ...[pigBasePosition[17], pigBasePosition[22], pigBasePosition[18]],
    // bottom
    ...[pigBasePosition[20], pigBasePosition[16], pigBasePosition[19]],
    ...[pigBasePosition[20], pigBasePosition[19], pigBasePosition[23]],
]

const frontLeftLegPosition: Vec4[] = [
    // front-left-leg
     ...[pigBasePosition[24], pigBasePosition[25], pigBasePosition[26]],
     ...[pigBasePosition[24], pigBasePosition[26], pigBasePosition[27]],
     // right
    ...[pigBasePosition[24], pigBasePosition[28], pigBasePosition[29]],
    ...[pigBasePosition[24], pigBasePosition[29], pigBasePosition[25]],
    // back
    ...[pigBasePosition[28], pigBasePosition[31], pigBasePosition[30]],
    ...[pigBasePosition[28], pigBasePosition[30], pigBasePosition[29]],
    // left
    ...[pigBasePosition[31], pigBasePosition[27], pigBasePosition[26]],
    ...[pigBasePosition[31], pigBasePosition[26], pigBasePosition[30]],
    // top
    ...[pigBasePosition[25], pigBasePosition[29], pigBasePosition[30]],
    ...[pigBasePosition[25], pigBasePosition[30], pigBasePosition[26]],
    // bottom
    ...[pigBasePosition[28], pigBasePosition[24], pigBasePosition[27]],
    ...[pigBasePosition[28], pigBasePosition[27], pigBasePosition[31]],
]

const backRightLegPosition: Vec4[] = [
    // back-right-leg
     ...[pigBasePosition[32], pigBasePosition[33], pigBasePosition[34]],
     ...[pigBasePosition[32], pigBasePosition[34], pigBasePosition[35]],
     // right
    ...[pigBasePosition[32], pigBasePosition[36], pigBasePosition[37]],
    ...[pigBasePosition[32], pigBasePosition[37], pigBasePosition[33]],
    // back
    ...[pigBasePosition[36], pigBasePosition[39], pigBasePosition[38]],
    ...[pigBasePosition[36], pigBasePosition[38], pigBasePosition[37]],
    // left
    ...[pigBasePosition[39], pigBasePosition[35], pigBasePosition[34]],
    ...[pigBasePosition[39], pigBasePosition[34], pigBasePosition[38]],
    // top
    ...[pigBasePosition[33], pigBasePosition[37], pigBasePosition[38]],
    ...[pigBasePosition[33], pigBasePosition[38], pigBasePosition[34]],
    // bottom
    ...[pigBasePosition[36], pigBasePosition[32], pigBasePosition[35]],
    ...[pigBasePosition[36], pigBasePosition[35], pigBasePosition[39]],
]

const backLeftLegPosition: Vec4[] = [
    // back-left-leg
    ...[pigBasePosition[40], pigBasePosition[41], pigBasePosition[42]],
    ...[pigBasePosition[40], pigBasePosition[42], pigBasePosition[43]],
    // right
   ...[pigBasePosition[40], pigBasePosition[44], pigBasePosition[45]],
   ...[pigBasePosition[40], pigBasePosition[45], pigBasePosition[41]],
   // back
   ...[pigBasePosition[44], pigBasePosition[47], pigBasePosition[46]],
   ...[pigBasePosition[44], pigBasePosition[46], pigBasePosition[45]],
   // left
   ...[pigBasePosition[47], pigBasePosition[43], pigBasePosition[42]],
   ...[pigBasePosition[47], pigBasePosition[42], pigBasePosition[46]],
   // top
   ...[pigBasePosition[41], pigBasePosition[45], pigBasePosition[46]],
   ...[pigBasePosition[41], pigBasePosition[46], pigBasePosition[42]],
   // bottom
   ...[pigBasePosition[44], pigBasePosition[40], pigBasePosition[43]],
   ...[pigBasePosition[44], pigBasePosition[43], pigBasePosition[47]],
]

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

const Body = new Component("Body",bodyPosition,texCoords);
const Head = new Component("Head",headPosition,texCoords);
const FRLeg = new Component("Front Right Leg",frontRightLegPosition,texCoords);
const FLLeg = new Component("Front Left Leg",frontLeftLegPosition,texCoords);
const BRLeg = new Component("Back Right Leg",backRightLegPosition,texCoords);
const BLLeg = new Component("Back Left Leg",backLeftLegPosition,texCoords);

Body.addChild(Head)
Body.addChild(FRLeg)
Body.addChild(FLLeg)
Body.addChild(BRLeg)
Body.addChild(BLLeg)

toSave.addComponent(Body)

const downloadPigModel = () => {
    // make a link to download the file
    const link = document.createElement('a');
    link.download = 'pig.json';
    link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(toSave));
    link.click();
}
export {downloadPigModel};