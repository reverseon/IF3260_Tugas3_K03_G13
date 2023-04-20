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
import pigGenerator, {downloadPigModel} from "./model_generator/pig_model";
import Mapping from "./shader/Mapping";
import TextureMapping from "./shader/TextureMapping";
import EnvironmentMapping from "./shader/EnvironmentMapping";

let isFirstRun = true;
let choose_map : string = "environment";

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

const main = async (): Promise<void> => {
    // console.log(ExampleModel)
    let toRender: ComponentSaver | undefined = undefined;
    let currentComponent: Component;


    // MAIN PROGRAM START //

    const canvas = document.getElementById('canvas') as HTMLCanvasElement;
    const gl = getWebGLContext(canvas);

    // INITIALIZATION //

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    let mapping : Mapping | null;
    switch(choose_map){
        case "texture":
            mapping = new TextureMapping(gl);
            break;
        case "environment":
            mapping = new EnvironmentMapping(gl);
            break;
        default:
            mapping = new TextureMapping(gl);
            break;
    }
    // LOADING MODEL & ITS TEXTURE //
    toRender = steveGenerator();
    if(mapping){
        await mapping.loadModel(toRender);
    }
    currentComponent = toRender.topLevelComponents[0];
    // console.log("toRender:", toRender)
    // console.log("currentComponent:", currentComponent)
    
    const camera = new CameraSettings();
    //togglePerspectiveMode(mapping.gl, camera);
    togglePerspectiveMode(mapping.gl, camera);
    const lookAtCurrentComponent = document.getElementById('lookat-current-component-checkbox') as HTMLInputElement;
    
    
    const reRender = () => {
        // update camera center to current component
        if (lookAtCurrentComponent.checked) {
            camera.centeredAt = currentComponent.center;
        } else {
            camera.centeredAt = new Vec4([0,0,0,1]);
        }
        
        console.log(mapping);
        mapping!.render(camera, toRender!);
    }
    
    
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
                        break;
                        case 'ghast':
                toRender = ghastGenerator();
                break;
            default:
                throw new Error('invalid model');
            }
            currentComponent.resetTransformation();
            if(mapping) await mapping.setTextures(toRender);
            currentComponent = toRender.topLevelComponents[0];
            reRender();
        })
        
        
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
            case 'pig':
                downloadPigModel()
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
                if(mapping) toRender = await mapping.loadModelJson(json);
                currentComponent = toRender!.topLevelComponents[0];
                reRender();
                updateComponentTree();
            } catch (e) {
                console.log(e)
                alert("Invalid JSON file");
            }
        }
    })
    reRender();
}

main().then(() => {
    // console.log('Done');
})