import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/style-navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
    setMenuOpen(false);
  };

  const handleToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleClose = () => {
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="logo">HYDROREPORT</div>
      <div className="menu-toggle" onClick={handleToggle}>
        ☰
      </div>
      <nav>
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          <li>
            <Link to="/" onClick={handleClose}>Beranda</Link>
          </li>
          <li>
            <Link to="/mitigasi" onClick={handleClose}>Mitigasi</Link>
          </li>
          <li>
            <Link to="/data" onClick={handleClose}>Data</Link>
          </li>
          <li>
            <Link to="/cuaca" onClick={handleClose}>Cuaca</Link>
          </li>
          <li>
            <Link to="/contact" onClick={handleClose}>Info</Link>
          </li>
          {token && role === "admin" ? (
            <>
              <li>
                <Link to="/dashboard" onClick={handleClose}>Dashboard</Link>
              </li>
              <li>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" onClick={handleClose}>Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
