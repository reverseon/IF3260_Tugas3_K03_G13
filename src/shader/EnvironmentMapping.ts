import { CameraSettings } from "../model/Camera";
import { ComponentSaver } from "../model/Component";
import { createProgramFromSources } from "../model/GLUtil";
import Mapping from "./Mapping";
import { MathUtil } from "../util/MathUtil";
import { Mat4 } from "../model/Mat4";
import { Vec3 } from "../model/Vec3";
import { Component } from "../model/Component";
import pos_x from "../../shape/environment/pos-x.jpg";
import pos_y from "../../shape/environment/pos-y.jpg";
import pos_z from "../../shape/environment/pos-z.jpg";
import neg_x from "../../shape/environment/neg-x.jpg";
import neg_y from "../../shape/environment/neg-y.jpg";
import neg_z from "../../shape/environment/neg-z.jpg";

class  EnvironmentMapping extends Mapping{
    texture : WebGLTexture | null;
    program : WebGLProgram;
    vertex_shader = `
        attribute vec4 a_position;
        attribute vec4 a_normal;

        uniform mat4 u_worldViewProjection;
        uniform mat4 u_world;

        varying vec3 v_worldPosition;
        varying vec3 v_worldNormal;

        void main() {
            gl_Position = u_worldViewProjection * a_position;
            v_worldPosition = (u_world * a_position).xyz;
            v_worldNormal = mat3(u_world) * a_normal.xyz; 
        }
    `;
    fragment_shader = `
        precision highp float;

        varying vec3 v_worldPosition;
        varying vec3 v_worldNormal;

        uniform samplerCube u_texture;

        uniform vec3 u_worldCameraPosition;

        void main(){
            vec3 worldNormal = normalize(v_worldNormal);
            vec3 eyeToSurfaceDir = normalize(v_worldPosition - u_worldCameraPosition);
            vec3 direction = reflect(eyeToSurfaceDir, worldNormal);

            gl_FragColor = textureCube(u_texture, direction);
        }
    `;
    constructor (gl : WebGLRenderingContext){
        super(gl);
        this.program = createProgramFromSources(gl, this.vertex_shader, this.fragment_shader);
        gl.useProgram(this.program);
        this.texture = gl.createTexture();
    }
    
    faceInfos = [
        {
            target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_X,
            url: pos_x
        },
        {
            target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
            url: neg_x
        },
        {
            target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
            url: pos_y
        },
        {
            target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Y,
            url: neg_y
        },
        {
            target: this.gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
            url: pos_z
        },
        {
            target: this.gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
            url: neg_z
        },
    ];

    async loadModel(toRender : ComponentSaver) {
        await this.setTextures(toRender);

    }

    async loadModelJson(json: any): Promise<ComponentSaver> {
        const newComponentSaver = ComponentSaver.loadfromJSON(json);
        await this.setTextures(newComponentSaver);
        return newComponentSaver;
    }
    async setTextures(ComponentSaver: ComponentSaver){/*
        const imgloadPromise = new Promise(resolve => {
            this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.texture);
            let texture = this.texture!;
            let gl = this.gl;
            this.faceInfos.forEach((faceInfo) => {
                const {target, url} = faceInfo;
                
                const level = 0;
                const internalFormat = gl.RGBA;
                const width = 512;
                const height = 512;
                const format = gl.RGBA;
                const type = gl.UNSIGNED_BYTE;
                
                this.gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);
                
                const image = new Image();
                image.src = url;
                image.onload = function(){
                    console.log(image);
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                    gl.texImage2D(target, level, internalFormat, format, type, image);
                    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                    } else {
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT);
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);
                    }
                    console.log("loaded");
                };
            });
            resolve(0);
            //this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR);
            //this.gl.generateMipmap(this.gl.TEXTURE_CUBE_MAP);
        });
        await imgloadPromise;
        console.log("texture loaded");*/
        this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.texture);
        let texture = this.texture!;
        let gl = this.gl;
        await Promise.all(this.faceInfos.map(async (faceInfo) => {
            const {target, url} = faceInfo;
                
            const level = 0;
            const internalFormat = gl.RGBA;
            const width = 512;
            const height = 512;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;
            
            this.gl.texImage2D(target, level, internalFormat, width, height, 0, format, type, null);
            
            const imgloadPromise = new Promise(resolve => {
                const image = new Image();
                image.src = url;
                image.onload = function(){
                    console.log(image);
                    gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
                    gl.texImage2D(target, level, internalFormat, format, type, image);
                    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
                        gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
                    } else {
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.REPEAT);
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.REPEAT);
                    }
                    console.log("loaded");
                    resolve(0);
                };
            })

