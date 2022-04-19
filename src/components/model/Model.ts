// @ts-ignore
import { Program, Mesh, Geometry } from "ogl";
import { fragment } from "./shaders/fragment";
import { vertex } from "./shaders/vertex";
import data from "./assets/model.json";

export class Model {
    private _mesh: Mesh;

    public constructor(private gl: WebGL2RenderingContext) {
        const geometry = new Geometry(this.gl, {
            position: { size: 3, data: new Float32Array(data.position) },
            uv: { size: 2, data: new Float32Array(data.uv) },
        });
        const program = new Program(this.gl, { vertex, fragment });
        this._mesh = new Mesh(this.gl, { geometry, program });
    }

    public get mesh() {
        return this._mesh;
    }
}
