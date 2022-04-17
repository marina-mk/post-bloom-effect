import { useInit3D } from "./hooks/useInit3D";
import './Overlay3D.pcss';

export const Overlay3D = () => {
    useInit3D();
    return <div className="overlay3D" />;
};
