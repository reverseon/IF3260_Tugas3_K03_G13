import {Component, ComponentSaver} from "../model/Component";
import {Vec4} from "../model/Vec4";
import {Vec2} from "../model/Vec2";
import Tex from '../../shape/texture/steve.png';
import {Mat4} from "../model/Mat4";
import {MathUtil} from "../util/MathUtil";

export default function steveGenerator(): ComponentSaver {
    let toSave = new ComponentSaver("steve", Tex);

    const arraytoVec2Array = (array: number[], width: number=1, height: number=1): Vec2[] => {
        const result: Vec2[] = [];
        for (let i = 0; i < array.length; i += 2) {
            result.push(new Vec2(
                [
                    array[i] / width,
                    array[i + 1] / height
                ]
            ));
        }
        return result;
    }

    const BodyBasicPosition: Vec4[] = [
        new Vec4([200, 0, 100, 1]), 
        new Vec4([200, 600, 100, 1]), 
        new Vec4([-200, 600, 100, 1]), 
        new Vec4([-200, 0, 100, 1]), 
        new Vec4([200, 0, -100, 1]), 
        new Vec4([200, 600, -100, 1]),
        new Vec4([-200, 600, -100, 1]),
        new Vec4([-200, 0, -100, 1]), 
    ]

    const FootBasicPosition: Vec4[] = [
        // KAKI
        new Vec4([0, -700, 100, 1]), // V
        new Vec4([0, 0, 100, 1]), // A1
        new Vec4([-200, 0, 100, 1]), // E
        new Vec4([-200, -700, 100, 1]), // T
        new Vec4([0, -700, -100, 1]), // W
        new Vec4([0, 0, -100, 1]), // Z
        new Vec4([-200, 0, -100, 1]), // A
        new Vec4([-200, -700, -100, 1]), //R
    ]

    const ArmBasicPosition: Vec4[] = [
        // KAKI
        new Vec4([-200, -50, 100, 1]), // F1
        new Vec4([-200, 600, 100, 1]), // G
        new Vec4([-400, 600, 100, 1]), // B1
        new Vec4([-400, -50, 100, 1]), // E1
        new Vec4([-200, -50, -100, 1]), // G1
        new Vec4([-200, 600, -100, 1]), // C
        new Vec4([-400, 600, -100, 1]), // C1
        new Vec4([-400, -50, -100, 1]), // D1
    ]

    const HeadBasicPosition: Vec4[] = [
        // KAKI
        new Vec4([200, 600, 200, 1]), // K 0
        new Vec4([200, 1000, 200, 1]), // J 1 
        new Vec4([-200, 1000, 200, 1]), // N 2
        new Vec4([-200, 600, 200, 1]), // O 3
        new Vec4([200, 600, -200, 1]), // M 4
        new Vec4([200, 1000, -200, 1]), // L 5 
        new Vec4([-200, 1000, -200, 1]), // P 6
        new Vec4([-200, 600, -200, 1]), // Q 7
    ]

    const bodyPosition: Vec4[] = [
        // front
        ...[BodyBasicPosition[0], BodyBasicPosition[1], BodyBasicPosition[2]],
        ...[BodyBasicPosition[0], BodyBasicPosition[2], BodyBasicPosition[3]],
        // right
        ...[BodyBasicPosition[0], BodyBasicPosition[4], BodyBasicPosition[5]],
        ...[BodyBasicPosition[0], BodyBasicPosition[5], BodyBasicPosition[1]],
        // back
        ...[BodyBasicPosition[4], BodyBasicPosition[7], BodyBasicPosition[6]],
        ...[BodyBasicPosition[4], BodyBasicPosition[6], BodyBasicPosition[5]],
        // left
        ...[BodyBasicPosition[7], BodyBasicPosition[3], BodyBasicPosition[2]],
        ...[BodyBasicPosition[7], BodyBasicPosition[2], BodyBasicPosition[6]],
        // top
        ...[BodyBasicPosition[1], BodyBasicPosition[5], BodyBasicPosition[6]],
        ...[BodyBasicPosition[1], BodyBasicPosition[6], BodyBasicPosition[2]],
        // bottom
        ...[BodyBasicPosition[4], BodyBasicPosition[0], BodyBasicPosition[3]],
        ...[BodyBasicPosition[4], BodyBasicPosition[3], BodyBasicPosition[7]],
    ];
    const leftFootPosition: Vec4[] = [
        // front
        ...[FootBasicPosition[0], FootBasicPosition[1], FootBasicPosition[2]],
        ...[FootBasicPosition[0], FootBasicPosition[2], FootBasicPosition[3]],
        // right
        ...[FootBasicPosition[0], FootBasicPosition[4], FootBasicPosition[5]],
        ...[FootBasicPosition[0], FootBasicPosition[5], FootBasicPosition[1]],
        // back
        ...[FootBasicPosition[4], FootBasicPosition[7], FootBasicPosition[6]],
        ...[FootBasicPosition[4], FootBasicPosition[6], FootBasicPosition[5]],
        // left
        ...[FootBasicPosition[7], FootBasicPosition[3], FootBasicPosition[2]],
        ...[FootBasicPosition[7], FootBasicPosition[2], FootBasicPosition[6]],
        // top
        ...[FootBasicPosition[1], FootBasicPosition[5], FootBasicPosition[6]],
        ...[FootBasicPosition[1], FootBasicPosition[6], FootBasicPosition[2]],
        // bottom
        ...[FootBasicPosition[4], FootBasicPosition[0], FootBasicPosition[3]],
        ...[FootBasicPosition[4], FootBasicPosition[3], FootBasicPosition[7]],
    ]

    const leftArmPosition: Vec4[] = [
        // front
        ...[ArmBasicPosition[0], ArmBasicPosition[1], ArmBasicPosition[2]],
        ...[ArmBasicPosition[0], ArmBasicPosition[2], ArmBasicPosition[3]],
        // right
        ...[ArmBasicPosition[0], ArmBasicPosition[4], ArmBasicPosition[5]],
        ...[ArmBasicPosition[0], ArmBasicPosition[5], ArmBasicPosition[1]],
        // back
        ...[ArmBasicPosition[4], ArmBasicPosition[7], ArmBasicPosition[6]],
        ...[ArmBasicPosition[4], ArmBasicPosition[6], ArmBasicPosition[5]],
        // left
        ...[ArmBasicPosition[7], ArmBasicPosition[3], ArmBasicPosition[2]],
        ...[ArmBasicPosition[7], ArmBasicPosition[2], ArmBasicPosition[6]],
        // top
        ...[ArmBasicPosition[1], ArmBasicPosition[5], ArmBasicPosition[6]],
        ...[ArmBasicPosition[1], ArmBasicPosition[6], ArmBasicPosition[2]],
        // bottom
        ...[ArmBasicPosition[4], ArmBasicPosition[0], ArmBasicPosition[3]],
        ...[ArmBasicPosition[4], ArmBasicPosition[3], ArmBasicPosition[7]],
    ]

    const headPosition: Vec4[] = [
        // front
        ...[HeadBasicPosition[0], HeadBasicPosition[1], HeadBasicPosition[2]],
        ...[HeadBasicPosition[0], HeadBasicPosition[2], HeadBasicPosition[3]],
        // right
        ...[HeadBasicPosition[0], HeadBasicPosition[4], HeadBasicPosition[5]],
        ...[HeadBasicPosition[0], HeadBasicPosition[5], HeadBasicPosition[1]],
        // back
        ...[HeadBasicPosition[4], HeadBasicPosition[7], HeadBasicPosition[6]],
        ...[HeadBasicPosition[4], HeadBasicPosition[6], HeadBasicPosition[5]],
        // left
        ...[HeadBasicPosition[7], HeadBasicPosition[3], HeadBasicPosition[2]],
        ...[HeadBasicPosition[7], HeadBasicPosition[2], HeadBasicPosition[6]],
        // top
        ...[HeadBasicPosition[1], HeadBasicPosition[5], HeadBasicPosition[6]],
        ...[HeadBasicPosition[1], HeadBasicPosition[6], HeadBasicPosition[2]],
        // bottom
        ...[HeadBasicPosition[4], HeadBasicPosition[0], HeadBasicPosition[3]],
        ...[HeadBasicPosition[4], HeadBasicPosition[3], HeadBasicPosition[7]],
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

    const a_headBaseFrontTexCoords = [
        // top-right
        15, 8,
        // top-left
        8, 8,
        // bottom-left
        8, 15,
        // bottom-right
        16, 15
    ]
    const a_headBaseBackTexCoords = [
        // top-right
        31, 8,
        // top-left
        24, 8,
        // bottom-left
        24, 15,
        // bottom-right
        31, 15
    ]
    const a_headBaseLeftTexCoords = [
        // top-right
        7, 8,
        // top-left
        0, 8,
        // bottom-left
        0, 15,
        // bottom-right
        7, 15
    ]
    const a_headBaseRightTexCoords = [
        // top-right
        23, 8,
        // top-left
        15, 8,
        // bottom-left
        15, 15,
        // bottom-right
        23, 15
    ]
    const a_headBaseTopTexCoords = [
        // top-right
        15, 0,
        // top-left
        8, 0,
        // bottom-left
        8, 7,
        // bottom-right
        15, 7
    ]
    const a_headBaseBottomTexCoords = [
        // top-right
        23, 0,
        // top-left
        16, 0,
        // bottom-left
        16, 7,
        // bottom-right
        23, 7
    ]


    const texwidth = 63;
    const texheight = 63;
    const headBaseFrontTexCoords = arraytoVec2Array(a_headBaseFrontTexCoords, texwidth, texheight);
    const headBaseBackTexCoords = arraytoVec2Array(a_headBaseBackTexCoords, texwidth, texheight);
    const headBaseLeftTexCoords = arraytoVec2Array(a_headBaseLeftTexCoords, texwidth, texheight);
    const headBaseRightTexCoords = arraytoVec2Array(a_headBaseRightTexCoords, texwidth, texheight);
    const headBaseTopTexCoords = arraytoVec2Array(a_headBaseTopTexCoords, texwidth, texheight);
    const headBaseBottomTexCoords = arraytoVec2Array(a_headBaseBottomTexCoords, texwidth, texheight);

    const headTexCoordsComplete = [
        // front
        headBaseFrontTexCoords[3], headBaseFrontTexCoords[0], headBaseFrontTexCoords[1],
        headBaseFrontTexCoords[3], headBaseFrontTexCoords[1], headBaseFrontTexCoords[2],
        // right
        headBaseRightTexCoords[2], headBaseRightTexCoords[3], headBaseRightTexCoords[0],
        headBaseRightTexCoords[2], headBaseRightTexCoords[0], headBaseRightTexCoords[1],
        // back
        headBaseBackTexCoords[2], headBaseBackTexCoords[3], headBaseBackTexCoords[0],
        headBaseBackTexCoords[2], headBaseBackTexCoords[0], headBaseBackTexCoords[1],
        // left
        headBaseLeftTexCoords[2], headBaseLeftTexCoords[3], headBaseLeftTexCoords[0],
        headBaseLeftTexCoords[2], headBaseLeftTexCoords[0], headBaseLeftTexCoords[1],    
        // top
        headBaseTopTexCoords[0], headBaseTopTexCoords[1], headBaseTopTexCoords[2],
        headBaseTopTexCoords[0], headBaseTopTexCoords[2], headBaseTopTexCoords[3],
        // bottom
        headBaseBottomTexCoords[2], headBaseBottomTexCoords[1], headBaseBottomTexCoords[0],
        headBaseBottomTexCoords[2], headBaseBottomTexCoords[0], headBaseBottomTexCoords[3],
    ]

    const a_bodyBaseFrontTexCoords = [
        // top-right
        27, 20,
        // top-left
        20, 20,
        // bottom-left
        20, 31,
        // bottom-right
        27, 31
    ]
    const a_bodyBaseBackTexCoords = [
        // top-right
        39, 20,
        // top-left
        32, 20,
        // bottom-left
        32, 31,
        // bottom-right
        39, 31
    ]
    const a_bodyBaseLeftTexCoords = [
        // top-right
        19, 20,
        // top-left
        16, 20,
        // bottom-left
        16, 31,
        // bottom-right
        19, 31
    ]
    const a_bodyBaseRightTexCoords = [
        // top-right
        31, 20,
        // top-left
        28, 20,
        // bottom-left
        28, 31,
        // bottom-right
        31, 31
    ]
    const a_bodyBaseTopTexCoords = [
        // top-right
        27, 16,
        // top-left
        20, 16,
        // bottom-left
        20, 19,
        // bottom-right
        27, 19
    ]
    const a_bodyBaseBottomTexCoords = [
        // top-right
        35, 16,
        // top-left
        28, 16,
        // bottom-left
        28, 19,
        // bottom-right
        35, 19
    ]

    const bodyBaseFrontTexCoords = arraytoVec2Array(a_bodyBaseFrontTexCoords, texwidth, texheight);
    const bodyBaseBackTexCoords = arraytoVec2Array(a_bodyBaseBackTexCoords, texwidth, texheight);
    const bodyBaseLeftTexCoords = arraytoVec2Array(a_bodyBaseLeftTexCoords, texwidth, texheight);
    const bodyBaseRightTexCoords = arraytoVec2Array(a_bodyBaseRightTexCoords, texwidth, texheight);
    const bodyBaseTopTexCoords = arraytoVec2Array(a_bodyBaseTopTexCoords, texwidth, texheight);
    const bodyBaseBottomTexCoords = arraytoVec2Array(a_bodyBaseBottomTexCoords, texwidth, texheight);

    const bodyTexCoordsComplete = [
        // front
        bodyBaseFrontTexCoords[3], bodyBaseFrontTexCoords[0], bodyBaseFrontTexCoords[1],
        bodyBaseFrontTexCoords[3], bodyBaseFrontTexCoords[1], bodyBaseFrontTexCoords[2],
        // right
        bodyBaseRightTexCoords[2], bodyBaseRightTexCoords[3], bodyBaseRightTexCoords[0],
        bodyBaseRightTexCoords[2], bodyBaseRightTexCoords[0], bodyBaseRightTexCoords[1],
        // back
        bodyBaseBackTexCoords[2], bodyBaseBackTexCoords[3], bodyBaseBackTexCoords[0],
        bodyBaseBackTexCoords[2], bodyBaseBackTexCoords[0], bodyBaseBackTexCoords[1],
        // left
        bodyBaseLeftTexCoords[2], bodyBaseLeftTexCoords[3], bodyBaseLeftTexCoords[0],
        bodyBaseLeftTexCoords[2], bodyBaseLeftTexCoords[0], bodyBaseLeftTexCoords[1],    
        // top
        bodyBaseTopTexCoords[0], bodyBaseTopTexCoords[1], bodyBaseTopTexCoords[2],
        bodyBaseTopTexCoords[0], bodyBaseTopTexCoords[2], bodyBaseTopTexCoords[3],
        // bottom
        bodyBaseBottomTexCoords[2], bodyBaseBottomTexCoords[1], bodyBaseBottomTexCoords[0],
        bodyBaseBottomTexCoords[2], bodyBaseBottomTexCoords[0], bodyBaseBottomTexCoords[3],
    ]

    const a_armBaseFBTexCoords = [
        // top-right
        47, 20,
        // top-left
        44, 20,
        // bottom-left
        44, 31,
        // bottom-right
        47, 31
    ]
    const a_armBaseLRTexCoords = [
        // top-right
        43, 20,
        // top-left
        40, 20,
        // bottom-left
        40, 31,
        // bottom-right
        43, 31
    ]
    const a_armBaseTopTexCoords = [
        // top-right
        47, 16,
        // top-left
        44, 16,
        // bottom-left
        44, 19,
        // bottom-right
        47, 19
    ]
    const a_armBaseBottomTexCoords = [
        // top-right
        51, 16,
        // top-left
        48, 16,
        // bottom-left
        48, 19,
        // bottom-right
        51, 19
    ]

    const armBaseFBTexCoords = arraytoVec2Array(a_armBaseFBTexCoords, texwidth, texheight);
    const armBaseLRTexCoords = arraytoVec2Array(a_armBaseLRTexCoords, texwidth, texheight);
    const armBaseTopTexCoords = arraytoVec2Array(a_armBaseTopTexCoords, texwidth, texheight);
    const armBaseBottomTexCoords = arraytoVec2Array(a_armBaseBottomTexCoords, texwidth, texheight);

    const armTexCoordsComplete = [
        // front
        armBaseFBTexCoords[3], armBaseFBTexCoords[0], armBaseFBTexCoords[1],
        armBaseFBTexCoords[3], armBaseFBTexCoords[1], armBaseFBTexCoords[2],
        // right
        armBaseLRTexCoords[2], armBaseLRTexCoords[3], armBaseLRTexCoords[0],
        armBaseLRTexCoords[2], armBaseLRTexCoords[0], armBaseLRTexCoords[1],
        // back
        armBaseFBTexCoords[2], armBaseFBTexCoords[3], armBaseFBTexCoords[0],
        armBaseFBTexCoords[2], armBaseFBTexCoords[0], armBaseFBTexCoords[1],
        // left
        armBaseLRTexCoords[2], armBaseLRTexCoords[3], armBaseLRTexCoords[0],
        armBaseLRTexCoords[2], armBaseLRTexCoords[0], armBaseLRTexCoords[1],    
        // top
        armBaseTopTexCoords[0], armBaseTopTexCoords[1], armBaseTopTexCoords[2],
        armBaseTopTexCoords[0], armBaseTopTexCoords[2], armBaseTopTexCoords[3],
        // bottom
        armBaseBottomTexCoords[2], armBaseBottomTexCoords[1], armBaseBottomTexCoords[0],
        armBaseBottomTexCoords[2], armBaseBottomTexCoords[0], armBaseBottomTexCoords[3],
    ]

    const a_footBaseSideTexCoords = [
        // top-right
        7, 20,
        // top-left
        4, 20,
        // bottom-left
        4, 31,
        // bottom-right
        4, 31
    ]

    const a_footBaseTopTexCoords = [
        // top-right
        7, 16,
        // top-left
        4, 16,
        // bottom-left
        4, 19,
        // bottom-right
        7, 19
    ]

    const a_footBaseBottomTexCoords = [
        // top-right
        11, 16,
        // top-left
        8, 16,
        // bottom-left
        8, 19,
        // bottom-right
        11, 19
    ]

    const footBaseSideTexCoords = arraytoVec2Array(a_footBaseSideTexCoords, texwidth, texheight);
    const footBaseBottomTexCoords = arraytoVec2Array(a_footBaseBottomTexCoords, texwidth, texheight);
    const footBaseTopTexCoords = arraytoVec2Array(a_footBaseTopTexCoords, texwidth, texheight);

    const footTexCoordsComplete = [
        // front
        footBaseSideTexCoords[3], footBaseSideTexCoords[0], footBaseSideTexCoords[1],
        footBaseSideTexCoords[3], footBaseSideTexCoords[1], footBaseSideTexCoords[2],
        // right
        footBaseSideTexCoords[2],footBaseSideTexCoords[3],footBaseSideTexCoords[0],
        footBaseSideTexCoords[2],footBaseSideTexCoords[0],footBaseSideTexCoords[1],
        // back
        footBaseSideTexCoords[2], footBaseSideTexCoords[3], footBaseSideTexCoords[0],
        footBaseSideTexCoords[2], footBaseSideTexCoords[0], footBaseSideTexCoords[1],
        // left
        footBaseSideTexCoords[2],footBaseSideTexCoords[3],footBaseSideTexCoords[0],
        footBaseSideTexCoords[2],footBaseSideTexCoords[0],footBaseSideTexCoords[1],    
        // top
        footBaseTopTexCoords[0], footBaseTopTexCoords[1], footBaseTopTexCoords[2],
        footBaseTopTexCoords[0], footBaseTopTexCoords[2], footBaseTopTexCoords[3],
        // bottom
        footBaseBottomTexCoords[2], footBaseBottomTexCoords[1], footBaseBottomTexCoords[0],
        footBaseBottomTexCoords[2], footBaseBottomTexCoords[0], footBaseBottomTexCoords[3],
    ]

    const translateBody = Mat4.translation(0,-150,0)
    const translateHead = Mat4.translation(0,-150,0)
    const translateLeftFeet = Mat4.translation(0,-150,0)
    const translateRightFeet = Mat4.translation(200, -150, 0);
    const translateLeftArm = Mat4.translation(0, -150, 0);
    const translateRightArm = Mat4.translation(600, -150, 0);
    const scale = Mat4.scale(0.5,0.5,0.5)

    const newBodyPosition = MathUtil.multiplyMat4byVec4Array(
        scale, MathUtil.multiplyMat4byVec4Array(translateBody, 
            bodyPosition));
    const newHeadPosition = MathUtil.multiplyMat4byVec4Array(
        scale, MathUtil.multiplyMat4byVec4Array(translateHead, 
            headPosition));
    const newLeftFootPosition = MathUtil.multiplyMat4byVec4Array(
        scale, MathUtil.multiplyMat4byVec4Array(translateLeftFeet, 
            leftFootPosition));
    const newRightFootPosition = MathUtil.multiplyMat4byVec4Array(
        scale, MathUtil.multiplyMat4byVec4Array(translateRightFeet, 
            leftFootPosition));
    const newLeftArmPosition = MathUtil.multiplyMat4byVec4Array(
        scale, MathUtil.multiplyMat4byVec4Array(translateLeftArm, 
            leftArmPosition));
    const newRightArmPosition = MathUtil.multiplyMat4byVec4Array(
        scale, MathUtil.multiplyMat4byVec4Array(translateRightArm, 
            leftArmPosition));

    const myCube = new Component("Body", newBodyPosition , bodyTexCoordsComplete);
    const myHead = new Component("Head", newHeadPosition, headTexCoordsComplete);
    const myLeftFoot = new Component("Left Foot", newLeftFootPosition, footTexCoordsComplete);
    const myRightFoot = new Component("Right Foot", newRightFootPosition, footTexCoordsComplete);
    const myLeftArm = new Component("Left Arm", newLeftArmPosition, armTexCoordsComplete);
    const myRightArm = new Component("Right Arm", newRightArmPosition, armTexCoordsComplete);

     // ANIMATION GENERATION //
    let leftArmAnimArray: Mat4[] = [];
    let rightArmAnimArray: Mat4[] = [];
    let leftFootAnimArray: Mat4[] = [];
    let rightFootAnimArray: Mat4[] = [];
    const TOTALFRAMES = 30;

    toSave.totalAnimationFrames = TOTALFRAMES;

    const ARM_ANGLE = Math.PI / 15;
    const LEG_ANGLE = Math.PI / 15;
    for (let i = 0; i < TOTALFRAMES; i++) {
        const armAngle = ((i % (4 * ARM_ANGLE)) < (2 * ARM_ANGLE)) ? i % (2 * ARM_ANGLE) : -(i % (2 * ARM_ANGLE));
        leftArmAnimArray.push(Mat4.rotation_x(armAngle));
        rightArmAnimArray.push(Mat4.rotation_x(-armAngle));
        const legAngle = ((i % (4 * LEG_ANGLE)) < (2 * LEG_ANGLE)) ? i % (2 * LEG_ANGLE) : -(i % (2 * LEG_ANGLE));
        leftFootAnimArray.push(Mat4.rotation_x(-legAngle));
        rightFootAnimArray.push(Mat4.rotation_x(legAngle));
    }

    myLeftArm.animationMatrix = leftArmAnimArray;
    myRightArm.animationMatrix = rightArmAnimArray;
    myLeftFoot.animationMatrix = leftFootAnimArray;
    myRightFoot.animationMatrix = rightFootAnimArray;
    myCube.addChild(myHead);
    myCube.addChild(myLeftArm);
    myCube.addChild(myRightArm);
    myCube.addChild(myLeftFoot);
    myCube.addChild(myRightFoot);

    toSave.addComponent(myCube);

    return toSave;
}

const steveToDownloadedJSON = () => {
    // make a link to download the file
    const componentSaver = steveGenerator();
    const componentSaverJSON = JSON.stringify(componentSaver);
    const blob = new Blob([componentSaverJSON], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = "steve.json";
    link.href = url;
    link.click()
}

export {steveGenerator, steveToDownloadedJSON};