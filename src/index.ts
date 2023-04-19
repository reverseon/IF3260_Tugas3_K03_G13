import "./css/style.css";
import {CameraMode, CameraSettings} from "./model/Camera";
import {Vec4} from "./model/Vec4";
import {Mat4} from "./model/Mat4";
import {createProgramFromSources, getWebGLContext, resizeCanvas} from "./model/GLUtil";
import {MathUtil} from "./util/MathUtil";
import {Component, ComponentSaver} from "./model/Component";
import Tex from "../shape/texture/tex_placeholder.jpg";
import {Vec2} from "./model/Vec2";
import {downloadToSaveJSON} from "./model_generator/example_model";
import ExampleModel from "../shape/example_model.json";
import creeperGenerator, {creeperToDownloadedJSON} from "./model_generator/creeper_generator";
import steveGenerator, {steveToDownloadedJSON} from "./model_generator/steve_generator";
import ghastGenerator, {ghastToDownloadedJSON} from "./model_generator/ghast_generator";
import pigGenerator from "./model_generator/pig_model";

let isFirstRun = true;
const vertexShaderSource = `
    attribute vec4 a_position;
    attribute vec2 a_texcoord;
    attribute vec4 a_normal;

    uniform mat4 u_worldViewProjection;
    uniform mat4 u_world;

    varying vec3 v_normal;
    varying vec2 v_texcoord;

    void main() {
      gl_Position = u_worldViewProjection * a_position;
      v_normal = mat3(u_world) * a_normal.xyz;
      v_texcoord = a_texcoord;
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    
    varying vec3 v_normal;
    varying vec2 v_texcoord;
    
    uniform vec3 u_reverseLightDirection;
    uniform bool u_shading;
    uniform sampler2D u_texture;
    
    void main() {
      vec3 normal = normalize(v_normal);
      float light = dot(normal, u_reverseLightDirection);
      gl_FragColor = texture2D(u_texture, v_texcoord);
      if (u_shading) {
          gl_FragColor.rgb *= light;
      }
    }
`;


