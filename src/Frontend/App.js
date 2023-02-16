import logo from './logo.svg';
import './App.css';
import ForceGraph from './ForceGraph/ForceGraph';
import { Routes, Route } from "react-router-dom";
import ProteinDetails from './ProteinDetails/ProteinDetails';
import LandingPage from './LandingPage/LandingPage';
import BodyDiagram from './BodyDiagram/BodyDiagram';


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/body-diagram' element={<BodyDiagram/>} />
        <Route path='/PPI-graph' element={<ForceGraph />} />
        <Route path='/protein-details' element={<ProteinDetails />} />
      </Routes>
    </div>
  );
}

export default App;