            await imgloadPromise;
            console.log("after await");
        }));
    }
    render(
        camera : CameraSettings,
        compSaver : ComponentSaver
    ){
        console.log("magil");
        this.gl.clearColor(0,0,0,0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.DEPTH_TEST);
        
        const positionLocation = this.gl.getAttribLocation(this.program, "a_position");
        const normalLocation = this.gl.getAttribLocation(this.program, "a_normal");
        const worldViewProjectionLocation = this.gl.getUniformLocation(this.program, "u_worldViewProjection");
        const worldLocation = this.gl.getUniformLocation(this.program, "u_world");
        const textureLocation = this.gl.getUniformLocation(this.program, "u_texture");
        const worldCameraPositionLocation = this.gl.getUniformLocation(this.program, "u_worldCameraPosition");
        
        const positionBuffer = this.gl.createBuffer();
        const normalBuffer = this.gl.createBuffer();

        const rssWrap = (cmp: Component, pwMat: Mat4) : void => {
            renderSingleShape(
                this.gl,
                this.program,
                camera,
                cmp,
                {
                    position: positionLocation,
                    normal: normalLocation,
                },
                {
                    worldViewProjection: worldViewProjectionLocation!,
                    world: worldLocation!,
                    texture: textureLocation!,
                    worldCameraPosition : worldCameraPositionLocation!,
                },
                {
                    position: positionBuffer!,
                    normal: normalBuffer!,
                },
                pwMat
                )
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
}
const isPowerOf2 = (value: number): boolean => {
    return (value & (value - 1)) === 0;
}
const renderSingleShape = (
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    camera: CameraSettings,
    component: Component,
    attribLocations: {
        position: number,
        normal: number,
    },
    uniformLocations: {
        worldViewProjection: WebGLUniformLocation,
        world: WebGLUniformLocation,
        texture: WebGLUniformLocation,
        worldCameraPosition: WebGLUniformLocation
    },
    buffers: {
        position: WebGLBuffer,
        normal: WebGLBuffer,
    },
    prevWorldMatrix: Mat4,
    
    ): void => {
        const position = component.positionArray;
        const world = prevWorldMatrix.mul(component.worldMatrix);
        // position
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.bufferData(gl.ARRAY_BUFFER, MathUtil.makeFloat32ArrayFromVec4Array(position), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(attribLocations.position);
        gl.vertexAttribPointer(attribLocations.position, 4, gl.FLOAT, false, 0, 0);
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
    //console.log(worldViewProjectionMatrix);
    gl.uniformMatrix4fv(uniformLocations.worldViewProjection, false, worldViewProjectionMatrix.toFloat32Array());
    gl.uniformMatrix4fv(uniformLocations.world, false, world.toFloat32Array());
    gl.uniform1i(uniformLocations.texture, 0);
    const worldCameraPosition = new Vec3([camera.translation.x, camera.translation.y, camera.translation.z]);
    gl.uniform3fv(uniformLocations.worldCameraPosition, worldCameraPosition.toFloat32Array());
    gl.drawArrays(gl.TRIANGLES, 0, position.length);
    // console.log("glPosition");
    // console.log(MathUtil.multiplyMat4byVec4Array(worldViewProjectionMatrix, position));
    //console.log("test 1");
}

export default EnvironmentMapping;