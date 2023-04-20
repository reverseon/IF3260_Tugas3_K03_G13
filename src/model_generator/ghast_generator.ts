import {Component, ComponentSaver} from "../model/Component";
import ghastTex from '../../shape/texture/ghast.png';
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

export default function ghastGenerator() : ComponentSaver {
    const ghast = new ComponentSaver(
        "Ghast",
        ghastTex
    );
    const a_headBasePosition = [
        // front top right
        8, 8, 16, 1,
        // front top left
        -8, 8, 16, 1,
        // front bottom right
        8, -8, 16, 1,
        // front bottom left
        -8, -8, 16, 1,
        // back top right
        8, 8, 0, 1,
        // back top left
        -8, 8, 0, 1,
        // back bottom right
        8, -8, 0, 1,
        // back bottom left
        -8, -8, 0, 1
    ];
    const a_legBasePosition = [
        // front top right
        1, -7.8357, 8.9396, 1,
        // front top left
        -1, -7.8357, 8.9396, 1,
        // front bottom right
        1, -20.991, 4.1513, 1,
        // front bottom left
        -1, -20.991, 4.1513, 1,
        // back top right
        1, -7.1517, 7.0602, 1,
        // back top left
        -1, -7.1517, 7.0602, 1,
        // back bottom right
        1, -20.307, 2.2719, 1,
        // back bottom left
        -1, -20.307, 2.2719, 1
    ];
    const a_headBaseFrontTexCoords = [
        // top right
        32, 16,
        // top left
        16, 16,
        // bottom right
        32, 32,
        // bottom left
        16, 32
    ];
    const a_headBaseBackTexCoords = [
        // top right
        64, 16,
        // top left
        48, 16,
        // bottom right
        64, 32,
        // bottom left
        48, 32
    ];
    const a_headBaseLeftTexCoords = [
        // top right
        16, 16,
        // top left
        0, 16,
        // bottom right
        16, 32,
        // bottom left
        0, 16
    ];
    const a_headBaseRightTexCoords = [
        // top right
        48, 16,
        // top left
        32, 16,
        // bottom right
        48, 32,
        // bottom left
        32, 32
    ];
    const a_headBaseTopTexCoords = [
        // top right
        32, 0,
        // top left
        16, 0,
        // bottom right
        32, 16,
        // bottom left
        16, 16 
    ];
    const a_headBaseBottomTexCoords = [
        // top right
        48, 0,
        // top left
        32, 0,
        // bottom right
        48, 16,
        // bottom left
        32, 16
    ];
    const a_legBaseFrontTexCoords = [
        // top-right
        4, 2,
        // top-left
        2, 2,
        // bottom-right
        4, 16,
        // bottom-left
        2, 16
    ];
    const a_legBaseRightTexCoords = [
        // top-right
        6, 2,
        // top-left
        4, 2,
        // bottom-right
        6, 16,
        // bottom-left
        4, 16
    ];
    const a_legBaseBackTexCoords = [
        // top-right
        8, 2,
        // top-left
        6, 2,
        // bottom-right
        8, 16,
        // bottom-left
        6, 16
    ];
    const a_legBaseLeftTexCoords = [
        // top-right
        2, 2,
        // top-left
        0, 2,
        // bottom-right
        2, 16,
        // bottom-left
        0, 16
    ];
    const a_legBaseTopTexCoords = [
        // top-right
        4, 0,
        // top-left
        2, 0,
        // bottom-right
        4, 2,
        // bottom-left
        2, 2
    ];
    const a_legBaseBottomTexCoords = [
        // top-right
        6, 0,
        // top-left
        4, 0,
        // bottom-right
        6, 2,
        // bottom-left
        4, 2
    ];

    const texwidth = 64;
    const texheight = 32;
    const headBasePosition = arraytoVec4Array(a_headBasePosition);
    const headBaseFrontTexCoords = arraytoVec2Array(a_headBaseFrontTexCoords, texwidth, texheight);
    const headBaseBackTexCoords = arraytoVec2Array(a_headBaseBackTexCoords, texwidth, texheight);
    const headBaseLeftTexCoords = arraytoVec2Array(a_headBaseLeftTexCoords, texwidth, texheight);
    const headBaseRightTexCoords = arraytoVec2Array(a_headBaseRightTexCoords, texwidth, texheight);
    const headBaseTopTexCoords = arraytoVec2Array(a_headBaseTopTexCoords, texwidth, texheight);
    const headBaseBottomTexCoords = arraytoVec2Array(a_headBaseBottomTexCoords, texwidth, texheight);
    const headVec4Complete = [
        // front
        headBasePosition[0], headBasePosition[1], headBasePosition[2],
        headBasePosition[2], headBasePosition[1], headBasePosition[3],
        // right
        headBasePosition[4], headBasePosition[0], headBasePosition[6],
        headBasePosition[6], headBasePosition[0], headBasePosition[2],
        // back
        headBasePosition[5], headBasePosition[4], headBasePosition[7],
        headBasePosition[7], headBasePosition[4], headBasePosition[6],
        // left
        headBasePosition[1], headBasePosition[5], headBasePosition[3],
        headBasePosition[3], headBasePosition[5], headBasePosition[7],
        // top
        headBasePosition[4], headBasePosition[5], headBasePosition[0],
        headBasePosition[0], headBasePosition[5], headBasePosition[1],
        // bottom
        headBasePosition[2], headBasePosition[3], headBasePosition[6],
        headBasePosition[6], headBasePosition[3], headBasePosition[7]
    ];
    const headTexCoordsComplete = [
        // front
        headBaseFrontTexCoords[0], headBaseFrontTexCoords[1], headBaseFrontTexCoords[2],
        headBaseFrontTexCoords[2], headBaseFrontTexCoords[1], headBaseFrontTexCoords[3],
        // right
        headBaseRightTexCoords[0], headBaseRightTexCoords[1], headBaseRightTexCoords[2],
        headBaseRightTexCoords[2], headBaseRightTexCoords[1], headBaseRightTexCoords[3],
        // back
        headBaseBackTexCoords[0], headBaseBackTexCoords[1], headBaseBackTexCoords[2],
        headBaseBackTexCoords[2], headBaseBackTexCoords[1], headBaseRightTexCoords[3],
        // left
        headBaseLeftTexCoords[0], headBaseLeftTexCoords[1], headBaseLeftTexCoords[2],
        headBaseLeftTexCoords[2], headBaseLeftTexCoords[1], headBaseLeftTexCoords[3],
        // top
        headBaseTopTexCoords[0], headBaseTopTexCoords[1], headBaseTopTexCoords[2],
        headBaseTopTexCoords[2], headBaseTopTexCoords[1], headBaseTopTexCoords[3],
        // bottom
        headBaseBottomTexCoords[2], headBaseBottomTexCoords[3], headBaseBottomTexCoords[0],
        headBaseBottomTexCoords[0], headBaseBottomTexCoords[3], headBaseBottomTexCoords[1]
    ];

    let leg = [
        [[...a_legBasePosition], [...a_legBasePosition], [...a_legBasePosition]],
        [[...a_legBasePosition], [...a_legBasePosition], [...a_legBasePosition]],
        [[...a_legBasePosition], [...a_legBasePosition], [...a_legBasePosition]]
    ];
    for(let i=0; i<3; i++){
        for(let j=0; j<3; j++){
            for(let k=0; k<a_legBasePosition.length; k++){
                if(k%4 == 0){
                    leg[i][j][k] += (1-i)*5;
                }else if(k%4 == 2){
                    leg[i][j][k] += (1-j)*5;
                }
            }
        }
    }

    const frontRightLegBasePosition = arraytoVec4Array(leg[0][0]);
    const frontCenterLegBasePosition = arraytoVec4Array(leg[0][1]);
    const frontLeftLegBasePosition = arraytoVec4Array(leg[0][2]);
    const centerRightLegBasePosition = arraytoVec4Array(leg[1][0]);
    const centerCenterLegBasePosition = arraytoVec4Array(leg[1][1]);
    const centerLeftLegBasePosition = arraytoVec4Array(leg[1][2]);
    const backRightLegBasePosition = arraytoVec4Array(leg[2][0]);
    const backCenterLegBasePosition = arraytoVec4Array(leg[2][1]);
    const backLeftLegBasePosition = arraytoVec4Array(leg[2][2]);
    const legBaseFrontTexCoords = arraytoVec2Array(a_legBaseFrontTexCoords, texwidth, texheight);
    const legBaseRightTexCoords = arraytoVec2Array(a_legBaseRightTexCoords, texwidth, texheight);
    const legBaseBackTexCoords = arraytoVec2Array(a_legBaseBackTexCoords, texwidth, texheight);
    const legBaseLeftTexCoords = arraytoVec2Array(a_legBaseLeftTexCoords, texwidth, texheight);
    const legBaseTopTexCoords = arraytoVec2Array(a_legBaseTopTexCoords, texwidth, texheight);
    const legBaseBottomTexCoords = arraytoVec2Array(a_legBaseBottomTexCoords, texwidth, texheight);

    const frontRightLegVec4Complete = [
        // front
        frontRightLegBasePosition[0], frontRightLegBasePosition[1], frontRightLegBasePosition[2],
        frontRightLegBasePosition[2], frontRightLegBasePosition[1], frontRightLegBasePosition[3],
        // right
        frontRightLegBasePosition[4], frontRightLegBasePosition[0], frontRightLegBasePosition[6],
        frontRightLegBasePosition[6], frontRightLegBasePosition[0], frontRightLegBasePosition[2],
        // back
        frontRightLegBasePosition[5], frontRightLegBasePosition[4], frontRightLegBasePosition[7],
        frontRightLegBasePosition[7], frontRightLegBasePosition[4], frontRightLegBasePosition[6],
        // left
        frontRightLegBasePosition[1], frontRightLegBasePosition[5], frontRightLegBasePosition[3],
        frontRightLegBasePosition[3], frontRightLegBasePosition[5], frontRightLegBasePosition[7],
        // top
        frontRightLegBasePosition[4], frontRightLegBasePosition[5], frontRightLegBasePosition[0],
        frontRightLegBasePosition[0], frontRightLegBasePosition[5], frontRightLegBasePosition[1],
        // bottom
        frontRightLegBasePosition[2], frontRightLegBasePosition[3], frontRightLegBasePosition[6],
        frontRightLegBasePosition[6], frontRightLegBasePosition[3], frontRightLegBasePosition[7]
    ];

    const frontCenterLegVec4Complete = [
        // front
        frontCenterLegBasePosition[0], frontCenterLegBasePosition[1], frontCenterLegBasePosition[2],
        frontCenterLegBasePosition[2], frontCenterLegBasePosition[1], frontCenterLegBasePosition[3],
        // right
        frontCenterLegBasePosition[4], frontCenterLegBasePosition[0], frontCenterLegBasePosition[6],
        frontCenterLegBasePosition[6], frontCenterLegBasePosition[0], frontCenterLegBasePosition[2],
        // back
        frontCenterLegBasePosition[5], frontCenterLegBasePosition[4], frontCenterLegBasePosition[7],
        frontCenterLegBasePosition[7], frontCenterLegBasePosition[4], frontCenterLegBasePosition[6],
        // left
        frontCenterLegBasePosition[1], frontCenterLegBasePosition[5], frontCenterLegBasePosition[3],
        frontCenterLegBasePosition[3], frontCenterLegBasePosition[5], frontCenterLegBasePosition[7],
        // top
        frontCenterLegBasePosition[4], frontCenterLegBasePosition[5], frontCenterLegBasePosition[0],
        frontCenterLegBasePosition[0], frontCenterLegBasePosition[5], frontCenterLegBasePosition[1],
        // bottom
        frontCenterLegBasePosition[2], frontCenterLegBasePosition[3], frontCenterLegBasePosition[6],
        frontCenterLegBasePosition[6], frontCenterLegBasePosition[3], frontCenterLegBasePosition[7]
    ];

    const frontLeftLegVec4Complete = [
        // front
        frontLeftLegBasePosition[0], frontLeftLegBasePosition[1], frontLeftLegBasePosition[2],
        frontLeftLegBasePosition[2], frontLeftLegBasePosition[1], frontLeftLegBasePosition[3],
        // right
        frontLeftLegBasePosition[4], frontLeftLegBasePosition[0], frontLeftLegBasePosition[6],
        frontLeftLegBasePosition[6], frontLeftLegBasePosition[0], frontLeftLegBasePosition[2],
        // back
        frontLeftLegBasePosition[5], frontLeftLegBasePosition[4], frontLeftLegBasePosition[7],
        frontLeftLegBasePosition[7], frontLeftLegBasePosition[4], frontLeftLegBasePosition[6],
        // left
        frontLeftLegBasePosition[1], frontLeftLegBasePosition[5], frontLeftLegBasePosition[3],
        frontLeftLegBasePosition[3], frontLeftLegBasePosition[5], frontLeftLegBasePosition[7],
        // top
        frontLeftLegBasePosition[4], frontLeftLegBasePosition[5], frontLeftLegBasePosition[0],
        frontLeftLegBasePosition[0], frontLeftLegBasePosition[5], frontLeftLegBasePosition[1],
        // bottom
        frontLeftLegBasePosition[2], frontLeftLegBasePosition[3], frontLeftLegBasePosition[6],
        frontLeftLegBasePosition[6], frontLeftLegBasePosition[3], frontLeftLegBasePosition[7]
    ];

    const centerRightLegVec4Complete = [
        // front
        centerRightLegBasePosition[0], centerRightLegBasePosition[1], centerRightLegBasePosition[2],
        centerRightLegBasePosition[2], centerRightLegBasePosition[1], centerRightLegBasePosition[3],
        // right
        centerRightLegBasePosition[4], centerRightLegBasePosition[0], centerRightLegBasePosition[6],
        centerRightLegBasePosition[6], centerRightLegBasePosition[0], centerRightLegBasePosition[2],
        // back
        centerRightLegBasePosition[5], centerRightLegBasePosition[4], centerRightLegBasePosition[7],
        centerRightLegBasePosition[7], centerRightLegBasePosition[4], centerRightLegBasePosition[6],
        // left
        centerRightLegBasePosition[1], centerRightLegBasePosition[5], centerRightLegBasePosition[3],
        centerRightLegBasePosition[3], centerRightLegBasePosition[5], centerRightLegBasePosition[7],
        // top
        centerRightLegBasePosition[4], centerRightLegBasePosition[5], centerRightLegBasePosition[0],
        centerRightLegBasePosition[0], centerRightLegBasePosition[5], centerRightLegBasePosition[1],
        // bottom
        centerRightLegBasePosition[2], centerRightLegBasePosition[3], centerRightLegBasePosition[6],
        centerRightLegBasePosition[6], centerRightLegBasePosition[3], centerRightLegBasePosition[7]
    ];

    const centerCenterLegVec4Complete = [
        // front
        centerCenterLegBasePosition[0], centerCenterLegBasePosition[1], centerCenterLegBasePosition[2],
        centerCenterLegBasePosition[2], centerCenterLegBasePosition[1], centerCenterLegBasePosition[3],
        // right
        centerCenterLegBasePosition[4], centerCenterLegBasePosition[0], centerCenterLegBasePosition[6],
        centerCenterLegBasePosition[6], centerCenterLegBasePosition[0], centerCenterLegBasePosition[2],
        // back
        centerCenterLegBasePosition[5], centerCenterLegBasePosition[4], centerCenterLegBasePosition[7],
        centerCenterLegBasePosition[7], centerCenterLegBasePosition[4], centerCenterLegBasePosition[6],
        // left
        centerCenterLegBasePosition[1], centerCenterLegBasePosition[5], centerCenterLegBasePosition[3],
        centerCenterLegBasePosition[3], centerCenterLegBasePosition[5], centerCenterLegBasePosition[7],
        // top
        centerCenterLegBasePosition[4], centerCenterLegBasePosition[5], centerCenterLegBasePosition[0],
        centerCenterLegBasePosition[0], centerCenterLegBasePosition[5], centerCenterLegBasePosition[1],
        // bottom
        centerCenterLegBasePosition[2], centerCenterLegBasePosition[3], centerCenterLegBasePosition[6],
        centerCenterLegBasePosition[6], centerCenterLegBasePosition[3], centerCenterLegBasePosition[7]
    ];

    const centerLeftLegVec4Complete = [
        // front
        centerLeftLegBasePosition[0], centerLeftLegBasePosition[1], centerLeftLegBasePosition[2],
        centerLeftLegBasePosition[2], centerLeftLegBasePosition[1], centerLeftLegBasePosition[3],
        // right
        centerLeftLegBasePosition[4], centerLeftLegBasePosition[0], centerLeftLegBasePosition[6],
        centerLeftLegBasePosition[6], centerLeftLegBasePosition[0], centerLeftLegBasePosition[2],
        // back
        centerLeftLegBasePosition[5], centerLeftLegBasePosition[4], centerLeftLegBasePosition[7],
        centerLeftLegBasePosition[7], centerLeftLegBasePosition[4], centerLeftLegBasePosition[6],
        // left
        centerLeftLegBasePosition[1], centerLeftLegBasePosition[5], centerLeftLegBasePosition[3],
        centerLeftLegBasePosition[3], centerLeftLegBasePosition[5], centerLeftLegBasePosition[7],
        // top
        centerLeftLegBasePosition[4], centerLeftLegBasePosition[5], centerLeftLegBasePosition[0],
        centerLeftLegBasePosition[0], centerLeftLegBasePosition[5], centerLeftLegBasePosition[1],
        // bottom
        centerLeftLegBasePosition[2], centerLeftLegBasePosition[3], centerLeftLegBasePosition[6],
        centerLeftLegBasePosition[6], centerLeftLegBasePosition[3], centerLeftLegBasePosition[7]
    ];

    const backRightLegVec4Complete = [
        // front
        backRightLegBasePosition[0], backRightLegBasePosition[1], backRightLegBasePosition[2],
        backRightLegBasePosition[2], backRightLegBasePosition[1], backRightLegBasePosition[3],
        // right
        backRightLegBasePosition[4], backRightLegBasePosition[0], backRightLegBasePosition[6],
        backRightLegBasePosition[6], backRightLegBasePosition[0], backRightLegBasePosition[2],
        // back
        backRightLegBasePosition[5], backRightLegBasePosition[4], backRightLegBasePosition[7],
        backRightLegBasePosition[7], backRightLegBasePosition[4], backRightLegBasePosition[6],
        // left
        backRightLegBasePosition[1], backRightLegBasePosition[5], backRightLegBasePosition[3],
        backRightLegBasePosition[3], backRightLegBasePosition[5], backRightLegBasePosition[7],
        // top
        backRightLegBasePosition[4], backRightLegBasePosition[5], backRightLegBasePosition[0],
        backRightLegBasePosition[0], backRightLegBasePosition[5], backRightLegBasePosition[1],
        // bottom
        backRightLegBasePosition[2], backRightLegBasePosition[3], backRightLegBasePosition[6],
        backRightLegBasePosition[6], backRightLegBasePosition[3], backRightLegBasePosition[7]
    ];

    const backCenterLegVec4Complete = [
        // front
        backCenterLegBasePosition[0], backCenterLegBasePosition[1], backCenterLegBasePosition[2],
        backCenterLegBasePosition[2], backCenterLegBasePosition[1], backCenterLegBasePosition[3],
        // right
        backCenterLegBasePosition[4], backCenterLegBasePosition[0], backCenterLegBasePosition[6],
        backCenterLegBasePosition[6], backCenterLegBasePosition[0], backCenterLegBasePosition[2],
        // back
        backCenterLegBasePosition[5], backCenterLegBasePosition[4], backCenterLegBasePosition[7],
        backCenterLegBasePosition[7], backCenterLegBasePosition[4], backCenterLegBasePosition[6],
        // left
        backCenterLegBasePosition[1], backCenterLegBasePosition[5], backCenterLegBasePosition[3],
        backCenterLegBasePosition[3], backCenterLegBasePosition[5], backCenterLegBasePosition[7],
        // top
        backCenterLegBasePosition[4], backCenterLegBasePosition[5], backCenterLegBasePosition[0],
        backCenterLegBasePosition[0], backCenterLegBasePosition[5], backCenterLegBasePosition[1],
        // bottom
        backCenterLegBasePosition[2], backCenterLegBasePosition[3], backCenterLegBasePosition[6],
        backCenterLegBasePosition[6], backCenterLegBasePosition[3], backCenterLegBasePosition[7]
    ];

    const backLeftLegVec4Complete = [
        // front
        backLeftLegBasePosition[0], backLeftLegBasePosition[1], backLeftLegBasePosition[2],
        backLeftLegBasePosition[2], backLeftLegBasePosition[1], backLeftLegBasePosition[3],
        // right
        backLeftLegBasePosition[4], backLeftLegBasePosition[0], backLeftLegBasePosition[6],
        backLeftLegBasePosition[6], backLeftLegBasePosition[0], backLeftLegBasePosition[2],
        // back
        backLeftLegBasePosition[5], backLeftLegBasePosition[4], backLeftLegBasePosition[7],
        backLeftLegBasePosition[7], backLeftLegBasePosition[4], backLeftLegBasePosition[6],
        // left
        backLeftLegBasePosition[1], backLeftLegBasePosition[5], backLeftLegBasePosition[3],
        backLeftLegBasePosition[3], backLeftLegBasePosition[5], backLeftLegBasePosition[7],
        // top
        backLeftLegBasePosition[4], backLeftLegBasePosition[5], backLeftLegBasePosition[0],
        backLeftLegBasePosition[0], backLeftLegBasePosition[5], backLeftLegBasePosition[1],
        // bottom
        backLeftLegBasePosition[2], backLeftLegBasePosition[3], backLeftLegBasePosition[6],
        backLeftLegBasePosition[6], backLeftLegBasePosition[3], backLeftLegBasePosition[7]
    ];

    const legTexCoordsComplete = [
        // front
        legBaseFrontTexCoords[0], legBaseFrontTexCoords[1], legBaseFrontTexCoords[2],
        legBaseFrontTexCoords[2], legBaseFrontTexCoords[1], legBaseFrontTexCoords[3],
        // right
        legBaseRightTexCoords[0], legBaseRightTexCoords[1], legBaseRightTexCoords[2],
        legBaseRightTexCoords[2], legBaseRightTexCoords[1], legBaseRightTexCoords[3],
        // back
        legBaseBackTexCoords[0], legBaseBackTexCoords[1], legBaseBackTexCoords[2],
        legBaseBackTexCoords[2], legBaseBackTexCoords[1], legBaseRightTexCoords[3],
        // left
        legBaseLeftTexCoords[0], legBaseLeftTexCoords[1], legBaseLeftTexCoords[2],
        legBaseLeftTexCoords[2], legBaseLeftTexCoords[1], legBaseLeftTexCoords[3],
        // top
        legBaseTopTexCoords[0], legBaseTopTexCoords[1], legBaseTopTexCoords[2],
        legBaseTopTexCoords[2], legBaseTopTexCoords[1], legBaseTopTexCoords[3],
        // bottom
        legBaseBottomTexCoords[2], legBaseBottomTexCoords[3], legBaseBottomTexCoords[0],
        legBaseBottomTexCoords[0], legBaseBottomTexCoords[3], legBaseBottomTexCoords[1]
    ];

    const headComponent = new Component(
        "Head",
        MathUtil.multiplyMat4byVec4Array(Mat4.scale(20,20,20), headVec4Complete),
        headTexCoordsComplete
    );
    const rightFrontLegComponent = new Component(
        "Right Front Leg",
        MathUtil.multiplyMat4byVec4Array(Mat4.scale(20,20,20), frontRightLegVec4Complete),
        legTexCoordsComplete
    );
    const centerFrontLegComponent = new Component(
        "Center Front Leg",
        MathUtil.multiplyMat4byVec4Array(Mat4.scale(20,20,20), frontCenterLegVec4Complete),
        legTexCoordsComplete
    );
    const leftFrontLegComponent = new Component(
        "Left Front Leg",
        MathUtil.multiplyMat4byVec4Array(Mat4.scale(20,20,20), frontLeftLegVec4Complete),
        legTexCoordsComplete
    );
    const rightCenterLegComponent = new Component(
        "Right Center Leg",
        MathUtil.multiplyMat4byVec4Array(Mat4.scale(20,20,20), centerRightLegVec4Complete),
        legTexCoordsComplete
    );
    const centerCenterLegComponent = new Component(
        "Center Center Leg",
        MathUtil.multiplyMat4byVec4Array(Mat4.scale(20,20,20), centerCenterLegVec4Complete),
        legTexCoordsComplete
    );
    const leftCenterLegComponent = new Component(
        "Left Center Leg",
        MathUtil.multiplyMat4byVec4Array(Mat4.scale(20,20,20), centerLeftLegVec4Complete),
        legTexCoordsComplete
    );
    const rightBackLegComponent = new Component(
        "Right Back Leg",
        MathUtil.multiplyMat4byVec4Array(Mat4.scale(20,20,20), backRightLegVec4Complete),
        legTexCoordsComplete
    )
    const centerBackLegComponent = new Component(
        "Center Back Leg",
        MathUtil.multiplyMat4byVec4Array(Mat4.scale(20,20,20), backCenterLegVec4Complete),
        legTexCoordsComplete
    );
    const leftBackLegComponent = new Component(
        "Left Back Leg",
        MathUtil.multiplyMat4byVec4Array(Mat4.scale(20,20,20), backLeftLegVec4Complete),
        legTexCoordsComplete
    );

    //TODO : animation
    
    headComponent.addChild(rightFrontLegComponent);
    headComponent.addChild(centerFrontLegComponent);
    headComponent.addChild(leftFrontLegComponent);
    headComponent.addChild(rightCenterLegComponent);
    headComponent.addChild(centerCenterLegComponent);
    headComponent.addChild(leftCenterLegComponent);
    headComponent.addChild(rightBackLegComponent);
    headComponent.addChild(centerBackLegComponent);
    headComponent.addChild(leftBackLegComponent);
    ghast.addComponent(headComponent);

    return ghast;
}

const ghastToDownloadedJSON = () => {
    const componentSaver = ghastGenerator();
    const componentSaverJSON = JSON.stringify(componentSaver);
    const blob = new Blob([componentSaverJSON], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = "ghast.json";
    link.href = url;
    link.click()
}

export {ghastGenerator, ghastToDownloadedJSON}