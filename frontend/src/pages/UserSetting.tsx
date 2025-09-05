import React, { useEffect, useState } from "react";
import "../userSetting.css";
import axios from "axios";
import bcrypt from "bcryptjs";

interface User {
  id: number | null;
  email: string;
  password: string;
  isAdmin: boolean;
  isActive: boolean;
  role: string;
}

const App = () => {
  const token = localStorage.getItem("token");

  const [users, setUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const [user, setUser] = useState<User>({
    id: null,
    email: "",
    password: "",
    isAdmin: false,
    isActive: true,
    role: "",
  });

  const hashedPassword = bcrypt.hashSync(user.password, 10);

  // Kullanıcıları çek
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      console.log("Gelen kullanıcılar:", users);
    } catch (err) {
      console.error("Kullanıcılar alınamadı:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUserSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const uid = Number(e.target.value);
    setSelectedUserId(uid);
    const selected = users.find((u) => u.id === uid);
    if (selected) {
      setUser({
        ...selected,
        password: "", // şifre güvenlik sebebiyle gösterilmez
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const hashedPassword = bcrypt.hashSync(user.password, 10); // 🔁 burada hashle

    const payload = {
      email: user.email,
      hashed_password: user.password || "", // boş bile olsa tanımlı olmalı
      role: user.role,
      is_active: user.isActive,
      is_admin: user.isAdmin,
    };

    try {
      await axios.post("http://127.0.0.1:8000/api/users/register", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Kullanıcı oluşturuldu.");
      setUser({
        id: null,
        email: "",
        password: "",
        isAdmin: false,
        isActive: true,
        role: "",
      });
      setSelectedUserId(null);
      fetchUsers();
    } catch (error) {
      console.error("Kullanıcı oluşturulamadı:", error);
      

      alert("Oluşturma hatası");
    }
  };

  const handleUpdate = async () => {
    if (!token || !selectedUserId) return;

    const payload: any = {
      email: user.email,
      is_active: user.isActive,
      is_admin: user.isAdmin,
      role: user.isAdmin ? "admin" : "user",
    };

    console.log(payload);

    if (user.password.trim() !== "") {
      payload.hashed_password = user.password;
    }

    try {
      await axios.put(`http://127.0.0.1:8000/api/users/${user.id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("Kullanıcı güncellendi.");
      fetchUsers();
    } catch (error) {
      console.error("Kullanıcı güncellenemedi:", error);
    }
  };

  const handleDelete = async () => {
    if (!token || !selectedUserId) return;

    const confirmDelete = window.confirm(
      "Bu kullanıcıyı silmek istediğinize emin misiniz?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://127.0.0.1:8000/api/users/${selectedUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Kullanıcı silindi.");
      setUser({
        id: null,
        email: "",
        password: "",
        isAdmin: false,
        isActive: true,
        role: "",
      });
      setSelectedUserId(null);
      fetchUsers();
    } catch (error) {
      console.error("Kullanıcı silinemedi:", error);
    }
  };

  return (
    <div className="wrapper">
      <div className="form-wrapper">
        <h2>Kullanıcı Ayarları</h2>

        <label>Kullanıcı Seç</label>
        <select onChange={handleUserSelect} value={selectedUserId ?? ""}>
          <option value="">Yeni Kullanıcı</option>
          {users.map((u) => (
            <option key={u.id} value={u.id ?? ""}>
              {u.email}
            </option>
          ))}
        </select>

        <form onSubmit={handleCreate} className="space-y-6">
          <div className="username">
            <label htmlFor="email">E-posta</label>
            <input
              type="email"
              name="email"
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
              value={user.password}
              onChange={handleChange}
              placeholder="Yeni şifre girin (isteğe bağlı)"
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

          <div className="submit" style={{ display: "flex", gap: "1rem" }}>
            <button type="submit">Yeni Oluştur</button>
            {selectedUserId && (
              <>
                <button type="button" onClick={handleUpdate}>
                  Güncelle
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  style={{ backgroundColor: "#e74c3c", color: "#fff" }}
                >
                  Sil
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default App;
