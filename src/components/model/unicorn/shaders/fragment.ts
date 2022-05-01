export const fragment = /* glsl */ `
    precision highp float;
    uniform vec4 uColor;
    void main() {
        gl_FragColor = uColor;
    }
`;
