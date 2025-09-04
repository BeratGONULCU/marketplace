import React, { useEffect, useState } from "react";
import "../main.css";
import axios from "axios";

interface Color {
  id?: number;
  name: string;
  hex: string;
}

const App = () => {
  const token = localStorage.getItem("token");

  const [color, setColor] = useState<Color>({ name: "", hex: "" });
  const [allColors, setAllColors] = useState<Color[]>([]);
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editHex, setEditHex] = useState("");

  const fetchColors = async () => {
    if (!token) return;
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/colors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAllColors(response.data);
    } catch (error) {
      console.error("Renkler alınamadı:", error);
    }
  };

  useEffect(() => {
    fetchColors();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor({ ...color, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) return;

    const payload = { name: color.name, hex: color.hex };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/colors",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Renk oluşturuldu: " + JSON.stringify(response.data));
      setColor({ name: "", hex: "" });
      fetchColors(); // listeyi güncelle
    } catch (error) {
      alert("Renk oluşturulamadı: " + error);
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = parseInt(e.target.value);
    const found = allColors.find((c) => c.id === selectedId);
    if (found) {
      setSelectedColorId(found.id || null);
      setEditName(found.name);
      setEditHex(found.hex);
    }
  };

  const handleUpdate = async () => {
    if (!token || !selectedColorId) return;

    try {
      await axios.put(
        `http://127.0.0.1:8000/api/colors/${selectedColorId}`,
        { name: editName, hex: editHex },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Renk güncellendi.");
      fetchColors();
    } catch (error) {
      alert("Renk güncellenemedi: " + error);
    }
  };

  const handleDelete = async () => {
    if (!token || !selectedColorId) return;

    const confirmDelete = window.confirm("Bu rengi silmek istediğinizden emin misiniz?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/colors/${selectedColorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Renk silindi.");
      setSelectedColorId(null);
      setEditName("");
      setEditHex("");
      fetchColors();
    } catch (error) {
      alert("Renk silinemedi: " + error);
    }
  };

  return (
    <div className="wrapper">
      {/* Sol: Renk oluşturma */}
      <div className="form-wrapper">
        <h2>Renk Ayarları</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="color">
            <label htmlFor="name">renk adı</label>
            <input
              type="text"
              name="name"
              id="name"
              value={color.name}
              onChange={handleChange}
              required
              placeholder="renk adı"
            />
          </div>

          <div className="hex">
            <label htmlFor="hex">hex kodu</label>
            <input
              type="text"
              name="hex"
              id="hex"
              value={color.hex}
              onChange={handleChange}
              required
              placeholder="örn: #0C6700"
            />
          </div>

          <div className="submit">
            <button type="submit">Ayarları Kaydet</button>
          </div>
        </form>
      </div>

      {/* Sağ: Renk güncelle / sil */}
      <div className="form-wrapper">
        <div className="color">
          <label>Renk Seç:</label>
          <select value={selectedColorId || ""} onChange={handleSelect}>
            <option value="">-- Seçiniz --</option>
            {allColors.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.hex})
              </option>
            ))}
          </select>
        </div>

        {selectedColorId && (
          <>
            <div className="color">
              <label>Yeni Renk Adı</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>

            <div className="hex">
              <label>Yeni Hex</label>
              <input
                type="text"
                value={editHex}
                onChange={(e) => setEditHex(e.target.value)}
              />
            </div>

            <div className="submit" style={{ display: "flex", gap: "1rem" }}>
              <button type="button" onClick={handleUpdate}>
                Güncelle
              </button>
              <button
                type="button"
                onClick={handleDelete}
                style={{ backgroundColor: "#e74c3c" }}
              >
                Sil
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default App;
