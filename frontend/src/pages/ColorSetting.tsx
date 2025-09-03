import React, { useEffect, useState } from "react";
import "../size.css";
import axios from "axios"; // HTTP istekleri için axios

interface Color {
  name: string;
  hex: string;
}

const App = () => {
  const token = localStorage.getItem("token");

  const [color, setColor] = useState<Color>({
    name: "",
    hex: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor({
      ...color,
      [e.target.name]: e.target.value, // input name değerine göre güncelle
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      console.error("Token bulunamadı!");
      return;
    }

    const payload = {
      name: color.name,
      hex: color.hex,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/colors",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // localStorage'dan al
          },
        }
      );

      alert("Renk oluşturuldu: " + JSON.stringify(response.data));
    } catch (error) {
      alert("Renk oluşturulamadı: " + error);
    }
  };

  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <h2>Renk Ayarları</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="color">
            <label htmlFor="color">renk adı</label>
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
    </div>
  );
};

export default App;
