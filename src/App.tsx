import { Route, Routes, useLocation } from "react-router-dom"
import Home from "@/pages/Home"
import "@/style/css/root.css";
import Header from "@/modules/Header";
import Footer from "@/modules/Footer";
import Login from "@/pages/Login";
import Register from "@/pages/Register";

function App() {
  const location = useLocation();

  return (
    <>
      <Header />
      <Routes >
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      {location.pathname != "/login" && location.pathname != "/register" && <Footer />}
    </>
  )
}

export default App