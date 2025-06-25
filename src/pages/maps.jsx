import React, { useEffect, useRef } from "react";
import Navbar from "../components/navbar";
import "../style/style-maps.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// Leaflet & Plugin CSS
import "leaflet/dist/leaflet.css";
import "leaflet-measure/dist/leaflet-measure.css";
import "leaflet-search/dist/leaflet-search.min.css";
import "leaflet-easybutton/src/easy-button.css";
import "leaflet-draw/dist/leaflet.draw.css";

// Leaflet & Plugin JS
import L from "leaflet";
import "leaflet-measure";
import "leaflet-search";
import "leaflet-easybutton";
import "leaflet-draw";
import "leaflet.markercluster";

const MapPage = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) return;

    const map = L.map("map").setView([-7.9965, 110.6169], 10);
    mapRef.current = map;

    // Basemaps
    const osm = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap contributors",
      }
    );

    const satelit = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles &copy; Esri, Maxar, Earthstar Geographics",
      }
    );

    const positron = L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          '&copy; <a href="https://carto.com/">CARTO</a> contributors, &copy; OpenStreetMap',
      }
    );

    osm.addTo(map);

    // Layer Groups
    const jalan = L.layerGroup();
    const kekeringan = L.layerGroup();
    const sungai = L.layerGroup();
    const kecamatan = L.layerGroup();
    const pelaporanCluster = L.markerClusterGroup();

    // GeoJSON: Jalan
    fetch("/geojson/Jalan Gunungkidul.geojson")
      .then((res) => res.json())
      .then((data) => {
        const jalanLayer = L.geoJSON(data, {
          style: {
            color: "#ffa500",
            weight: 2,
            dashArray: "4 4",
          },
          onEachFeature: (feature, layer) => {
            const remark = feature.properties?.REMARK || "Tanpa nama";
            layer.bindPopup(`<strong>Jalan Desa:</strong> ${remark}`);
          },
        });
        jalanLayer.addTo(jalan);
      });

    // GeoJSON: Kekeringan
    fetch("/geojson/Bahaya Kekeringan.geojson")
      .then((res) => res.json())
      .then((data) => {
        const kekeringanLayer = L.geoJSON(data, {
          style: (feature) => {
            const kelas = feature.properties?.Kelas || "default";
            let fillColor = "#cccccc";
            if (kelas === "Tinggi") fillColor = "#e31a1c";
            else if (kelas === "Sedang") fillColor = "#f0ec08";
            else if (kelas === "Rendah") fillColor = "#11f50a";

            return {
              color: "#999",
              weight: 1,
              fillColor,
              fillOpacity: 0.7,
            };
          },
          onEachFeature: (feature, layer) => {
            const props = feature.properties || {};
            layer.bindPopup(`<strong>Kelas:</strong> ${props.Kelas || "-"}`);
          },
        });
        kekeringanLayer.addTo(kekeringan);
      });

    // GeoJSON: Sungai
    fetch("/geojson/Sungai Gunungkidul.geojson")
      .then((res) => res.json())
      .then((data) => {
        const sungaiLayer = L.geoJSON(data, {
          style: {
            color: "#1f78b4",
            weight: 1.5,
          },
          onEachFeature: (feature, layer) => {
            if (feature.properties && feature.properties.nama) {
              layer.bindPopup(`Sungai: ${feature.properties.nama}`);
            }
          },
        });
        sungaiLayer.addTo(sungai);
      });

    // GeoJSON: Kecamatan
    fetch("/geojson/Batas Kecamatan.geojson")
      .then((res) => res.json())
      .then((data) => {
        const geojsonLayer = L.geoJSON(data, {
          style: {
            color: "#ff7800",
            weight: 2,
            fillOpacity: 0.1,
          },
          onEachFeature: (feature, layer) => {
            const kecamatanName =
              feature.properties?.WADMKC || "Tidak diketahui";
            layer.bindPopup(`Kecamatan: ${kecamatanName}`);
          },
        });
        geojsonLayer.addTo(kecamatan);
      });

    // Fetch laporan dan tampilkan sebagai marker cluster
    fetch("http://103.27.206.43:8000/api/laporan")
      .then((res) => res.json())
      .then((data) => {
        data.forEach((laporan) => {
          const {
            latitude,
            longitude,
            nama_pelapor,
            deskripsi,
            tanggal_pelaporan,
          } = laporan;
          if (!latitude || !longitude) return;

          const marker = L.marker([latitude, longitude]).bindPopup(`
            <strong>Pelapor:</strong> ${nama_pelapor}<br/>
            <strong>Deskripsi:</strong> ${deskripsi}<br/>
            <strong>Tanggal:</strong> ${tanggal_pelaporan}
          `);

          pelaporanCluster.addLayer(marker);
        });
      });

    // Layer Control
    const baseMaps = {
      OpenStreetMap: osm,
      "Citra Satelit (Esri)": satelit,
      "CartoDB Positron": positron,
    };

    const overlayMaps = {
      Jalan: jalan,
      Kekeringan: kekeringan,
      Sungai: sungai,
      Kecamatan: kecamatan,
      "Data Pelaporan": pelaporanCluster,
    };

    L.control
      .layers(baseMaps, overlayMaps, { collapsed: false, position: "topright" })
      .addTo(map);

    // Legend toggle
    map.on("overlayadd", function (e) {
      if (e.name === "Kekeringan") {
        document.getElementById("legend-box").classList.remove("legend-hidden");
      }
    });

    map.on("overlayremove", function (e) {
      if (e.name === "Kekeringan") {
        document.getElementById("legend-box").classList.add("legend-hidden");
      }
    });

    // Reset view button
    L.easyButton(
      "fa-globe",
      () => map.setView([-7.9965, 110.6169], 10),
      "Reset View"
    ).addTo(map);

    L.control.scale().addTo(map);

    new L.Control.Measure({
      position: "topleft",
      primaryLengthUnit: "meters",
      secondaryLengthUnit: "kilometers",
      primaryAreaUnit: "sqmeters",
      secondaryAreaUnit: "hectares",
    }).addTo(map);

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    new L.Control.Draw({
      edit: { featureGroup: drawnItems },
      draw: {
        polygon: true,
        polyline: true,
        rectangle: true,
        circle: true,
        marker: true,
        circlemarker: false,
      },
    }).addTo(map);

    map.on("draw:created", (e) => {
      drawnItems.addLayer(e.layer);
      console.log(JSON.stringify(e.layer.toGeoJSON()));
    });
  }, []);

  return (
    <div className="map-page">
      <Navbar />
      <div className="map-container">
        <div id="map"></div>

        {/* Legend */}
        <div id="legend-box" className="legend-hidden">
          <h4>Kelas Bahaya Kekeringan</h4>
          <div className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: "#11f50a" }}
            ></span>{" "}
            Rendah
          </div>
          <div className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: "#f0ec08" }}
            ></span>{" "}
            Sedang
          </div>
          <div className="legend-item">
            <span
              className="legend-color"
              style={{ backgroundColor: "#e31a1c" }}
            ></span>{" "}
            Tinggi
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
