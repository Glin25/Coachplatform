import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
        <h1>Router OK ✅</h1>
        <p><Link to="/ping">Ga naar /ping</Link></p>
        <Routes>
          <Route path="/ping" element={<div>/ping werkt ✅</div>} />
          <Route path="*" element={<div>Home route ✅</div>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}