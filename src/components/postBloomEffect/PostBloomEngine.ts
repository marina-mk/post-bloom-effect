// @ts-ignore
import { Camera, Post, Renderer, Transform, Vec2, Mesh } from "ogl";
import { EvoTextModel } from "../model/EvoTextModel";
import { blurFragment, brightPassFragment, compositeFragment } from "./shaders/bloomFragments";

export interface Resolution {
    value: Vec2;
}

export class PostBloomEngine {
    private _renderer: Renderer;
    private gl: WebGL2RenderingContext;
    private scene: Transform;
    private _camera: Camera;
    private _meshes: Mesh[] = [];
    private _postComposite: Post;
    private _postBloom: Post;
    private compositePass: any;
    private _resolution?: Resolution;
    private _bloomResolution?: Resolution;

    public constructor(overlay: HTMLDivElement | null) {
        this._renderer = new Renderer({ dpr: 2, alpha: true });
        this.gl = this._renderer.gl as WebGL2RenderingContext;

        if (overlay && this.gl) {
            overlay.appendChild(this.gl.canvas);
            this.initCamera();
            this.initPasses();
            this.initScene();
        }
    }

    public get renderer(): Renderer {
        return this._renderer;
    }

    public get camera(): Camera {
        return this._camera;
    }

    public get meshes(): Mesh[] {
        return this._meshes;
    }

    public get postComposite() {
        return this._postComposite;
    }

    public get postBloom() {
        return this._postBloom;
    }

    public get resolution(): Resolution | undefined {
        return this._resolution;
    }

    public get bloomResolution(): Resolution | undefined {
        return this._bloomResolution;
    }

    public render() {
        // Disable compositePass pass, so this post will just render the scene for now
        this.compositePass.enabled = false;
        // `targetOnly` prevents post from rendering to the canvas
        this._postComposite.targetOnly = true;
        // This renders the scene to postComposite.uniform.value
        this._postComposite.render({ scene: this.scene, camera: this._camera });

        // This render the bloom effect's bright and blur passes to postBloom.fbo.read
        // Passing in a `texture` argument avoids the post initially rendering the scene
        this._postBloom.render({ texture: this._postComposite.uniform.value, targetOnly: true });

        // Re-enable composite pass
        this.compositePass.enabled = true;
        // Allow post to render to canvas upon its last pass
        this._postComposite.targetOnly = false;

        // This renders to canvas, compositing the bloom pass on top
        // pass back in its previous render of the scene to avoid re-rendering
        this._postComposite.render({ texture: this._postComposite.uniform.value });
    }

    private initCamera(): void {
        this._camera = new Camera(this.gl, { fov: 35 });
        this._camera.position.set(0, 0, 4);
        this._camera.lookAt([-0.5, 0.7, 0]);
    }

    private initPasses(): void {
        // Create composite post at full resolution, and bloom at reduced resolution
        this._postComposite = new Post(this.gl);
        // `targetOnly: true` prevents post from rendering to canvas
        this._postBloom = new Post(this.gl, { dpr: 0.5, targetOnly: true });
        // Create uniforms for passes
        this._resolution = { value: new Vec2() };
        this._bloomResolution = { value: new Vec2() };

        // Add Bright pass - filter the scene to only the bright parts we want to blur
        this._postBloom.addPass({
            fragment: brightPassFragment,
            uniforms: {
                uThreshold: { value: 0.2 },
            },
        });
        // Add gaussian blur passes
        const horizontalPass = this._postBloom.addPass({
            fragment: blurFragment,
            uniforms: {
                uResolution: this._bloomResolution,
                uDirection: { value: new Vec2(2, 0) },
            },
        });
        const verticalPass = this._postBloom.addPass({
            fragment: blurFragment,
            uniforms: {
                uResolution: this._bloomResolution,
                uDirection: { value: new Vec2(0, 2) },
            },
        });

        // Re-add the gaussian blur passes several times to the array to get smoother results
        for (let i = 0; i < 5; i++) {
            this._postBloom.passes.push(horizontalPass, verticalPass);
        }

        // Add final composite pass
        this.compositePass = this._postComposite.addPass({
            fragment: compositeFragment,
            uniforms: {
                uResolution: this._resolution,
                tBloom: this._postBloom.uniform,
                uBloomStrength: { value: 1.5 },
            },
        });
    }

    private initScene(): void {
        this.gl.clearColor(0.0, 0.3, 2.0, 0.0);
        this.scene = new Transform(this.gl);
        this._meshes = [
            new EvoTextModel(this.gl).mesh,
        ];

        this._meshes.forEach((mesh) => mesh.setParent(this.scene));
    }
};
