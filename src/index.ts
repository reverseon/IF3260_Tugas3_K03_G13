import "./css/style.css";
import {CameraMode, CameraSettings} from "./model/Camera";
import {Vec4} from "./model/Vec4";
import {Mat4} from "./model/Mat4";
import {createProgramFromSources, getWebGLContext, resizeCanvas} from "./model/GLUtil";
import {MathUtil} from "./util/MathUtil";
import {Component} from "./model/Component";

let isFirstRun = true;
const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec4 a_normal;
    attribute vec4 a_color;

    uniform mat4 u_worldViewProjection;
    uniform mat4 u_world;

    varying vec3 v_normal;
    varying vec4 v_color;

    void main() {
      gl_Position = u_worldViewProjection * a_position;
      v_normal = mat3(u_world) * a_normal.xyz;
      v_color = a_color;
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    
    varying vec3 v_normal;
    varying vec4 v_color;
    
    uniform vec3 u_reverseLightDirection;
    uniform bool u_shading;
    
    void main() {
      vec3 normal = normalize(v_normal);
      float light = dot(normal, u_reverseLightDirection);
      gl_FragColor = v_color;
      if (u_shading) {
          gl_FragColor.rgb *= light;
      }
    }
`;



const render =
    (
        gl: WebGLRenderingContext,
        program: WebGLProgram,
        camera: CameraSettings,
        components: Component[],
    ): void => {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    // attribute
    const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
    const normalAttributeLocation = gl.getAttribLocation(program, 'a_normal');
    // uniform
    const worldViewProjectionUniformLocation = gl.getUniformLocation(program, 'u_worldViewProjection');
    const worldUniformLocation = gl.getUniformLocation(program, 'u_world');
    const reverseLightDirectionUniformLocation = gl.getUniformLocation(program, 'u_reverseLightDirection');
    const shadingUniformLocation = gl.getUniformLocation(program, 'u_shading');
    // buffer
    const positionBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();
    const normalBuffer = gl.createBuffer();
    for (let i = 0; i < components.length; i++) {
        const component = components[i];
        const position = component.positionArray;
        const color = component.colorArray;
        const world = component.worldMatrix;
        // position
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, MathUtil.makeFloat32ArrayFromVec4Array(position), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 4, gl.FLOAT, false, 0, 0);
        // color
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, MathUtil.makeFloat32ArrayFromVec4Array(color), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(colorAttributeLocation);
        gl.vertexAttribPointer(colorAttributeLocation, 4, gl.FLOAT, false, 0, 0);
        // normal
        const normal = MathUtil.makeNormalArray(position);
        if (normal.length !== position.length) {
            throw new Error('normal.length !== Position.length');
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, MathUtil.makeFloat32ArrayFromVec4Array(normal), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(normalAttributeLocation);
        gl.vertexAttribPointer(normalAttributeLocation, 4, gl.FLOAT, false, 0, 0);
        // uniform
        const viewMatrix = camera.getViewMatrix();
        const projectionMatrix = camera.getProjectionMatrix();
        const worldViewProjectionMatrix = projectionMatrix.mul(viewMatrix).mul(world);
        console.log("worldMatrix");
        world.print();
        console.log("viewMatrix");
        viewMatrix.print();
        console.log("projectionMatrix");
        projectionMatrix.print();
        console.log("worldViewProjectionMatrix");
        worldViewProjectionMatrix.print();
        gl.uniformMatrix4fv(worldViewProjectionUniformLocation, false, worldViewProjectionMatrix.toFloat32Array());
        gl.uniformMatrix4fv(worldUniformLocation, false, world.toFloat32Array());
        gl.uniform3fv(reverseLightDirectionUniformLocation, camera.light.xyz.normalize().toFloat32Array());
        gl.uniform1i(shadingUniformLocation, camera.shading ? 1 : 0);
        gl.drawArrays(gl.TRIANGLES, 0, position.length);
    }
}

// const perspectiveModeDefaultPosition = [0, 300, 500, 0];
// const orthographicModeDefaultPosition = [0, 50, 100, 0];
// const obliqueModeDefaultPosition = [0, 50, 100, 0]

const zPerspective = 1000;
const zOrthographic = 100;
const togglePerspectiveMode = (gl: WebGLRenderingContext, camera: CameraSettings): void => {
    camera.setPerspectiveMode(
        60 * Math.PI / 180,
        gl.canvas.width / gl.canvas.height,
        1,
        4000,
        new Vec4([1, 1, 1, 1]),
        CURRENTCOMPONENT.center,
        new Vec4([300, 300, zPerspective, 0]),
    );
}

const toggleOrthographicMode = (gl: WebGLRenderingContext, camera: CameraSettings): void => {
    console.log(gl.canvas)
    camera.setOrthographicMode(
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width,
        new Vec4([1, 1, 1, 1]),
        CURRENTCOMPONENT.center,
        new Vec4( [200, 200, zOrthographic, 0] ),
    );
}

const toggleObliqueMode = (gl: WebGLRenderingContext, camera: CameraSettings): void => {
    camera.setObliqueMode(
        60 * Math.PI / 180,
        270 * Math.PI / 180,
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width,
        new Vec4([1,1,1,1]),
        CURRENTCOMPONENT.center,
        new Vec4([200, 200, zOrthographic, 0]),
    );
}

const resetCamParams = (gl: WebGLRenderingContext, camera: CameraSettings, mode: CameraMode): void => {
    camera.shading = true;
    camera.rotationRad.y = 0;
    switch (mode) {
        case CameraMode.Perspective:
            togglePerspectiveMode(gl, camera);
            break;
        case CameraMode.Orthographic:
            toggleOrthographicMode(gl, camera);
            break;
        case CameraMode.Oblique:
            toggleObliqueMode(gl, camera);
            break;
        default:
            throw new Error('invalid mode');
    }
}

let CURRENTCOMPONENT: Component;

const main = async (): Promise<void> => {
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
    const frontColor = new Vec4([1, 0, 0, 1]); // red
    const rightColor = new Vec4([0, 1, 0, 1]); // green
    const backColor = new Vec4([0, 0, 1, 1]); // blue
    const leftColor = new Vec4([1, 1, 0, 1]); // yellow
    const topColor = new Vec4([1, 0, 1, 1]); // purple
    const bottomColor = new Vec4([0, 1, 1, 1]); // cyan
    const completeColor: Vec4[] = [
        // front
        ...[frontColor, frontColor, frontColor],
        ...[frontColor, frontColor, frontColor],
        // right
        ...[rightColor, rightColor, rightColor],
        ...[rightColor, rightColor, rightColor],
        // back
        ...[backColor, backColor, backColor],
        ...[backColor, backColor, backColor],
        // left
        ...[leftColor, leftColor, leftColor],
        ...[leftColor, leftColor, leftColor],
        // top
        ...[topColor, topColor, topColor],
        ...[topColor, topColor, topColor],
        // bottom
        ...[bottomColor, bottomColor, bottomColor],
        ...[bottomColor, bottomColor, bottomColor],
    ];

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const gl = getWebGLContext(canvas);
    // resizeCanvas(gl.canvas as HTMLCanvasElement);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    const program = createProgramFromSources(gl, vertexShaderSource, fragmentShaderSource)
    gl.useProgram(program);
    const myCube = new Component("Parent", completePosition, completeColor);
    CURRENTCOMPONENT = myCube;
    const camera = new CameraSettings();
    togglePerspectiveMode(gl, camera);
    // camera.translation.z = 500;
    // camera.translation.y = 300;
    const world = Mat4.scale(1,1, 1)
    const lookAtCurrentComponent = document.getElementById('lookat-current-component-checkbox') as HTMLInputElement;
    const renderWrapper = (cpnts: Component[]) => {
        // update camera center to current component
        if (lookAtCurrentComponent.checked) {
            camera.centeredAt = CURRENTCOMPONENT.center;
        } else {
            camera.centeredAt = new Vec4([0,0,0,1]);
        }
        render(
            gl,
            program,
            camera,
            cpnts
        )
    }
    renderWrapper([myCube]);

    // cam setup listener

    const projectionMode = document.getElementById('projection-select') as HTMLSelectElement;
    const camYRotationSlider = document.getElementById('cam-y-rotation-slider') as HTMLInputElement;
    const camRadiusSlider = document.getElementById('cam-radius-slider') as HTMLInputElement;
    const camShading = document.getElementById('shading-checkbox') as HTMLInputElement;
    const camReset = document.getElementById('cam-reset-button') as HTMLButtonElement;
    lookAtCurrentComponent.addEventListener('change', () => {
        renderWrapper([myCube]);
    });

    projectionMode.addEventListener('change', () => {
        switch (projectionMode.value) {
            case 'perspective':
                togglePerspectiveMode(gl, camera);
                camYRotationSlider.valueAsNumber = 0;
                camRadiusSlider.valueAsNumber = 1;
                camera.rotationRad.y = 0;
                break;
            case 'orthographic':
                toggleOrthographicMode(gl, camera);
                camYRotationSlider.valueAsNumber = 0;
                camRadiusSlider.valueAsNumber = 1;
                camera.rotationRad.y = 0;
                break;
            case 'oblique':
                toggleObliqueMode(gl, camera);
                camYRotationSlider.valueAsNumber = 0;
                camRadiusSlider.valueAsNumber = 1;
                camera.rotationRad.y = 0;
                break;
            default:
                throw new Error('invalid mode');
        }
        renderWrapper([myCube]);
    })
    camYRotationSlider.addEventListener('input', () => {
        camera.rotationRad.y = camYRotationSlider.valueAsNumber * Math.PI / 180;
        renderWrapper([myCube]);
    })
    camRadiusSlider.addEventListener('input', () => {
        switch (projectionMode.value) {
            case 'perspective':
                camera.translation.z = zPerspective + camRadiusSlider.valueAsNumber;
                break;
            case 'orthographic':
                camera.translation.z = zOrthographic + camRadiusSlider.valueAsNumber;
                break;
            case 'oblique':
                camera.translation.z = zOrthographic + camRadiusSlider.valueAsNumber;
        }
        renderWrapper([myCube]);
    })
    camShading.addEventListener('change', () => {
        camera.shading = camShading.checked;
        renderWrapper([myCube]);
    })
    camReset.addEventListener('click', () => {
        camYRotationSlider.value = '0';
        camRadiusSlider.value = '1';
        camShading.checked = true;
        lookAtCurrentComponent.checked = true;
        switch (projectionMode.value) {
            case 'perspective':
                resetCamParams(gl, camera, CameraMode.Perspective);
                break;
            case 'orthographic':
                resetCamParams(gl, camera, CameraMode.Orthographic);
                break;
            case 'oblique':
                resetCamParams(gl, camera, CameraMode.Oblique);
                break;
        }
        renderWrapper([myCube]);
    })
    // component transformation listener
    // component rotation
    const comXRotSlider = document.getElementById('component-x-rotation-slider') as HTMLInputElement;
    const comYRotSlider = document.getElementById('component-y-rotation-slider') as HTMLInputElement;
    const comZRotSlider = document.getElementById('component-z-rotation-slider') as HTMLInputElement;
    // component translation
    const comXTransSlider = document.getElementById('component-x-translation-slider') as HTMLInputElement;
    const comYTransSlider = document.getElementById('component-y-translation-slider') as HTMLInputElement;
    const comZTransSlider = document.getElementById('component-z-translation-slider') as HTMLInputElement;
    // component scale
    const comScaleSlider = document.getElementById('component-scale-slider') as HTMLInputElement;
    // component reset
    const comReset = document.getElementById('component-reset-button') as HTMLButtonElement;
    // add listener
    comXRotSlider.addEventListener('input', () => {
        CURRENTCOMPONENT.rotationRad.x = comXRotSlider.valueAsNumber * Math.PI / 180;
        renderWrapper([myCube]);
    })
    comYRotSlider.addEventListener('input', () => {
        CURRENTCOMPONENT.rotationRad.y = comYRotSlider.valueAsNumber * Math.PI / 180;
        renderWrapper([myCube]);
    })
    comZRotSlider.addEventListener('input', () => {
        CURRENTCOMPONENT.rotationRad.z = comZRotSlider.valueAsNumber * Math.PI / 180;
        renderWrapper([myCube]);
    })
    comXTransSlider.addEventListener('input', () => {
        CURRENTCOMPONENT.translation.x = comXTransSlider.valueAsNumber;
        renderWrapper([myCube]);
    })
    comYTransSlider.addEventListener('input', () => {
        CURRENTCOMPONENT.translation.y = comYTransSlider.valueAsNumber;
        renderWrapper([myCube]);
    })
    comZTransSlider.addEventListener('input', () => {
        CURRENTCOMPONENT.translation.z = comZTransSlider.valueAsNumber;
        renderWrapper([myCube]);
    })
    comScaleSlider.addEventListener('input', () => {
        CURRENTCOMPONENT.scale = new Vec4([comScaleSlider.valueAsNumber, comScaleSlider.valueAsNumber, comScaleSlider.valueAsNumber, 1]);
        renderWrapper([myCube]);
    })
    comReset.addEventListener('click', () => {
        comXRotSlider.value = '0';
        comYRotSlider.value = '0';
        comZRotSlider.value = '0';
        comXTransSlider.value = '0';
        comYTransSlider.value = '0';
        comZTransSlider.value = '0';
        comScaleSlider.value = '1';
        CURRENTCOMPONENT.reset();
        renderWrapper([myCube]);
    })

}

main().then(() => {
    console.log('Done');
})