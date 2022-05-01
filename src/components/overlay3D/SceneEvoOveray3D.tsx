/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef } from "react";
import { EvoTextModel } from "../model/evoText/EvoTextModel";
import { PostBloomEngine } from "../postBloomEffect/PostBloomEngine";
import './SceneOverlay3D.pcss';

const cameraPosition: [number, number, number] = [0, 0, 4];
const cameraLookAt: [number, number, number] = [-0.5, 0.7, 0];
const bloomColor:[number, number, number, number] = [0.0, 0.3, 2.0, 0.0];

export const SceneEvoOverlay3D = () => {
    const frameId = useRef<number>();
    const overlayRef = useRef<HTMLDivElement>(null);
    let engine: PostBloomEngine;

    const init = () => {
        engine = new PostBloomEngine(
            overlayRef.current,
            cameraPosition,
            cameraLookAt,
            bloomColor,
        );
        const meshes = [new EvoTextModel(engine.gl).mesh];
        engine.initScene(meshes);
        resize();
    };

    const update = useCallback(() => {
        frameId.current = window.requestAnimationFrame(update);
        engine.meshes.forEach((mesh) => mesh.rotation.y -= 0.005);
        engine.render();
    }, []);

    const resize = () => {
        const { clientWidth: width, clientHeight: height } = overlayRef.current;
        engine.renderer.setSize(width, height);
        engine.camera.perspective({ aspect: width / height });
        engine.postComposite.resize();
        engine.postBloom.resize();
        engine.resolution?.value.set(width, height);
        engine.bloomResolution?.value.set(engine.postBloom.options.width, engine.postBloom.options.height);
    };

    useEffect(() => {
        init();

        if (!frameId.current) {
            frameId.current = requestAnimationFrame(update);
        }
        window.addEventListener("resize", resize);

        return () => {
            if (frameId.current) {
                cancelAnimationFrame(frameId.current);
            }
            window.removeEventListener("resize", resize);
        };
    }, [update, resize]);

    return <div className="overlay3D evo" ref={overlayRef} />;
};
