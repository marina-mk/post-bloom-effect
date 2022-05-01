import { Scene1Overlay3D } from '../overlay3D/Scene1Overay3D';
import Title from '../title/Title';
import './App.pcss';

export const App = () => {
    return (
        <div className="app">
            <Title />
            <Scene1Overlay3D />
        </div>
    );
}

export default App;
