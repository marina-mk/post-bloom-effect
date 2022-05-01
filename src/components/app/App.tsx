import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
    Outlet,
  } from "react-router-dom";
import { SceneEvoOverlay3D } from '../overlay3D/SceneEvoOveray3D';
import { SceneUnicornOverlay3D } from "../overlay3D/SceneUnicornOveray3D";
import Title from '../title/Title';
import './App.pcss';

export const App = () => {
    return (
        <div className="app">
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="/" element={<SceneEvoOverlay3D />} />
                        <Route path="/unicorn" element={<SceneUnicornOverlay3D />} />
                    </Route>
                </Routes>
            </Router>
            <Title />
        </div>
    );
}

export const Layout = () => {
    return (
        <div>
            <div className="content">
                <Outlet />
            </div>
            <nav className="navigation">
                <Link to="/">Prev. scene</Link>
                <Link to="/unicorn">Next scene</Link>
            </nav>
        </div>
    );
}

export default App;
