import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"
import Home from "@/pages/Home"
import "@/style/css/root.css";
import Header from "@/modules/Header";
import Footer from "./modules/Footer";

function App() {

  return (
    <>

      <BrowserRouter>
        <Header />
        <Routes >
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </BrowserRouter>
      {<Footer />}
    </>
  )
}

export default App
