/** @type { HTMLCanvasElement } */
// The above JS doc type declares the canvas el so intellisense works :).

"use strict";

const canvas = document.getElementById("canvas");
const gl = canvas.getContext("webgl2");

if (!gl) console.error("No WebGl2 available");

const vertexData = [
     0,  1, 0,
     1, -1, 0,
    -1, -1, 0
];

const colorData = [
    1, 0, 0, // Vertex 1 color
    0, 1, 0, // Vertex 2 color
    0, 0, 1  // Vertex 3 color
];

const positionBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);

gl.shaderSource(vertexShader, `
    precision mediump float;

    attribute vec3 position;
    attribute vec3 color;
    varying vec3 vColor;

    void main()
    {
        vColor = color;
        gl_Position = vec4(position, 1);
    }
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

gl.shaderSource(fragmentShader, `
    precision mediump float;
    
    varying vec3 vColor;

    void main()
    {
        gl_FragColor = vec4(vColor, 1);
    }
`);
gl.compileShader(fragmentShader);

const program = gl.createProgram();

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, `position`);

gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, `color`);

gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.drawArrays(gl.TRIANGLES, 0, 3);