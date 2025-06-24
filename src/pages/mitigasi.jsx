import React, { useEffect, useRef } from 'react';
import Navbar from '../components/navbar'; // Pastikan path ini sesuai dengan struktur proyekmu
import '../style/style-mitigasi.css';

const Mitigasi = () => {
  const trackRef = useRef(null);
  const currentIndexRef = useRef(0);

  useEffect(() => {
    const track = trackRef.current;
    const slides = Array.from(track.children);
    const nextButton = document.querySelector(".next");
    const prevButton = document.querySelector(".prev");

    const moveToSlide = (index) => {
      const slideWidth = slides[0].getBoundingClientRect().width;
      track.style.transform = `translateX(-${slideWidth * index}px)`;
      currentIndexRef.current = index;
    };

    const handleNext = () => {
      if (currentIndexRef.current < slides.length - 1) {
        moveToSlide(currentIndexRef.current + 1);
      }
    };

    const handlePrev = () => {
      if (currentIndexRef.current > 0) {
        moveToSlide(currentIndexRef.current - 1);
      }
    };

    nextButton.addEventListener("click", handleNext);
    prevButton.addEventListener("click", handlePrev);
    window.addEventListener("resize", () => moveToSlide(currentIndexRef.current));

    return () => {
      nextButton.removeEventListener("click", handleNext);
      prevButton.removeEventListener("click", handlePrev);
      window.removeEventListener("resize", () => moveToSlide(currentIndexRef.current));
    };
  }, []);

  return (
    <>
  <div className="mitigasi-page">
    <Navbar />

    <div className="container">
      <h1>Informasi Mitigasi</h1>

      <div className="pdf-button">
        <a href="dokumen-mitigasi.pdf" target="_blank" className="btn">Lihat PDF Mitigasi</a>
      </div>

      <div className="carousel">
        <button className="prev">&#10094;</button>
        <div className="carousel-track-container">
          <ul className="carousel-track" ref={trackRef}>
            <li className="carousel-slide current-slide">
              <img src="asset/Deskripsi.jpg" alt="Deskripsi" />
            </li>
            <li className="carousel-slide">
              <img src="asset/Pra.jpg" alt="Pra Bencana" />
            </li>
            <li className="carousel-slide">
              <img src="asset/Saat.jpg" alt="Saat Bencana" />
            </li>
            <li className="carousel-slide">
              <img src="asset/Pasca.jpg" alt="Pasca Bencana" />
            </li>
          </ul>
        </div>
        <button className="next">&#10095;</button>
      </div>
    </div>
  </div>
</>
  );
};

export default Mitigasi;
