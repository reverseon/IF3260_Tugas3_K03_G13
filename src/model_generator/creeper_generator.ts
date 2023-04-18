import {Component, ComponentSaver} from "../model/Component";
import creeperTex from '../../shape/texture/creeper.png';
import {Vec4} from "../model/Vec4";
import {Vec2} from "../model/Vec2";
import {Mat4} from "../model/Mat4";
import {MathUtil} from "../util/MathUtil";
import {Vec3} from "../model/Vec3";

const arraytoVec4Array = (array: number[]): Vec4[] => {
    const result: Vec4[] = [];
    for (let i = 0; i < array.length; i += 4) {
        result.push(new Vec4(array.slice(i, i + 4)));
    }
    return result;
}
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
export default function creeperGenerator(): ComponentSaver {
    const creeper = new ComponentSaver(
        "Creeper",
        creeperTex
    )
    const a_headBasePosition = [
        // front top-right
        0.28, 0.9, 0.28, 1,
        // front top-left
        -0.28, 0.9, 0.28, 1,
        // front bottom-left
        -0.28, 0.34, 0.28, 1,
        // front bottom-right
        0.28, 0.34, 0.28, 1,
        // back top-right
        0.28, 0.9, -0.28, 1,
        // back top-left
        -0.28, 0.9, -0.28, 1,
        // back bottom-left
        -0.28, 0.34, -0.28, 1,
        // back bottom-right
        0.28, 0.34, -0.28, 1
    ]
    const a_headBaseFrontTexCoords = [
        // top-right
        16, 8,
        // top-left
        8, 8,
        // bottom-left
        8, 15,
        // bottom-right
        16, 15
    ]
    const a_headBaseBackTexCoords = [
        // top-right
        23, 1,
        // top-left
        16, 1,
        // bottom-left
        16, 7,
        // bottom-right
        23, 7
    ]
    const a_headBaseLeftTexCoords = [
        // top-right
        7, 8,
        // top-left
        1, 8,
        // bottom-left
        1, 15,
        // bottom-right
        7, 15
    ]
    const a_headBaseRightTexCoords = [
        // top-right
        23, 8,
        // top-left
        16, 8,
        // bottom-left
        16, 15,
        // bottom-right
        23, 15
    ]
    const a_headBaseTopTexCoords = [
        // top-right
        14, 1,
        // top-left
        8, 1,
        // bottom-left
        8, 7,
        // bottom-right
        14, 7
    ]


    const texwidth = 63;
    const texheight = 63;
    const headBasePosition = arraytoVec4Array(a_headBasePosition);
    const headBaseFrontTexCoords = arraytoVec2Array(a_headBaseFrontTexCoords, texwidth, texheight);
    const headBaseBackTexCoords = arraytoVec2Array(a_headBaseBackTexCoords, texwidth, texheight);
    const headBaseLeftTexCoords = arraytoVec2Array(a_headBaseLeftTexCoords, texwidth, texheight);
    const headBaseRightTexCoords = arraytoVec2Array(a_headBaseRightTexCoords, texwidth, texheight);
    const headBaseTopTexCoords = arraytoVec2Array(a_headBaseTopTexCoords, texwidth, texheight);
    const headVec4Complete = [
        // front
        headBasePosition[0], headBasePosition[1], headBasePosition[2],
        headBasePosition[0], headBasePosition[2], headBasePosition[3],
        // back
        headBasePosition[4], headBasePosition[6], headBasePosition[5],
        headBasePosition[4], headBasePosition[7], headBasePosition[6],
        // left
        headBasePosition[5], headBasePosition[6], headBasePosition[1],
        headBasePosition[6], headBasePosition[2], headBasePosition[1],
        // right
        headBasePosition[4], headBasePosition[3], headBasePosition[7],
        headBasePosition[4], headBasePosition[0], headBasePosition[3],
        // top
        headBasePosition[4], headBasePosition[5], headBasePosition[1],
        headBasePosition[4], headBasePosition[1], headBasePosition[0],
        // bottom
        headBasePosition[7], headBasePosition[3], headBasePosition[6],
        headBasePosition[3], headBasePosition[2], headBasePosition[6],
    ]
    const headTexCoordsComplete = [
        // front
        headBaseFrontTexCoords[0], headBaseFrontTexCoords[1], headBaseFrontTexCoords[2],
        headBaseFrontTexCoords[0], headBaseFrontTexCoords[2], headBaseFrontTexCoords[3],
        // back
        headBaseBackTexCoords[0], headBaseBackTexCoords[2], headBaseBackTexCoords[1],
        headBaseBackTexCoords[0], headBaseBackTexCoords[3], headBaseBackTexCoords[2],
        // left
        headBaseLeftTexCoords[0], headBaseLeftTexCoords[3], headBaseLeftTexCoords[1],
        headBaseLeftTexCoords[3], headBaseLeftTexCoords[2], headBaseLeftTexCoords[1],
        // right
        headBaseRightTexCoords[0], headBaseRightTexCoords[2], headBaseRightTexCoords[1],
        headBaseRightTexCoords[0], headBaseRightTexCoords[3], headBaseRightTexCoords[2],
        // top
        headBaseTopTexCoords[0], headBaseTopTexCoords[1], headBaseTopTexCoords[2],
        headBaseTopTexCoords[0], headBaseTopTexCoords[2], headBaseTopTexCoords[3],
        // bottom same as top
        headBaseTopTexCoords[0], headBaseTopTexCoords[3], headBaseTopTexCoords[1],
        headBaseTopTexCoords[3], headBaseTopTexCoords[2], headBaseTopTexCoords[1],
    ]

    const headComponent = new Component(
        "Head",
        MathUtil.multiplyMat4byVec4Array(Mat4.scale(300,300, 300), headVec4Complete),
        headTexCoordsComplete
    )


    const a_bodyBasePosition = [
        // front top-right
        0.28, 0.34, 0.14, 1,
        // front top-left
        -0.28, 0.34, 0.14, 1,
        // front bottom-left
        -0.28, -0.5, 0.14, 1,
        // front bottom-right
        0.28, -0.5, 0.14, 1,
        // back top-right
        0.28, 0.34, -0.14, 1,
        // back top-left
        -0.28, 0.34, -0.14, 1,
        // back bottom-left
        -0.28, -0.5, -0.14, 1,
        // back bottom-right
        0.28, -0.5, -0.14, 1
    ]
    const a_bodyBaseSideTexCoords = [
        // top-right
        35, 16,
        // top-left
        20, 16,
        // bottom-left
        20, 19,
        // bottom-right
        35, 19
    ]

    const a_bodyBaseFBTexCoords = [
        // top-right
        31, 8,
        // top-left
        24, 8,
        // bottom-left
        24, 25,
        // bottom-right
        31, 25
    ]
    const bodyBasePosition = arraytoVec4Array(a_bodyBasePosition);
    const bodyBaseSideTexCoords = arraytoVec2Array(a_bodyBaseSideTexCoords, texwidth, texheight);
    const bodyBaseFBTexCoords = arraytoVec2Array(a_bodyBaseFBTexCoords, texwidth, texheight);
    const bodyVec4Complete = [
        // front
        bodyBasePosition[0], bodyBasePosition[1], bodyBasePosition[2],
        bodyBasePosition[0], bodyBasePosition[2], bodyBasePosition[3],
        // back
        bodyBasePosition[4], bodyBasePosition[6], bodyBasePosition[5],
        bodyBasePosition[4], bodyBasePosition[7], bodyBasePosition[6],
        // left
        bodyBasePosition[5], bodyBasePosition[6], bodyBasePosition[1],
        bodyBasePosition[6], bodyBasePosition[2], bodyBasePosition[1],
        // right
        bodyBasePosition[4], bodyBasePosition[3], bodyBasePosition[7],
        bodyBasePosition[4], bodyBasePosition[0], bodyBasePosition[3],
        // top
        bodyBasePosition[4], bodyBasePosition[5], bodyBasePosition[1],
        bodyBasePosition[4], bodyBasePosition[1], bodyBasePosition[0],
        // bottom
        bodyBasePosition[7], bodyBasePosition[3], bodyBasePosition[6],
        bodyBasePosition[3], bodyBasePosition[2], bodyBasePosition[6],
    ]
    const bodyTexCoordsComplete = [
        // front
        bodyBaseFBTexCoords[0], bodyBaseFBTexCoords[1], bodyBaseFBTexCoords[2],
        bodyBaseFBTexCoords[0], bodyBaseFBTexCoords[2], bodyBaseFBTexCoords[3],
        // back
        bodyBaseFBTexCoords[0], bodyBaseFBTexCoords[2], bodyBaseFBTexCoords[1],
        bodyBaseFBTexCoords[0], bodyBaseFBTexCoords[3], bodyBaseFBTexCoords[2],
        // left
        bodyBaseSideTexCoords[0], bodyBaseSideTexCoords[1], bodyBaseSideTexCoords[3],
        bodyBaseSideTexCoords[1], bodyBaseSideTexCoords[2], bodyBaseSideTexCoords[3],
        // right
        bodyBaseSideTexCoords[0], bodyBaseSideTexCoords[2], bodyBaseSideTexCoords[1],
        bodyBaseSideTexCoords[0], bodyBaseSideTexCoords[3], bodyBaseSideTexCoords[2],
        // top
        bodyBaseSideTexCoords[0], bodyBaseSideTexCoords[1], bodyBaseSideTexCoords[2],
        bodyBaseSideTexCoords[0], bodyBaseSideTexCoords[2], bodyBaseSideTexCoords[3],
        // bottom
        bodyBaseSideTexCoords[0], bodyBaseSideTexCoords[3], bodyBaseSideTexCoords[1],
        bodyBaseSideTexCoords[3], bodyBaseSideTexCoords[2], bodyBaseSideTexCoords[1],
    ]

    const legBasePosition = [
        // front top-right
        0.28, -0.5, 0.42, 1,
        // front top-left
        0, -0.5, 0.42, 1,
        // front bottom-left
        0, -0.92, 0.42, 1,
        // front bottom-right
        0.28, -0.92, 0.42, 1,
        // back top-right
        0.28, -0.5, 0.14, 1,
        // back top-left
        0, -0.5, 0.14, 1,
        // back bottom-left
        0, -0.92, 0.14, 1,
        // back bottom-right
        0.28, -0.92, 0.14, 1
    ]
    const legBaseSideTexCoords = [
        // top-right
        1, 20,
        // top-left
        1, 25,
        // bottom-left
        19, 25,
        // bottom-right
        19, 20
    ]
    const legBasePositionVec4 = arraytoVec4Array(legBasePosition);
    const legBaseSideTexCoordsVec2 = arraytoVec2Array(legBaseSideTexCoords, texwidth, texheight);
    const legVec4Complete = [
        // front
        legBasePositionVec4[0], legBasePositionVec4[1], legBasePositionVec4[2],
        legBasePositionVec4[0], legBasePositionVec4[2], legBasePositionVec4[3],
        // back
        legBasePositionVec4[4], legBasePositionVec4[6], legBasePositionVec4[5],
        legBasePositionVec4[4], legBasePositionVec4[7], legBasePositionVec4[6],
        // left
        legBasePositionVec4[5], legBasePositionVec4[6], legBasePositionVec4[1],
        legBasePositionVec4[6], legBasePositionVec4[2], legBasePositionVec4[1],
        // right
        legBasePositionVec4[4], legBasePositionVec4[3], legBasePositionVec4[7],
        legBasePositionVec4[4], legBasePositionVec4[0], legBasePositionVec4[3],
        // top
        legBasePositionVec4[4], legBasePositionVec4[5], legBasePositionVec4[1],
        legBasePositionVec4[4], legBasePositionVec4[1], legBasePositionVec4[0],
        // bottom
        legBasePositionVec4[7], legBasePositionVec4[3], legBasePositionVec4[6],
        legBasePositionVec4[3], legBasePositionVec4[2], legBasePositionVec4[6],
    ]
    const legTexCoordsComplete = [
        // front
        legBaseSideTexCoordsVec2[0], legBaseSideTexCoordsVec2[1], legBaseSideTexCoordsVec2[2],
        legBaseSideTexCoordsVec2[0], legBaseSideTexCoordsVec2[2], legBaseSideTexCoordsVec2[3],
        // back
        legBaseSideTexCoordsVec2[0], legBaseSideTexCoordsVec2[2], legBaseSideTexCoordsVec2[1],
        legBaseSideTexCoordsVec2[0], legBaseSideTexCoordsVec2[3], legBaseSideTexCoordsVec2[2],
        // left
        legBaseSideTexCoordsVec2[0], legBaseSideTexCoordsVec2[3], legBaseSideTexCoordsVec2[1],
        legBaseSideTexCoordsVec2[3], legBaseSideTexCoordsVec2[2], legBaseSideTexCoordsVec2[1],
        // right
        legBaseSideTexCoordsVec2[0], legBaseSideTexCoordsVec2[2], legBaseSideTexCoordsVec2[3],
        legBaseSideTexCoordsVec2[0], legBaseSideTexCoordsVec2[1], legBaseSideTexCoordsVec2[2],
        // top
        legBaseSideTexCoordsVec2[0], legBaseSideTexCoordsVec2[1], legBaseSideTexCoordsVec2[2],
        legBaseSideTexCoordsVec2[0], legBaseSideTexCoordsVec2[2], legBaseSideTexCoordsVec2[3],
        // bottom
        legBaseSideTexCoordsVec2[0], legBaseSideTexCoordsVec2[3], legBaseSideTexCoordsVec2[1],
        legBaseSideTexCoordsVec2[3], legBaseSideTexCoordsVec2[2], legBaseSideTexCoordsVec2[1],
    ]

    const frontLeftLegComponent = new Component(
        "Front Left Leg",
        MathUtil.multiplyMat4byVec4Array(Mat4.scale(300,300, 300), legVec4Complete),
        legTexCoordsComplete
    )

    const frontRightLegPosition = [
        // front top-right
        0, -0.5, 0.42, 1,
        // front top-left
        -0.28, -0.5, 0.42, 1,
        // front bottom-left
        -0.28, -0.92, 0.42, 1,
        // front bottom-right
        0, -0.92, 0.42, 1,
        // back top-right
        0, -0.5, 0.14, 1,
        // back top-left
        -0.28, -0.5, 0.14, 1,
        // back bottom-left
        -0.28, -0.92, 0.14, 1,
        // back bottom-right
        0, -0.92, 0.14, 1
    ]
    const frontRightLegPositionVec4 = arraytoVec4Array(frontRightLegPosition);
    const frontRightLegVec4Complete = [
        // front
        frontRightLegPositionVec4[0], frontRightLegPositionVec4[1], frontRightLegPositionVec4[2],
        frontRightLegPositionVec4[0], frontRightLegPositionVec4[2], frontRightLegPositionVec4[3],
        // back
        frontRightLegPositionVec4[4], frontRightLegPositionVec4[6], frontRightLegPositionVec4[5],
        frontRightLegPositionVec4[4], frontRightLegPositionVec4[7], frontRightLegPositionVec4[6],
        // left
        frontRightLegPositionVec4[5], frontRightLegPositionVec4[6], frontRightLegPositionVec4[1],
        frontRightLegPositionVec4[6], frontRightLegPositionVec4[2], frontRightLegPositionVec4[1],
        // right
        frontRightLegPositionVec4[4], frontRightLegPositionVec4[3], frontRightLegPositionVec4[7],
        frontRightLegPositionVec4[4], frontRightLegPositionVec4[0], frontRightLegPositionVec4[3],
        // top
        frontRightLegPositionVec4[4], frontRightLegPositionVec4[5], frontRightLegPositionVec4[1],
        frontRightLegPositionVec4[4], frontRightLegPositionVec4[1], frontRightLegPositionVec4[0],
        // bottom
        frontRightLegPositionVec4[7], frontRightLegPositionVec4[3], frontRightLegPositionVec4[6],
        frontRightLegPositionVec4[3], frontRightLegPositionVec4[2], frontRightLegPositionVec4[6],
    ]

    const backLeftLegPosition = [
        // front top-right
        0.28, -0.5, -0.14, 1,
        // front top-left
        0, -0.5, -0.14, 1,
        // front bottom-left
        0, -0.92, -0.14, 1,
        // front bottom-right
        0.28, -0.92, -0.14, 1,
        // back top-right
        0.28, -0.5, -0.42, 1,
        // back top-left
        0, -0.5, -0.42, 1,
        // back bottom-left
        0, -0.92, -0.42, 1,
        // back bottom-right
        0.28, -0.92, -0.42, 1
    ]
    const backLeftLegPositionVec4 = arraytoVec4Array(backLeftLegPosition);
    const backLeftLegVec4Complete = [
        // front
        backLeftLegPositionVec4[0], backLeftLegPositionVec4[1], backLeftLegPositionVec4[2],
        backLeftLegPositionVec4[0], backLeftLegPositionVec4[2], backLeftLegPositionVec4[3],
        // back
        backLeftLegPositionVec4[4], backLeftLegPositionVec4[6], backLeftLegPositionVec4[5],
        backLeftLegPositionVec4[4], backLeftLegPositionVec4[7], backLeftLegPositionVec4[6],
        // left
        backLeftLegPositionVec4[5], backLeftLegPositionVec4[6], backLeftLegPositionVec4[1],
        backLeftLegPositionVec4[6], backLeftLegPositionVec4[2], backLeftLegPositionVec4[1],
        // right
        backLeftLegPositionVec4[4], backLeftLegPositionVec4[3], backLeftLegPositionVec4[7],
        backLeftLegPositionVec4[4], backLeftLegPositionVec4[0], backLeftLegPositionVec4[3],
        // top
        backLeftLegPositionVec4[4], backLeftLegPositionVec4[5], backLeftLegPositionVec4[1],
        backLeftLegPositionVec4[4], backLeftLegPositionVec4[1], backLeftLegPositionVec4[0],
        // bottom
        backLeftLegPositionVec4[7], backLeftLegPositionVec4[3], backLeftLegPositionVec4[6],
        backLeftLegPositionVec4[3], backLeftLegPositionVec4[2], backLeftLegPositionVec4[6],
    ]

    const backRightLegPosition = [
        // front top-right
        0.0, -0.5, -0.14, 1,
        // front top-left
        -0.28, -0.5, -0.14, 1,
        // front bottom-left
        -0.28, -0.92, -0.14, 1,
        // front bottom-right
        0.0, -0.92, -0.14, 1,
        // back top-right
        0.0, -0.5, -0.42, 1,
        // back top-left
        -0.28, -0.5, -0.42, 1,
        // back bottom-left
        -0.28, -0.92, -0.42, 1,
        // back bottom-right
        0.0, -0.92, -0.42, 1
    ]

    const backRightLegPositionVec4 = arraytoVec4Array(backRightLegPosition);
    const backRightLegVec4Complete = [
        // front
        backRightLegPositionVec4[0], backRightLegPositionVec4[1], backRightLegPositionVec4[2],
        backRightLegPositionVec4[0], backRightLegPositionVec4[2], backRightLegPositionVec4[3],
        // back
        backRightLegPositionVec4[4], backRightLegPositionVec4[6], backRightLegPositionVec4[5],
        backRightLegPositionVec4[4], backRightLegPositionVec4[7], backRightLegPositionVec4[6],
        // left
        backRightLegPositionVec4[5], backRightLegPositionVec4[6], backRightLegPositionVec4[1],
        backRightLegPositionVec4[6], backRightLegPositionVec4[2], backRightLegPositionVec4[1],
        // right
        backRightLegPositionVec4[4], backRightLegPositionVec4[3], backRightLegPositionVec4[7],
        backRightLegPositionVec4[4], backRightLegPositionVec4[0], backRightLegPositionVec4[3],
        // top
        backRightLegPositionVec4[4], backRightLegPositionVec4[5], backRightLegPositionVec4[1],
        backRightLegPositionVec4[4], backRightLegPositionVec4[1], backRightLegPositionVec4[0],
        // bottom
        backRightLegPositionVec4[7], backRightLegPositionVec4[3], backRightLegPositionVec4[6],
        backRightLegPositionVec4[3], backRightLegPositionVec4[2], backRightLegPositionVec4[6],
    ]

    const backRightLegComponent = new Component(
        "Back Right Leg",
        MathUtil.multiplyMat4byVec4Array(Mat4.scale(300,300, 300), backRightLegVec4Complete),
        legTexCoordsComplete
    )
    const backLeftLegComponent = new Component(
        "Back Left Leg",
        MathUtil.multiplyMat4byVec4Array(Mat4.scale(300,300, 300), backLeftLegVec4Complete),
        legTexCoordsComplete
    )

    const frontRightLegComponent = new Component(
        "Front Right Leg",
        MathUtil.multiplyMat4byVec4Array(Mat4.scale(300,300, 300), frontRightLegVec4Complete),
        legTexCoordsComplete
    )

    const bodyComponent = new Component(
        "Body",
        MathUtil.multiplyMat4byVec4Array(Mat4.scale(300,300, 300), bodyVec4Complete),
        bodyTexCoordsComplete
    )

    // ANIMATION GENERATION //
    const animArray: Mat4[] = [];
    const TOTALFRAMES = 60;

    creeper.totalAnimationFrames = TOTALFRAMES;

    // HEAD //
    for (let i = 0; i < TOTALFRAMES; i++) {
        animArray.push(Mat4.rotation_y(
            MathUtil.lerpf(0, Math.PI * 2, i / TOTALFRAMES)
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

    const backLeftLegAnimArray: Mat4[] = [];
    let backLeftRotationCenter = new Vec3([0.14, -0.5, -0.14]);
    backLeftRotationCenter = backLeftRotationCenter.multiply_scalar(300);

    for (let i = 0; i < TOTALFRAMES/4; i++) {
        const rotationToFront = MathUtil.lerpf(0, -MP8, 4 * i / TOTALFRAMES);
        const mat = Mat4.translation(-backLeftRotationCenter.x, -backLeftRotationCenter.y, -backLeftRotationCenter.z)
            .mul(Mat4.rotation_x(rotationToFront))
            .mul(Mat4.translation(backLeftRotationCenter.x, backLeftRotationCenter.y, backLeftRotationCenter.z));
        backLeftLegAnimArray.push(mat);
    }
    for (let i = 0; i < TOTALFRAMES/2; i++) {
        const rotationToBack = MathUtil.lerpf(-MP8, MP8, 2 * i / TOTALFRAMES);
        const mat = Mat4.translation(-backLeftRotationCenter.x, -backLeftRotationCenter.y, -backLeftRotationCenter.z)
            .mul(Mat4.rotation_x(rotationToBack))
            .mul(Mat4.translation(backLeftRotationCenter.x, backLeftRotationCenter.y, backLeftRotationCenter.z));
        backLeftLegAnimArray.push(mat);
    }
    for (let i = 0; i < TOTALFRAMES/4; i++) {
        const rotationToFront = MathUtil.lerpf(MP8, 0, 4 * i / TOTALFRAMES);
        const mat = Mat4.translation(-backLeftRotationCenter.x, -backLeftRotationCenter.y, -backLeftRotationCenter.z)
            .mul(Mat4.rotation_x(rotationToFront))
            .mul(Mat4.translation(backLeftRotationCenter.x, backLeftRotationCenter.y, backLeftRotationCenter.z));
        backLeftLegAnimArray.push(mat);
    }

    const backRightLegAnimArray: Mat4[] = [];
    let backRightRotationCenter = new Vec3([-0.14, -0.5, -0.14]);
    backRightRotationCenter = backRightRotationCenter.multiply_scalar(300);

    for (let i = 0; i < TOTALFRAMES/4; i++) {
        const rotationToFront = MathUtil.lerpf(0, MP8, 4 * i / TOTALFRAMES);
        const mat = Mat4.translation(-backRightRotationCenter.x, -backRightRotationCenter.y, -backRightRotationCenter.z)
            .mul(Mat4.rotation_x(rotationToFront))
            .mul(Mat4.translation(backRightRotationCenter.x, backRightRotationCenter.y, backRightRotationCenter.z));
        backRightLegAnimArray.push(mat);
    }

    for (let i = 0; i < TOTALFRAMES/2; i++) {
        const rotationToBack = MathUtil.lerpf(MP8, -MP8, 2 * i / TOTALFRAMES);
        const mat = Mat4.translation(-backRightRotationCenter.x, -backRightRotationCenter.y, -backRightRotationCenter.z)
            .mul(Mat4.rotation_x(rotationToBack))
            .mul(Mat4.translation(backRightRotationCenter.x, backRightRotationCenter.y, backRightRotationCenter.z));
        backRightLegAnimArray.push(mat);
    }

    for (let i = 0; i < TOTALFRAMES/4; i++) {
        const rotationToFront = MathUtil.lerpf(-MP8, 0, 4 * i / TOTALFRAMES);
        const mat = Mat4.translation(-backRightRotationCenter.x, -backRightRotationCenter.y, -backRightRotationCenter.z)
            .mul(Mat4.rotation_x(rotationToFront))
            .mul(Mat4.translation(backRightRotationCenter.x, backRightRotationCenter.y, backRightRotationCenter.z));
        backRightLegAnimArray.push(mat);
    }

    headComponent.animationMatrix = animArray;
    frontLeftLegComponent.animationMatrix = frontLeftLegAnimArray;
    frontRightLegComponent.animationMatrix = frontRightLegAnimArray;
    backLeftLegComponent.animationMatrix = backLeftLegAnimArray;
    backRightLegComponent.animationMatrix = backRightLegAnimArray;
    bodyComponent.addChild(headComponent);
    bodyComponent.addChild(frontLeftLegComponent);
    bodyComponent.addChild(frontRightLegComponent);
    bodyComponent.addChild(backLeftLegComponent);
    bodyComponent.addChild(backRightLegComponent);
    creeper.addComponent(bodyComponent);


    return creeper;
}

const creeperToDownloadedJSON = () => {
    const componentSaver = creeperGenerator();
    const componentSaverJSON = JSON.stringify(componentSaver);
    const blob = new Blob([componentSaverJSON], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = "creeper.json";
    link.href = url;
    link.click()
}

export {creeperGenerator, creeperToDownloadedJSON}