// @ts-ignore
import { Program, Mesh, Geometry } from "ogl";
import { fragment } from "./shaders/fragment";
import { vertex } from "./shaders/vertex";
import model from "./assets/unicorn.json";
import { Model } from "../types";

export class UnicornModel implements Model {
    private _mesh: Mesh;
    private geometryData: number[] = model.data.attributes.position.array;
    private readonly color = [0.4, 0.5, 1.0, 1.0];

    public constructor(private gl: WebGL2RenderingContext) {
        const geometry = new Geometry(this.gl, {
            position: { size: 3, data: new Float32Array(this.geometryData) },
        });
        const uniforms = { uColor: { value: this.color }};
        const program = new Program(this.gl, { vertex, fragment, uniforms });
        this._mesh = new Mesh(this.gl, { geometry, program });
    }

    public get mesh() {
        return this._mesh;
    }
}
