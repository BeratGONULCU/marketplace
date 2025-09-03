import React, { useEffect, useState } from "react";
import "../size.css";
import axios from "axios"; // HTTP istekleri için axios

interface Size {
  code: string;
}

const App = () => {
  const token = localStorage.getItem("token");

  const [size, setSize] = useState<Size>({
    code: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSize({
      ...size,
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
      code: size.code,
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/sizes",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // localStorage'dan al
          },
        }
      );

      alert("beden oluşturuldu: " + JSON.stringify(response.data));
      setSize({ code: "" });
    } catch (error) {
      alert("beden oluşturulamadı: " + error);
    }
  };

  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text">
            <label htmlFor="text">beden kodu</label>
            <input
              type="text"
              name="code"
              id="code"
              value={size.code}
              onChange={handleChange}
              required
              placeholder="beden kodu"
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
