import { Overlay3D } from '../overlay3D/Overay3D';
import Title from '../title/Title';
import './App.pcss';

export const App = () => {
    return (
        <div className="app">
            <Title />
            <Overlay3D />
        </div>
    );
}

export default App;
