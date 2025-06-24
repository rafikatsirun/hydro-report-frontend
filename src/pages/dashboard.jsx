import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import axios from 'axios';
import '../style/style-dashboard.css'; // ⬅️ Import file CSS terpisah

const Dashboard = () => {
  const [statistik, setStatistik] = useState(null);

  useEffect(() => {
    const fetchStatistik = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8000/api/statistik', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStatistik(response.data);
      } catch (error) {
        console.error('Gagal mengambil statistik', error);
      }
    };

    fetchStatistik();
  }, []);

  return (
    <>
      <Navbar />
      <main className="container">
        <h1>Dashboard Admin</h1>
        <p>Selamat datang, Anda berhasil login sebagai <strong>Admin</strong>.</p>

        <div className="dashboard-statistik">
          {statistik ? (
            <div className="stat-boxes">
              <div className="stat-box">
                <h3>Total Laporan</h3>
                <p>{statistik.total}</p>
              </div>
              <div className="stat-box">
                <h3>Pending</h3>
                <p>{statistik.pending}</p>
              </div>
              <div className="stat-box">
                <h3>In Progress</h3>
                <p>{statistik.inProgress}</p>
              </div>
              <div className="stat-box">
                <h3>Selesai</h3>
                <p>{statistik.selesai}</p>
              </div>
            </div>
          ) : (
            <p>Memuat statistik...</p>
          )}
        </div>

        <div className="dashboard-menu">
          <a href="/data" className="dashboard-link">Kelola Pelaporan</a>
          <a href="/input" className="dashboard-link">Form Pelaporan</a>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
