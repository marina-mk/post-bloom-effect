import { useCallback, useEffect, useRef } from "react";

export const useInit3D = () => {
    const frameId = useRef<number>();

    const update = useCallback(() => {
        frameId.current = window.requestAnimationFrame(update);
    }, []);

    const resize = useCallback(() => {
    }, []);

    useEffect(() => {
        resize();
        window.addEventListener("resize", resize);
        if (!frameId.current) {
            frameId.current = requestAnimationFrame(update);
        }

        return () => {
            if (frameId.current) {
                cancelAnimationFrame(frameId.current);
            }
            window.removeEventListener("resize", resize);
        };
    }, [update, resize]);
};
