import React, { useState } from 'react';
import '../style/style-login.css';
import Navbar from '../components/navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const handleSwitch = (loginSelected) => {
    setIsLogin(loginSelected);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://103.27.206.43:8000/api/login', loginData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);

      alert('Login berhasil');

      if (user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      alert('Login gagal');
      console.error(error.response?.data);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://103.27.206.43:8000/api/register', registerData);
      alert('Registrasi berhasil');
      setIsLogin(true);
    } catch (error) {
      alert('Registrasi gagal');
      console.error(error.response?.data);
    }
  };

  return (
    <>
      <Navbar />
      <main className="login-main-center">
        <div className="login-wrapper">
          <div className="login-title-text">
            <div className={`login-title ${isLogin ? 'login' : 'signup'}`}>
              {isLogin ? 'Form Login' : 'Form Registrasi'}
            </div>
          </div>

          <div className="login-form-container">
            <div className="login-slide-controls">
              <input type="radio" name="slide" id="login" checked={isLogin} onChange={() => handleSwitch(true)} />
              <input type="radio" name="slide" id="signup" checked={!isLogin} onChange={() => handleSwitch(false)} />
              <label htmlFor="login" className="login-slide login">Login</label>
              <label htmlFor="signup" className="login-slide signup">Registrasi</label>
              <div className="login-slider-tab" style={{ left: isLogin ? '0%' : '50%' }} />
            </div>

            <div className="login-form-inner" style={{ marginLeft: isLogin ? '0%' : '-100%' }}>
              <form className="login-form login" onSubmit={handleLogin}>
                <div className="login-field">
                  <input type="email" placeholder="Masukan Email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required />
                </div>
                <div className="login-field">
                  <input type="password" placeholder="Masukan Password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required />
                </div>
                <div className="login-pass-link">
                  <a href="#">Lupa password?</a>
                </div>
                <div className="login-field login-btn">
                  <div className="login-btn-layer"></div>
                  <input type="submit" value="Login" />
                </div>
                <div className="login-signup-link">
                  Belum Punya Akun? <a href="#" onClick={() => handleSwitch(false)}>Daftar Sekarang</a>
                </div>
              </form>

              <form className="login-form signup" onSubmit={handleRegister}>
                <div className="login-field">
                  <input type="text" placeholder="Masukan Nama" value={registerData.name} onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} required />
                </div>
                <div className="login-field">
                  <input type="email" placeholder="Masukan Email" value={registerData.email} onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} required />
                </div>
                <div className="login-field">
                  <input type="password" placeholder="Masukan Password" value={registerData.password} onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} required />
                </div>
                <div className="login-field">
                  <input type="password" placeholder="Konfirmasi Password" value={registerData.password_confirmation} onChange={(e) => setRegisterData({ ...registerData, password_confirmation: e.target.value })} required />
                </div>
                <div className="login-field login-btn">
                  <div className="login-btn-layer"></div>
                  <input type="submit" value="Daftar" />
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default LoginPage;
