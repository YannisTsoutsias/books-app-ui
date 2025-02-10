import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Books from "./Books";
import Login from "./Login";

function App() {
  const [isAuth, setIsAuth] = useState(false); 
  const [role, setRole] = useState("");

  const handleLogin = (role) => {
    setIsAuth(true); 
    setRole(role);
  };

  const handleLogout = () => {
    setIsAuth(false); 
    setRole("");
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuth ? <Navigate to="/books" /> : <Login onLogin={handleLogin} />}
        />

        <Route
          path="/books"
          element={isAuth ? <Books role={role} onLogout={handleLogout} /> : <Navigate to="/" />}
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;