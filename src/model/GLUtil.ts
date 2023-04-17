import {Vec4} from "./Vec4";

const resizeCanvas = (canvas: HTMLCanvasElement): void => {
    const { width, height } = canvas.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
}

const compileShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader => {
    const shader = gl.createShader(type);
    if (!shader) {
        throw new Error('Failed to create shader');
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        throw new Error(gl.getShaderInfoLog(shader) as string);
    }
    return shader;
}

const createProgram = (gl: WebGLRenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram => {
    const program = gl.createProgram();
    if (!program) {
        throw new Error('Failed to create program');
    }
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        throw new Error(gl.getProgramInfoLog(program) as string);
    }
    return program;
}

const createProgramFromSources = (gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram => {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    if (!vertexShader || !fragmentShader) {
        throw new Error('Failed to compile shaders');
    }
    return createProgram(gl, vertexShader, fragmentShader);
}

const getWebGLContext = (canvas: HTMLCanvasElement): WebGLRenderingContext => {
    const gl = canvas.getContext('webgl');
    if (!gl) {
        throw new Error('Failed to get WebGL context');
    }
    return gl;
}
export {
    resizeCanvas,
    compileShader,
    createProgram,
    createProgramFromSources,
    getWebGLContext,
}

