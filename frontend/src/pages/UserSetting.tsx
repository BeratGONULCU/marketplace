import React, { useEffect, useState } from "react";
import "../userSetting.css";
import axios from "axios";

const App = () => {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState({
    id: null,
    email: "example@email.com",
    password: "",
    isAdmin: false,
    isActive: true,
    role: "",
  });

  // FastAPI'dan data al
  /*useEffect(() => {
    const fetchUser = async () => {
      try {
        const payload = {
          email: user.email,
          password: user.password,
          is_active: user.isActive,
          is_admin: user.isAdmin,
          role: user.role,
        };

        const response = await axios.post(
          "http://127.0.0.1:8000/api/users/register",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // localStorage'dan al
            },
          }
        );
        const { data } = response.data;

        //setUser({
        //id : data.user_id,
        //email: data.email,
        //password: "",
        //isAdmin: data.is_admin,
        //isActive: data.is_active,
        //role: data.role,
        //});
      } catch (error) {
        console.error("Kullanıcı verisi alınamadı:", error);
      }
    };
    fetchUser();
  }, []); // Boş bağımlılık dizisi ile sadece bir kez çalışır

  */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      console.error("Token bulunamadı!");
      return;
    }

    const payload = {
      email: user.email,
      hashed_password: user.password, 
      is_active: user.isActive,
      is_admin: user.isAdmin,
      role: user.isAdmin ? "admin" : "user",
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/users/register",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // localStorage'dan al
          },
        }
      );

      console.log("kullanıcı oluşturuldu:", response.data);
    } catch (error) {
      console.error("kullanıcı oluşturulamadı:", error);
    }
  };

  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <h2>Kullanıcı Ayarları</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="username">
            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              name="email"
              id="email"
              value={user.email}
              onChange={handleChange}
              required
              placeholder="example@email.com"
            />
          </div>

          <div className="password">
            <label htmlFor="password">Şifre</label>
            <input
              type="password"
              name="password"
              id="password"
              value={user.password}
              onChange={handleChange}
              placeholder="Yeni şifrenizi girin (isteğe bağlı)"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="isAdmin"
                name="isAdmin"
                type="checkbox"
                checked={user.isAdmin}
                onChange={handleChange}
              />
              <label htmlFor="isAdmin" className="ml-2">
                Yönetici Hesabı
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={user.isActive}
                onChange={handleChange}
              />
              <label htmlFor="isActive" className="ml-2">
                Hesap Aktif
              </label>
            </div>
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
function SHA256(password: string) {
  throw new Error("Function not implemented.");
}
