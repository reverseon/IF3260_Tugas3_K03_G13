import { ComponentSaver } from "../model/Component";
import { createProgram, createProgramFromSources } from "../model/GLUtil";
import Mapping from "./Mapping";
import { Vec4 } from "../model/Vec4";
import { CameraSettings } from "../model/Camera";
import { Component } from "../model/Component";
import { Mat4 } from "../model/Mat4";
import { MathUtil } from "../util/MathUtil";

class TextureMapping extends Mapping {
    vertex_shader = `
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
    fragment_shader = `
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
    program : WebGLProgram;
    
    constructor(gl : WebGLRenderingContext){
        super(gl);
        this.program = createProgramFromSources(gl, this.vertex_shader, this.fragment_shader);
        gl.useProgram(this.program);
    };

    async loadModel(toRender : ComponentSaver){
        await this.setTexturesFromComponentSaver(this.gl, toRender);
    }

    async loadModelJson(json : any){
        const newComponentSaver = ComponentSaver.loadfromJSON(json);
        await this.setTexturesFromComponentSaver(this.gl, newComponentSaver);
        return newComponentSaver;
    }

    async setTextures(componentSaver: ComponentSaver): Promise<void> {
        await this.setTexturesFromComponentSaver(this.gl, componentSaver);
    }
    async setTexturesFromComponentSaver(gl: WebGLRenderingContext, compSaver: ComponentSaver){
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

    render(
        camera : CameraSettings, compSaver : ComponentSaver
    ){
        this.gl.clearColor(0, 0, 0, 0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.DEPTH_TEST);
        // attribute
        const positionAttributeLocation = this.gl.getAttribLocation(this.program, 'a_position');
        const texcoordAttributeLocation = this.gl.getAttribLocation(this.program, 'a_texcoord');
        const normalAttributeLocation = this.gl.getAttribLocation(this.program, 'a_normal');
        // uniform
        const worldViewProjectionUniformLocation = this.gl.getUniformLocation(this.program, 'u_worldViewProjection');
        const worldUniformLocation = this.gl.getUniformLocation(this.program, 'u_world');
        const reverseLightDirectionUniformLocation = this.gl.getUniformLocation(this.program, 'u_reverseLightDirection');
        const shadingUniformLocation = this.gl.getUniformLocation(this.program, 'u_shading');
        const textureUniformLocation = this.gl.getUniformLocation(this.program, 'u_texture');
        this.gl.uniform1i(textureUniformLocation, 0)
        // buffer
        const positionBuffer = this.gl.createBuffer();
        const texcoordBuffer = this.gl.createBuffer();
        const normalBuffer = this.gl.createBuffer();
        const rssWrap = (cmp: Component, pwMat: Mat4): void => {
            renderSingleShape(
                this.gl,
                this.program,
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

export default TextureMapping;