const renderSingleShape = (
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    camera: CameraSettings,
    component: Component,
    attribLocations: {
        position: number,
        texcoord: number,
        normal: number,
    },
    uniformLocations: {
        worldViewProjection: WebGLUniformLocation,
        world: WebGLUniformLocation,
        reverseLightDirection: WebGLUniformLocation,
        shading: WebGLUniformLocation,
    },
    buffers: {
        position: WebGLBuffer,
        normal: WebGLBuffer,
        texcoord: WebGLBuffer,
    },
    prevWorldMatrix: Mat4,

): void => {
    const position = component.positionArray;
    const texCoord = component.texCoordArray;
    const world = prevWorldMatrix.mul(component.worldMatrix);
    // position
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.bufferData(gl.ARRAY_BUFFER, MathUtil.makeFloat32ArrayFromVec4Array(position), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(attribLocations.position);
    gl.vertexAttribPointer(attribLocations.position, 4, gl.FLOAT, false, 0, 0);
    // texcoord
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.texcoord);
    gl.bufferData(gl.ARRAY_BUFFER, MathUtil.makeFloat32ArrayFromVec2Array(texCoord), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(attribLocations.texcoord);
    gl.vertexAttribPointer(attribLocations.texcoord, 2, gl.FLOAT, false, 0, 0);
    // normal
    const normal = MathUtil.makeNormalArray(position);
    if (normal.length !== position.length) {
        throw new Error('normal.length !== Position.length');
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
    gl.bufferData(gl.ARRAY_BUFFER, MathUtil.makeFloat32ArrayFromVec4Array(normal), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(attribLocations.normal);
    gl.vertexAttribPointer(attribLocations.normal, 4, gl.FLOAT, false, 0, 0);
    // uniform
    const viewMatrix = camera.getViewMatrix();
    const projectionMatrix = camera.getProjectionMatrix();
    const worldViewProjectionMatrix = projectionMatrix.mul(viewMatrix).mul(world);
    // console.log("worldMatrix");
    // world.print();
    // console.log("viewMatrix");
    // viewMatrix.print();
    // console.log("projectionMatrix");
    // projectionMatrix.print();
    // console.log("worldViewProjectionMatrix");
    // worldViewProjectionMatrix.print();
    gl.uniformMatrix4fv(uniformLocations.worldViewProjection, false, worldViewProjectionMatrix.toFloat32Array());
    gl.uniformMatrix4fv(uniformLocations.world, false, world.toFloat32Array());
    gl.uniform3fv(uniformLocations.reverseLightDirection, camera.light.xyz.normalize().toFloat32Array());
    gl.uniform1i(uniformLocations.shading, camera.shading ? 1 : 0);
    gl.drawArrays(gl.TRIANGLES, 0, position.length);
    // console.log("glPosition");
    // console.log(MathUtil.multiplyMat4byVec4Array(worldViewProjectionMatrix, position));
}


const render =
    (
        gl: WebGLRenderingContext,
        program: WebGLProgram,
        camera: CameraSettings,
        compSaver: ComponentSaver,
    ): void => {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        // attribute
        const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
        const texcoordAttributeLocation = gl.getAttribLocation(program, 'a_texcoord');
        const normalAttributeLocation = gl.getAttribLocation(program, 'a_normal');
        // uniform
        const worldViewProjectionUniformLocation = gl.getUniformLocation(program, 'u_worldViewProjection');
        const worldUniformLocation = gl.getUniformLocation(program, 'u_world');
        const reverseLightDirectionUniformLocation = gl.getUniformLocation(program, 'u_reverseLightDirection');
        const shadingUniformLocation = gl.getUniformLocation(program, 'u_shading');
        const textureUniformLocation = gl.getUniformLocation(program, 'u_texture');
        gl.uniform1i(textureUniformLocation, 0)
        // buffer
        const positionBuffer = gl.createBuffer();
        const texcoordBuffer = gl.createBuffer();
        const normalBuffer = gl.createBuffer();
        const rssWrap = (cmp: Component, pwMat: Mat4): void => {
            renderSingleShape(
                gl,
                program,
                camera,
                cmp,
                {
                    position: positionAttributeLocation,
                    texcoord: texcoordAttributeLocation,
                    normal: normalAttributeLocation,
                },
                {
                    worldViewProjection: worldViewProjectionUniformLocation!,
                    world: worldUniformLocation!,
                    reverseLightDirection: reverseLightDirectionUniformLocation!,
                    shading: shadingUniformLocation!,
                },
                {
                    position: positionBuffer!,
                    normal: normalBuffer!,
                    texcoord: texcoordBuffer!,
                },
                pwMat,
            );
        }
        const recursiveRender = (cmp: Component, pwm: Mat4): void => {
            // bind texture here
            rssWrap(cmp, pwm);
            if (cmp.isThereAChild()) {
                const children = cmp.children
                for (let i = 0; i < children!.length; i++) {
                    recursiveRender(children![i], pwm.mul(cmp.worldMatrix));
                }
            }
        }
        const components = compSaver.topLevelComponents;
        for (let i = 0; i < components.length; i++) {
            const pwm = components[i].worldMatrix;
            recursiveRender(components[i], pwm);
        }
}

const isPowerOf2 = (value: number): boolean => {
    return (value & (value - 1)) === 0;
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
        new Vec4([300, 300, zPerspective, 0]),
    );
}

const toggleOrthographicMode = (gl: WebGLRenderingContext, camera: CameraSettings): void => {
    // console.log(gl.canvas)
    camera.setOrthographicMode(
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width,
        new Vec4([1, 1, 1, 1]),
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

const setTexturesFromComponentSaver = async (gl: WebGLRenderingContext, compSaver: ComponentSaver): Promise<void> => {
    const imgloadPromise = new Promise (resolve => {
        const img = new Image();
        img.src = compSaver.texturePath;
        img.onload = function () {
            const texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            if (isPowerOf2(img.width) && isPowerOf2(img.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                // repeat
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
            }
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            resolve(0);
        }
    })
    await imgloadPromise;
}

const loadModelJson = async (gl: WebGLRenderingContext, json: any): Promise<ComponentSaver> => {
    // this json is from JSON.stringify(ComponentSaver), write to get back
    const newComponentSaver = ComponentSaver.loadfromJSON(json);
    await setTexturesFromComponentSaver(gl, newComponentSaver);
    return newComponentSaver;
}

const main = async (): Promise<void> => {
    // console.log(ExampleModel)
    let toRender: ComponentSaver | undefined = undefined;
    let currentComponent: Component;


    // MAIN PROGRAM START //

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const gl = getWebGLContext(canvas);

    // INITIALIZATION //

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    const program = createProgramFromSources(gl, vertexShaderSource, fragmentShaderSource)
    gl.useProgram(program);

    // LOADING MODEL & ITS TEXTURE //

    toRender = pigGenerator();
    await setTexturesFromComponentSaver(gl, toRender)
    currentComponent = toRender.topLevelComponents[0];
    // console.log("toRender:", toRender)
    // console.log("currentComponent:", currentComponent)

    const camera = new CameraSettings();
    togglePerspectiveMode(gl, camera);

    const lookAtCurrentComponent = document.getElementById('lookat-current-component-checkbox') as HTMLInputElement;


    const reRender = () => {
        // update camera center to current component
        if (lookAtCurrentComponent.checked) {
            camera.centeredAt = currentComponent.center;
        } else {
            camera.centeredAt = new Vec4([0,0,0,1]);
        }
        render(gl, program, camera, toRender!)
    }

    reRender()

    const modelSelection = document.getElementById("character-select") as HTMLSelectElement;
    modelSelection.addEventListener("change", async () => {
        comXRotSlider.value = '0';
        comYRotSlider.value = '0';
        comZRotSlider.value = '0';
        comXTransSlider.value = '0';
        comYTransSlider.value = '0';
        comZTransSlider.value = '0';
        comScaleXSlider.value = '1';
        comScaleYSlider.value = '1';
        comScaleZSlider.value = '1';
        switch (modelSelection.value) {
            case 'steve':
                toRender = steveGenerator();
                break;
            case 'creeper':
                toRender = creeperGenerator();
                break;
            case 'pig':
                toRender = pigGenerator();
            case 'ghast':
                toRender = ghastGenerator();
                break;
            default:
                throw new Error('invalid model');
        }
        currentComponent.resetTransformation();
        await setTextures(toRender);
        currentComponent = toRender.topLevelComponents[0];
        reRender();
    })

    async function setTextures(toRender: ComponentSaver) {
        await setTexturesFromComponentSaver(gl, toRender)
    }

    // cam setup listener

    const projectionMode = document.getElementById('projection-select') as HTMLSelectElement;
    const camYRotationSlider = document.getElementById('cam-y-rotation-slider') as HTMLInputElement;
    const camRadiusSlider = document.getElementById('cam-radius-slider') as HTMLInputElement;
    const camShading = document.getElementById('shading-checkbox') as HTMLInputElement;
    const camReset = document.getElementById('cam-reset-button') as HTMLButtonElement;
    lookAtCurrentComponent.addEventListener('change', () => {
        reRender();
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
        reRender();
    })
    camYRotationSlider.addEventListener('input', () => {
        camera.rotationRad.y = camYRotationSlider.valueAsNumber * Math.PI / 180;
        reRender();
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
        reRender();
    })
    camShading.addEventListener('change', () => {
        camera.shading = camShading.checked;
        reRender();
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
        reRender();
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
    const comScaleXSlider = document.getElementById('component-scale-x-slider') as HTMLInputElement;
    const comScaleYSlider = document.getElementById('component-scale-y-slider') as HTMLInputElement;
    const comScaleZSlider = document.getElementById('component-scale-z-slider') as HTMLInputElement;
    // component reset
    const comReset = document.getElementById('component-reset-button') as HTMLButtonElement;
    // add listener
    comXRotSlider.addEventListener('input', () => {
        currentComponent.rotationRad.x = comXRotSlider.valueAsNumber * Math.PI / 180;
        reRender();
    })
    comYRotSlider.addEventListener('input', () => {
        currentComponent.rotationRad.y = comYRotSlider.valueAsNumber * Math.PI / 180;
        reRender();
    })
    comZRotSlider.addEventListener('input', () => {
        currentComponent.rotationRad.z = comZRotSlider.valueAsNumber * Math.PI / 180;
        reRender();
    })
    comXTransSlider.addEventListener('input', () => {
        currentComponent.translation.x = comXTransSlider.valueAsNumber;
        reRender();
    })
    comYTransSlider.addEventListener('input', () => {
        currentComponent.translation.y = comYTransSlider.valueAsNumber;
        reRender();
    })
    comZTransSlider.addEventListener('input', () => {
        currentComponent.translation.z = comZTransSlider.valueAsNumber;
        reRender();
    })
    comScaleXSlider.addEventListener('input', () => {
        currentComponent.scale.x = comScaleXSlider.valueAsNumber;
        reRender();
    })
    comScaleYSlider.addEventListener('input', () => {
        currentComponent.scale.y = comScaleYSlider.valueAsNumber;
        reRender();
    })
    comScaleZSlider.addEventListener('input', () => {
        currentComponent.scale.z = comScaleZSlider.valueAsNumber;
        reRender();
    })
    comReset.addEventListener('click', () => {
        comXRotSlider.value = '0';
        comYRotSlider.value = '0';
        comZRotSlider.value = '0';
        comXTransSlider.value = '0';
        comYTransSlider.value = '0';
        comZTransSlider.value = '0';
        comScaleXSlider.value = '1';
        comScaleYSlider.value = '1';
        comScaleZSlider.value = '1';
        currentComponent.resetTransformation();
        reRender();
    })

    // component tree
    const componentName = document.getElementById('component-name') as HTMLSpanElement;
    componentName.innerText = currentComponent.name;
    const componentTree = document.getElementById('component-tree') as HTMLUListElement;
    const treeListenerArray: (() => void)[] = [];
    componentTree.addEventListener('click', (e) => {
        const target = e.target as HTMLLIElement;
        if (target.id) {
            try {
                treeListenerArray[parseInt(target.id)]();
            } catch (e) {}
        }
    })
    const updateComponentTree = () => {
        // update component-tree based on toRender
        componentTree.innerHTML = '';
        const appendForComponentArray = (componentArray: Component[], parent: HTMLUListElement) => {
            // console.log("componentArray", componentArray)
            componentArray.forEach(component => {
                // console.log("component", component.name)
                const li = document.createElement('li');
                li.innerText = component.name;
                li.id = treeListenerArray.length.toString();
                const listener = () => {
                    currentComponent = component;
                    componentName.innerText = currentComponent.name;
                    // update sliders
                    comXRotSlider.valueAsNumber = currentComponent.rotationRad.x * 180 / Math.PI;
                    comYRotSlider.valueAsNumber = currentComponent.rotationRad.y * 180 / Math.PI;
                    comZRotSlider.valueAsNumber = currentComponent.rotationRad.z * 180 / Math.PI;
                    comXTransSlider.valueAsNumber = currentComponent.translation.x;
                    comYTransSlider.valueAsNumber = currentComponent.translation.y;
                    comZTransSlider.valueAsNumber = currentComponent.translation.z;
                    comScaleXSlider.valueAsNumber = currentComponent.scale.x;
                    comScaleYSlider.valueAsNumber = currentComponent.scale.y;
                    comScaleZSlider.valueAsNumber = currentComponent.scale.z;
                    reRender();
                }
                treeListenerArray.push(listener);
                parent.appendChild(li);
                if (component.isThereAChild() && component.children!.length > 0) {
                    const ul = document.createElement('ul');
                    ul.style.marginLeft = '1em';
                    parent.appendChild(ul);
                    appendForComponentArray(component.children!, ul);
                }
            })
        }
        appendForComponentArray(toRender!.topLevelComponents, componentTree);
    }
    updateComponentTree()


    // download sample model
    const downloadSampleModel = document.getElementById('download-sample-model') as HTMLButtonElement;
    downloadSampleModel.addEventListener('click', () => {
        switch (modelSelection.value) {
            case 'steve':
                steveToDownloadedJSON()
                break;
            case 'creeper':
                creeperToDownloadedJSON()
                break;
            case 'ghast':
                ghastToDownloadedJSON()
                break;
            default:
                throw new Error('invalid model');
        }
    })

    // ANIMATION CONTROLLER
    let isPaused = true;
    const frameCounter = document.getElementById('frame-counter') as HTMLSpanElement;
    const animItv = setInterval(() => {
        if (!isPaused) {
            Component.currentFrame = (Component.currentFrame + 1) % toRender!.totalAnimationFrames;
            frameCounter.innerText = Component.currentFrame.toString();
            reRender();
        }
    }, 1000 / toRender.totalAnimationFrames)
    const animationToggler = document.getElementById('animation-toggler') as HTMLButtonElement;
    animationToggler.addEventListener('click', () => {
        if (animationToggler.innerText === 'Play') {
            animationToggler.innerText = 'Pause'
            isPaused = false;
        } else {
            animationToggler.innerText = 'Play'
            isPaused = true;
        }
    })

    // LOAD FILE

    let jsonfile = document.getElementById("json-file") as HTMLInputElement;
    jsonfile.addEventListener("change", async () => {
        let file = jsonfile.files![0];
        togglePerspectiveMode(gl, camera);
        camYRotationSlider.valueAsNumber = 0;
        camRadiusSlider.valueAsNumber = 1;
        camera.rotationRad.y = 0;
        let reader = new FileReader();
        reader.readAsText(file);
        comXRotSlider.value = '0';
        comYRotSlider.value = '0';
        comZRotSlider.value = '0';
        comXTransSlider.value = '0';
        comYTransSlider.value = '0';
        comZTransSlider.value = '0';
        comScaleXSlider.value = '1';
        comScaleYSlider.value = '1';
        comScaleZSlider.value = '1';
        currentComponent.resetTransformation();
        isPaused = true;
        reader.onload = async () => {
            try {
                let json = JSON.parse(reader.result as string);
                toRender = await loadModelJson(gl, json);
                currentComponent = toRender.topLevelComponents[0];
                reRender();
            } catch (e) {
                console.log(e)
                alert("Invalid JSON file");
            }
        }
    })
}

main().then(() => {
    // console.log('Done');
})