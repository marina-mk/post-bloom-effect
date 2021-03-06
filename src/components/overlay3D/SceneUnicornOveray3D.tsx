/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef } from "react";
import { UnicornModel } from "../model/unicorn/UnicornModel";
import { PostBloomEngine } from "../postBloomEffect/PostBloomEngine";
import './SceneOverlay3D.pcss';

const cameraPosition: [number, number, number] = [0, 0, 10.5];
const cameraLookAt: [number, number, number] = [-1.5, 3.3, 0];
const bloomColor:[number, number, number, number] = [0.9, 0.1, 0.7, 0.0];

export const SceneUnicornOverlay3D = () => {
    const isMounted = useRef(false);
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
        const mesh = [new UnicornModel(engine.gl).mesh];
        engine.initScene(mesh);
        resize();
    };

    const update = useCallback(() => {
        frameId.current = window.requestAnimationFrame(update);
        engine.meshes.forEach((mesh) => mesh.rotation.y -= 0.005);
        engine.render();
    }, []);

    const resize = () => {
        const width = isMounted.current ? overlayRef.current.clientWidth : window.innerWidth;
        const height = isMounted.current ? overlayRef.current.clientHeight : window.innerHeight;
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

    return <div className="overlay3D unicorn" ref={overlayRef} />;
};
