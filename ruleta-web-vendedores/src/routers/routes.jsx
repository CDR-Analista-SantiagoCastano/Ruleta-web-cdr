import { Routes, Route } from "react-router-dom";
import {Home, Formulario, Ruleta} from "../index"

export function MyRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/form" element={<Formulario />} />
      <Route path="/ruleta" element={<Ruleta />} />
    </Routes>
  );
}