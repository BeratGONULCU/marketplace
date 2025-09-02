import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  email: string;
  is_admin: boolean;
  is_active: boolean;
}

interface ProductVariant {
  id: number;
  product_id: number;
  price: number;
  stock: number;
  color: { id: number; name: string; hex: string };
  size: { id: number; code: string };
  barcode: string;
  sku: string;
}

interface Product {
  id: number;
  title: string;
  type: string; // "STANDARD" | "VARIANTED"
  description: string;
  base_price: number | null;
  base_stock: number | null;
  is_published: boolean;
  user_id: number;
}

interface Color {
  id: number;
  name: string;
  hex: string;
}

interface Size {
  id: number;
  code: string;
}

function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userRes = await axios.get("http://127.0.0.1:8000/api/users/me", {
          headers,
        });
        setUser(userRes.data);

        const [productRes, colorRes, sizeRes, variantRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/products", { headers }),
          axios.get("http://127.0.0.1:8000/api/colors", { headers }),
          axios.get("http://127.0.0.1:8000/api/sizes", { headers }),
          axios.get("http://127.0.0.1:8000/api/products/products/variants", {
            headers,
          }),
        ]);

        setProducts(productRes.data);
        setColors(colorRes.data);
        setSizes(sizeRes.data);
        setVariants(variantRes.data);
      } catch (err) {
        console.error("Veri çekme hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const filteredVariants = variants.filter((v) => {
    return (
      (!selectedColor || v.color.id === selectedColor) &&
      (!selectedSize || v.size.id === selectedSize)
    );
  });

  const filteredVariantProductIds = new Set(
    filteredVariants.map((v) => v.product_id)
  );

  const filteredProducts = products.filter((p) => {
    // Filtre yoksa tüm ürünler gösterilsin
    if (!selectedColor && !selectedSize) return true;

    // Varyanted ürünleri filtreye göre göster
    if (p.type === "VARIANTED") {
      return filteredVariantProductIds.has(p.id);
    }

    // STANDARD ürünleri sadece filtre yoksa göster (yukarıda zaten kontrol ettik)
    return false;
  });

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      {user ? (
        <>
          <h2>Hoş geldiniz, {user.email}!</h2>

          <div style={{ position: "absolute", top: "1rem", right: "1rem" }}>
            <button
              onClick={() => {
                if (user?.is_admin) {
                  window.location.href = "/Create";
                }
                else{
                  alert("bu kullanıcının erişim izni yok");
                }
              }}
              style={{
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "20px",
              }}
            >
              Ekleme Sayfası
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              style={{
                backgroundColor: "#e74c3c",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Çıkış Yap
            </button>
          </div>

          {/* Filtre alanı */}
          <div style={{ marginBottom: "1rem" }}>
            <label>
              Renk:
              <select
                value={selectedColor || ""}
                onChange={(e) =>
                  setSelectedColor(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
              >
                <option value="">Tümü</option>
                {colors.map((color) => (
                  <option key={color.id} value={color.id}>
                    {color.name}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ marginLeft: "1rem" }}>
              Beden:
              <select
                value={selectedSize || ""}
                onChange={(e) =>
                  setSelectedSize(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
              >
                <option value="">Tümü</option>
                {sizes.map((size) => (
                  <option key={size.id} value={size.id}>
                    {size.code}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <h3>Ürünler:</h3>
          {filteredProducts.length > 0 ? (
            <div
              style={{
                backgroundColor: "#f0f0f0", // Gri arka plan
                padding: "1rem",
                borderRadius: "8px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1rem",
                }}
              >
                {filteredProducts.map((p) => {
                  const productVariants = variants.filter(
                    (v) => Number(v.product_id) === Number(p.id)
                  );

                  return (
                    <div
                      key={p.id}
                      style={{
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        padding: "1rem",
                        backgroundColor: "#ffffff",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        color: "#000000", // Yazılar siyah
                      }}
                    >
                      <h4 style={{ color: "#000" }}>{p.title}</h4>
                      <p style={{ color: "#000" }}>Tip: {p.type}</p>
                      {p.type === "STANDARD" ? (
                        <p style={{ color: "#000" }}>
                          Fiyat: {p.base_price ?? "Yok"} <br />
                          Stok: {p.base_stock ?? "Yok"}
                        </p>
                      ) : productVariants.length > 0 ? (
                        <>
                          {productVariants.map((v) => (
                            <div
                              key={v.id}
                              style={{
                                borderTop: "1px solid #eee",
                                paddingTop: "0.5rem",
                                marginTop: "0.5rem",
                                fontSize: "0.9rem",
                                color: "#000",
                              }}
                            >
                              <div>
                                <strong>Renk:</strong> {v.color.name}{" "}
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "12px",
                                    height: "12px",
                                    backgroundColor: v.color.hex,
                                    marginLeft: "4px",
                                    border: "1px solid #000",
                                  }}
                                ></span>
                              </div>
                              <div>
                                <strong>Beden:</strong> {v.size.code}
                              </div>
                              <div>
                                <strong>Fiyat:</strong> {v.price} |{" "}
                                <strong>Stok:</strong> {v.stock}
                              </div>
                            </div>
                          ))}
                        </>
                      ) : (
                        <p style={{ color: "#000" }}>Varyant bulunamadı.</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <p>Seçilen filtreye uygun ürün bulunamadı.</p>
          )}
        </>
      ) : (
        <h2>Giriş yapmadınız.</h2>
      )}
    </div>
  );
}

export default Home;
