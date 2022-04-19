/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef } from "react";
import { PostBloomEngine } from "../postBloomEffect/PostBloomEngine";
import './Overlay3D.pcss';

export const Overlay3D = () => {
    const frameId = useRef<number>();
    const overlayRef = useRef<HTMLDivElement>(null);
    let engine: PostBloomEngine;

    const update = useCallback(() => {
        frameId.current = window.requestAnimationFrame(update);
        engine.mesh.rotation.y -= 0.005;
        engine.render();
    }, []);

    const resize = () => {
        const { innerWidth: width, innerHeight: height } = window;
        engine.renderer.setSize(width, height);
        engine.camera.perspective({ aspect: width / height });
        engine.postComposite.resize();
        engine.postBloom.resize();
        engine.resolution?.value.set(width, height);
        engine.bloomResolution?.value.set(engine.postBloom.options.width, engine.postBloom.options.height);
    };

    useEffect(() => {
        engine = new PostBloomEngine(overlayRef.current);
        resize();

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

    return <div className="overlay3D" ref={overlayRef} />;
};
