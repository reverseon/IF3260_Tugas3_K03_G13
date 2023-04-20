import {Component, ComponentSaver} from "../model/Component";
import {Vec4} from "../model/Vec4";
import {Vec2} from "../model/Vec2";
import { Vec3 } from "../model/Vec3";
import Tex from '../../shape/texture/pig.png';
import {Mat4} from "../model/Mat4";
import {MathUtil} from "../util/MathUtil";


export default function pigGenerator(): ComponentSaver {
    const pig = new ComponentSaver("Pig", Tex);
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

    const texwidth = 64
    const texheight = 32
    const headFrontTextures: Vec2[] = [
        //top-right
        new Vec2([15/texwidth,8/texheight]),
        //top-left
        new Vec2([8/texwidth,8/texheight]),
        //bottom-left
        new Vec2([8/texwidth,15/texheight]),
        //bottom-right
        new Vec2([15/texwidth,15/texheight])
    ]

    const headRightTex: Vec2[] = [
       new Vec2([23/texwidth,8/texheight]),
       new Vec2([16/texwidth,8/texheight]),
       new Vec2([16/texwidth,15/texheight]),
       new Vec2([23/texwidth,15/texheight]),
    ]

    const headLefttTex: Vec2[] = [
        new Vec2([7/texwidth,8/texheight]),
        new Vec2([0/texwidth,8/texheight]),
        new Vec2([0/texwidth,15/texheight]),
        new Vec2([7/texwidth,15/texheight])
    ]

    const headTopTex: Vec2[] = [
        new Vec2([15/texwidth,0/texheight]),
        new Vec2([8/texwidth,0/texheight]),
        new Vec2([8/texwidth,7/texheight]),
        new Vec2([15/texwidth,7/texheight])
    ]

    const headBottomTex: Vec2[] = [
        new Vec2([23/texwidth,0/texheight]),
        new Vec2([16/texwidth,0/texheight]),
        new Vec2([16/texwidth,7/texheight]),
        new Vec2([23/texwidth,7/texheight])
    ]

    const headBackTex: Vec2[] = [
        new Vec2([31/texwidth,8/texheight]),
        new Vec2([24/texwidth,8/texheight]),
        new Vec2([24/texwidth,15/texheight]),
        new Vec2([31/texwidth,15/texheight])
    ]



    const headTextCords = [
        //front
        headFrontTextures[0], headFrontTextures[1],headFrontTextures[2],
        headFrontTextures[0],headFrontTextures[2],headFrontTextures[3],
        //back
        headBackTex[0],headBackTex[1],headBackTex[2],
        headBackTex[0],headBackTex[2],headBackTex[3],
        //left
        headLefttTex[0],headLefttTex[1],headLefttTex[2],
        headLefttTex[0],headLefttTex[2],headLefttTex[3],
        //right
        headRightTex[0],headRightTex[1],headRightTex[2],
        headRightTex[0],headRightTex[2],headRightTex[3],
        //top
        headTopTex[0],headTopTex[1],headTopTex[2],
        headTopTex[0],headTopTex[2],headTopTex[3],
        //bottom
        headBottomTex[0],headBottomTex[1],headBottomTex[2],
        headBottomTex[0],headBottomTex[2],headBottomTex[3],
        
    ]

    const bodyLeftTex = [
        new Vec2([35/texwidth,16/texheight]),
        new Vec2([28/texwidth,16/texheight]),
        new Vec2([28/texwidth,31/texheight]),
        new Vec2([35/texwidth,31/texheight])
    ]

    const bodyRightTex = [
        new Vec2([53/texwidth,16/texheight]),
        new Vec2([46/texwidth,16/texheight]),
        new Vec2([46/texwidth,31/texheight]),
        new Vec2([53/texwidth,31/texheight])
    ]

    const bodyTopTex = [
        new Vec2([63/texwidth,16/texheight]),
        new Vec2([54/texwidth,16/texheight]),
        new Vec2([54/texwidth,31/texheight]),
        new Vec2([63/texwidth,31/texheight])
    ]


    const bodyBotTex = [
        new Vec2([45/texwidth,16/texheight]),
        new Vec2([36/texwidth,16/texheight]),
        new Vec2([36/texwidth,31/texheight]),
        new Vec2([45/texwidth,31/texheight])
    ]

    const bodyFrontTex = [
        new Vec2([45/texwidth,8/texheight]),
        new Vec2([36/texwidth,8/texheight]),
        new Vec2([36/texwidth,15/texheight]),
        new Vec2([45/texwidth,15/texheight])
    ]

    const bodyBackTex = [
        new Vec2([55/texwidth,8/texheight]),
        new Vec2([46/texwidth,8/texheight]),
        new Vec2([46/texwidth,15/texheight]),
        new Vec2([55/texwidth,15/texheight]),
    ]

    const bodyTextures = [
        //front
        bodyFrontTex[0],bodyFrontTex[2],bodyFrontTex[2],
        bodyFrontTex[0],bodyFrontTex[2],bodyFrontTex[3],
        //right
        bodyRightTex[0],bodyRightTex[1],bodyRightTex[2],
        bodyRightTex[0],bodyRightTex[2],bodyRightTex[3],
        //back
        bodyBackTex[0],bodyBackTex[1],bodyBackTex[2],
        bodyBackTex[0],bodyBackTex[2],bodyBackTex[3],
        
        //left
        bodyLeftTex[0],bodyLeftTex[1],bodyLeftTex[2],
        bodyLeftTex[0],bodyLeftTex[2],bodyLeftTex[3],
        
        //top
        bodyTopTex[0],bodyTopTex[1],bodyTopTex[2],
        bodyTopTex[0],bodyTopTex[2],bodyTopTex[3],
        //bottom
        bodyBotTex[0],bodyBotTex[1],bodyBotTex[2],
        bodyBotTex[0],bodyBotTex[2],bodyBotTex[3],

    ]

    const frontLegTex = [
        new Vec2([7/texwidth,20/texheight]),
        new Vec2([4/texwidth,20/texheight]),
        new Vec2([4/texwidth,25/texheight]),
        new Vec2([7/texwidth,25/texheight])

    ]

    const leftLegtext = [
        new Vec2([3/texwidth,20/texheight]),
        new Vec2([0/texwidth,20/texheight]),
        new Vec2([0/texwidth,25/texheight]),
        new Vec2([3/texwidth,25/texheight])
    ]

    const rightLegText = [
        new Vec2([11/texwidth,20/texheight]),
        new Vec2([8/texwidth,20/texheight]),
        new Vec2([8/texwidth,25/texheight]),
        new Vec2([11/texwidth,25/texheight])
    ]

    const backLegText = [
        new Vec2([15/texwidth,20/texheight]),
        new Vec2([12/texwidth,20/texheight]),
        new Vec2([12/texwidth,25/texheight]),
        new Vec2([15/texwidth,25/texheight])
    ]

    const bottomLegText = [
        new Vec2([8/texwidth,16/texheight]),
        new Vec2([11/texwidth,16/texheight]),
        new Vec2([11/texwidth,19/texheight]),
        new Vec2([8/texwidth,19/texheight])
    ]

    const topLegText = [
        new Vec2([4/texwidth,16/texheight]),
        new Vec2([7/texwidth,16/texheight]),
        new Vec2([7/texwidth,19/texheight]),
        new Vec2([4/texwidth,19/texheight])
    ]


    const legTextures = [
        //front
        frontLegTex[0],frontLegTex[1],frontLegTex[2],
        frontLegTex[0],frontLegTex[2],frontLegTex[3],
        //right
        rightLegText[0],rightLegText[1],rightLegText[2],
        rightLegText[0],rightLegText[2],rightLegText[3],
        //back
        backLegText[0],backLegText[1],backLegText[2],
        backLegText[0],backLegText[2],backLegText[3],
        //left
        leftLegtext[0],leftLegtext[1],leftLegtext[2],
        leftLegtext[0],leftLegtext[2],leftLegtext[3],
        //top
        topLegText[0],topLegText[1],topLegText[2],
        topLegText[0],topLegText[2],topLegText[3],
        //bottom

        bottomLegText[0],bottomLegText[1],bottomLegText[2],
        bottomLegText[0],bottomLegText[2],bottomLegText[3],
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
    
    const Body = new Component("Body",bodyPosition,bodyTextures);
    const Head = new Component("Head",headPosition,headTextCords);
    const FRLeg = new Component("Front Right Leg",frontRightLegPosition,legTextures);
    const FLLeg = new Component("Front Left Leg",frontLeftLegPosition,legTextures);
    const BRLeg = new Component("Back Right Leg",backRightLegPosition,legTextures);
    const BLLeg = new Component("Back Left Leg",backLeftLegPosition,legTextures);
    
    // ANIMATION GENERATION //
    const animArray: Mat4[] = [];
    const TOTALFRAMES = 60;
    
    pig.totalAnimationFrames = TOTALFRAMES;
    
    // HEAD //
    for (let i = 0; i < TOTALFRAMES; i++) {
        animArray.push(Mat4.rotation_y(
            MathUtil.lerpf(0, Math.PI * 1, i / (TOTALFRAMES*2))
        ));
    }
    
    // LEGS //
    const frontLeftLegAnimArray: Mat4[] = [];
    let frontLeftRotationCenter = new Vec3([0.14, -0.5, 0.14]);
    frontLeftRotationCenter = frontLeftRotationCenter.multiply_scalar(300);
    // console.log("FLRC", frontLeftRotationCenter)
    const MP8 = Math.PI / 8;
    for (let i = 0; i < TOTALFRAMES/4; i++) {
        const rotationToFront = MathUtil.lerpf(0, -MP8, 4 * i / TOTALFRAMES);
        const mat = Mat4.translation(-frontLeftRotationCenter.x, -frontLeftRotationCenter.y, -frontLeftRotationCenter.z)
            .mul(Mat4.rotation_x(rotationToFront))
            .mul(Mat4.translation(frontLeftRotationCenter.x, frontLeftRotationCenter.y, frontLeftRotationCenter.z));
        frontLeftLegAnimArray.push(mat);
    }
    for (let i = 0; i < TOTALFRAMES/2; i++) {
        const rotationToBack = MathUtil.lerpf(-MP8, MP8, 2 * i / TOTALFRAMES);
        const mat = Mat4.translation(-frontLeftRotationCenter.x, -frontLeftRotationCenter.y, -frontLeftRotationCenter.z)
            .mul(Mat4.rotation_x(rotationToBack))
            .mul(Mat4.translation(frontLeftRotationCenter.x, frontLeftRotationCenter.y, frontLeftRotationCenter.z));
        frontLeftLegAnimArray.push(mat);
    }
    for (let i = 0; i < TOTALFRAMES/4; i++) {
        const rotationToFront = MathUtil.lerpf(MP8, 0, 4 * i / TOTALFRAMES);
        const mat = Mat4.translation(-frontLeftRotationCenter.x, -frontLeftRotationCenter.y, -frontLeftRotationCenter.z)
            .mul(Mat4.rotation_x(rotationToFront))
            .mul(Mat4.translation(frontLeftRotationCenter.x, frontLeftRotationCenter.y, frontLeftRotationCenter.z));
        frontLeftLegAnimArray.push(mat);
    }

    let frontRightRotationCenter = new Vec3([-0.14, -0.5, 0.14]);
    frontRightRotationCenter = frontRightRotationCenter.multiply_scalar(300);
    const frontRightLegAnimArray: Mat4[] = [];
    for (let i = 0; i < TOTALFRAMES/4; i++) {
        const rotationToFront = MathUtil.lerpf(0, MP8, 4 * i / TOTALFRAMES);
        const mat = Mat4.translation(-frontRightRotationCenter.x, -frontRightRotationCenter.y, -frontRightRotationCenter.z)
            .mul(Mat4.rotation_x(rotationToFront))
            .mul(Mat4.translation(frontRightRotationCenter.x, frontRightRotationCenter.y, frontRightRotationCenter.z));
        frontRightLegAnimArray.push(mat);
    }
    for (let i = 0; i < TOTALFRAMES/2; i++) {
        const rotationToBack = MathUtil.lerpf(MP8, -MP8, 2 * i / TOTALFRAMES);
        const mat = Mat4.translation(-frontRightRotationCenter.x, -frontRightRotationCenter.y, -frontRightRotationCenter.z)
            .mul(Mat4.rotation_x(rotationToBack))
            .mul(Mat4.translation(frontRightRotationCenter.x, frontRightRotationCenter.y, frontRightRotationCenter.z));
        frontRightLegAnimArray.push(mat);
    }
    for (let i = 0; i < TOTALFRAMES/4; i++) {
        const rotationToFront = MathUtil.lerpf(-MP8, 0, 4 * i / TOTALFRAMES);
        const mat = Mat4.translation(-frontRightRotationCenter.x, -frontRightRotationCenter.y, -frontRightRotationCenter.z)
            .mul(Mat4.rotation_x(rotationToFront))
            .mul(Mat4.translation(frontRightRotationCenter.x, frontRightRotationCenter.y, frontRightRotationCenter.z));
        frontRightLegAnimArray.push(mat);
    }
    
    Head.animationMatrix = animArray;
    FRLeg.animationMatrix = frontLeftLegAnimArray;
    BRLeg.animationMatrix = frontLeftLegAnimArray;
    FLLeg.animationMatrix = frontRightLegAnimArray;
    BLLeg.animationMatrix = frontRightLegAnimArray;
    
    Body.addChild(Head)
    Body.addChild(FRLeg)
    Body.addChild(FLLeg)
    Body.addChild(BRLeg)
    Body.addChild(BLLeg)
    
    pig.addComponent(Body)
    return pig;
}

const downloadPigModel = () => {
    const componentSaver = pigGenerator();
    const componentSaverJSON = JSON.stringify(componentSaver);
    const blob = new Blob([componentSaverJSON], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = "pig.json";
    link.href = url;
    link.click()
}
export {downloadPigModel, pigGenerator};