import "./App.css";
//components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Hooks
import { useAuth } from "./hooks/useAuth";

//Router
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Navbar/>       
      </BrowserRouter>
    </div>
  );
}

export default App;
