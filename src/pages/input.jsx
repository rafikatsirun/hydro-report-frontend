import React, { useEffect, useState } from "react";
import "../style/style-input.css";
import Navbar from "../components/navbar";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import axios from "axios";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const FormInput = () => {
  const [formData, setFormData] = useState({
    nama_pelapor: "",
    nomor_pelapor: "",
    alamat_pelapor: "",
    tanggal_pelaporan: "",
    deskripsi: "",
    latitude: "",
    longitude: "",
    status_laporan: "Pending",
  });

  useEffect(() => {
    if (L.DomUtil.get("form-map") !== null) {
      L.DomUtil.get("form-map")._leaflet_id = null;
    }

    const map = L.map("form-map", {
      dragging: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      boxZoom: true,
      touchZoom: true,
      zoomControl: true,
    }).setView([-7.9916, 110.6169], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map);

    setTimeout(() => {
      map.invalidateSize();
    }, 0);

    let marker = null;

    // 🔹 Fungsi untuk set marker tunggal
    const setSingleMarker = (lat, lng, popupText = "") => {
      const latitude = Number(lat);
      const longitude = Number(lng);

      if (marker) {
        marker.setLatLng([latitude, longitude]);
      } else {
        marker = L.marker([latitude, longitude]).addTo(map);
      }

      if (popupText) {
        marker.bindPopup(popupText).openPopup();
      }

      setFormData((prev) => ({
        ...prev,
        latitude: latitude.toFixed(8),
        longitude: longitude.toFixed(8),
      }));
    };

    // 🔹 Minta akses lokasi pengguna
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          map.setView([userLat, userLng], 14);
          setSingleMarker(userLat, userLng, "Lokasi Anda saat ini");
        },
        (err) => {
          console.warn("Gagal mengakses lokasi:", err.message);
        }
      );
    } else {
      alert("Browser tidak mendukung geolokasi.");
    }

    // 🔹 Event klik untuk pindah marker
    map.on("click", function (e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;

      setSingleMarker(lat, lng);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");

      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      await axios.post("http://localhost:8000/api/laporan", formData, config);

      alert("Laporan berhasil dikirim!");
      setFormData({
        nama_pelapor: "",
        nomor_pelapor: "",
        alamat_pelapor: "",
        tanggal_pelaporan: "",
        deskripsi: "",
        latitude: "",
        longitude: "",
        status_laporan: "Pending",
      });
    } catch (error) {
      alert("Gagal mengirim laporan");
      console.error(error.response?.data);
    }
  };

  return (
    <>
      <Navbar />
      <div className="forminput-page">
        <div className="forminput-container">
          <h2>Form Input Pelaporan</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="nama_pelapor">Nama Pelapor</label>
            <input
              type="text"
              id="nama_pelapor"
              name="nama_pelapor"
              value={formData.nama_pelapor}
              onChange={handleChange}
              required
            />

            <label htmlFor="nomor_pelapor">Nomor Pelapor</label>
            <input
              type="text"
              id="nomor_pelapor"
              name="nomor_pelapor"
              value={formData.nomor_pelapor}
              onChange={handleChange}
              required
            />

            <label htmlFor="alamat_pelapor">Alamat Pelapor</label>
            <textarea
              id="alamat_pelapor"
              name="alamat_pelapor"
              value={formData.alamat_pelapor}
              onChange={handleChange}
              required
            ></textarea>

            <label htmlFor="tanggal_pelaporan">Tanggal Pelaporan</label>
            <input
              type="date"
              id="tanggal_pelaporan"
              name="tanggal_pelaporan"
              value={formData.tanggal_pelaporan}
              onChange={handleChange}
              required
            />

            <label htmlFor="deskripsi">Deskripsi</label>
            <textarea
              id="deskripsi"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
            ></textarea>

            <label htmlFor="latitude">Latitude</label>
            <input
              type="number"
              step="0.00000001"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
            />

            <label htmlFor="longitude">Longitude</label>
            <input
              type="number"
              step="0.00000001"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
            />

            <label>Pilih Lokasi pada Peta</label>
            <div id="form-map" className="forminput-map"></div>

            <label htmlFor="status_laporan">Status Laporan</label>
            <input
              type="text"
              id="status_laporan"
              name="status_laporan"
              value={formData.status_laporan}
              readOnly
            />

            <button type="submit">Kirim Laporan</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default FormInput;
