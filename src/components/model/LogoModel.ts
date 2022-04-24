// @ts-ignore
import { Program, Mesh, Geometry } from "ogl";
import { fragment } from "./shaders/fragment";
import { vertex } from "./shaders/vertex";
import model from "./assets/evologo.json";

export class LogoModel {
    private _mesh: Mesh;
    // @ts-ignore
    private geometryData: number[] = model.geometries[0].data.attributes.position.array;

    public constructor(private gl: WebGL2RenderingContext) {
        const geometry = new Geometry(this.gl, {
            position: { size: 3, data: new Float32Array(this.geometryData) },
        });
        const program = new Program(this.gl, { vertex, fragment });
        this._mesh = new Mesh(this.gl, { geometry, program });
    }

    public get mesh() {
        return this._mesh;
    }
}
