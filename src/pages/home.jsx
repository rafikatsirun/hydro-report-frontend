import React from "react";
import Navbar from "../components/navbar";
import '../style/style-home.css';

const Home = () => {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="hero" id="beranda">
        <div className="hero-content">
          <h1>HYDRO REPORT & INFORMATION SYSTEM</h1>
          <p>
            "Platform Pemetaan, Pelaporan, dan Klasifikasi Daerah Krisis Air
            Secara Interaktif di Kabupaten Gunungkidul"
          </p>
          <div className="hero-buttons">
            <a href="/maps" className="btn">Lihat Peta</a>
            <a href="/input" className="btn">Lapor</a>
          </div>
        </div>

        {/* Hero Logo */}
        <div className="hero-image">
          <img src="asset/Logo App.png" alt="Logo Hydro Report" />
        </div>
      </section>

      <main className="container">
        <div className="content-wrapper">
          {/* Features Section */}
          <section className="features">
            <div className="card">
              <h3>Pemetaan Krisis Air</h3>
              <p>
                Hydro Report menyediakan peta interaktif yang menampilkan daerah dengan tingkat kekeringan tinggi untuk mendukung mitigasi dan distribusi air bersih.
              </p>
            </div>
            <div className="card">
              <h3>Analisis Data Geospasial</h3>
              <p>
                Dengan teknologi analitik canggih, sistem ini mengolah data geospasial untuk memberikan informasi yang akurat mengenai potensi krisis air.
              </p>
            </div>
            <div className="card">
              <h3>Integrasi Data Real-Time</h3>
              <p>
                Data dari sensor, laporan masyarakat, dan instansi terkait diintegrasikan secara real-time guna memastikan informasi selalu mutakhir.
              </p>
            </div>
            <div className="card">
              <h3>Pengambilan Keputusan</h3>
              <p>
                Platform ini mendukung pengambilan keputusan yang cepat dan tepat dalam perencanaan distribusi air dan respons darurat kekeringan.
              </p>
            </div>
          </section>

          {/* Intro Section */}
          <section className="intro">
            <span className="label">Tentang</span>
            <h1>Mendeteksi dan Mengidentifikasi Daerah Krisis Air dengan WebGIS</h1>
            <p>
              Hydro Report adalah sistem informasi geografis berbasis web (WebGIS) yang dirancang untuk membantu memantau dan mengidentifikasi daerah yang mengalami krisis air. Dengan menggunakan data spasial, sistem ini memberikan alat analisis yang komprehensif kepada pemerintah, organisasi non-profit, dan masyarakat umum untuk memahami persebaran krisis air secara akurat.
            </p>
            <a href="#" className="btn-primary">Pelajari Lebih Lanjut →</a>
          </section>
        </div>
      </main>
    </>
  );
};

export default Home;
