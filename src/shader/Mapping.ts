import { CameraSettings } from "../model/Camera";
import { ComponentSaver } from "../model/Component";

abstract class Mapping {
    abstract fragment_shader : string;
    abstract vertex_shader : string;
    gl : WebGLRenderingContext;
    constructor(gl: WebGLRenderingContext){
        this.gl = gl;
    }
    abstract loadModel(toRender : ComponentSaver) : Promise<void>;
    abstract loadModelJson(json : any) : Promise<ComponentSaver>;
    abstract setTextures(ComponentSaver : ComponentSaver) : Promise<void>;
    abstract render(camera: CameraSettings, ComponentSaver: ComponentSaver) : void;
}

export default Mapping;