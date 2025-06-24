import React from "react";
import Navbar from "../components/navbar";
import "../style/style-contact.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const InfoPage = () => {
  return (
    <>
      <Navbar />

      <div className="info-contact-section">
        <div className="info-map-container">
          <iframe
            title="Lokasi BPBD Gunungkidul"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.265266128945!2d110.5788181747681!3d-7.971513692053492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e7bb38d309cba19%3A0xa8b3f2e95a957deb!2sBadan%20Penanggulangan%20Bencana%20Daerah%20(%20BPBD%20)%20Kabupaten%20Gunung%20Kidul!5e0!3m2!1sen!2sid!4v1750531538351!5m2!1sen!2sid"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        <div className="info-contact-box">
          <h2>Contact Us!</h2>
          <p>Badan Penanggulangan Bencana Daerah Kabupaten Gunungkidul</p>

          <div className="contact-info">
            <p>
              <i className="fas fa-map-marker-alt"></i> Besari, Siraman, Kec.
              Wonosari, Kabupaten Gunungkidul
            </p>
            <p>
              <i className="fas fa-envelope"></i> bpbd@gunungkidulkab.go.id
            </p>
            <p>
              <i className="fas fa-phone"></i> (0274) 394091, 0811 2657 113
            </p>
          </div>

          <div className="info-socials">
            <p>Connect with us:</p>
            <a
              href="https://www.instagram.com/bpbd_gk/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://www.tiktok.com/@bpbd_gk"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-tiktok"></i>
            </a>
            <a
              href="https://www.youtube.com/@bpbd_gk"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-youtube"></i>
            </a>
            <a
              href="https://facebook.com/share/1EeZxzbXPy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook"></i>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoPage;
