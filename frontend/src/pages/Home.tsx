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

interface ProductImage {
  id: number;
  product_id: number;
  url: string;
  sort: number;
}

interface ProductColorImage {
  id: number;
  product_id: number;
  color_id: number;
  url: string;
  sort: number;
}

function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);

  const [productImageMap, setProductImageMap] = useState<
    Record<number, string>
  >({});
  const [productColorImageMap, setProductColorImageMap] = useState<
    Record<string, string>
  >({});

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

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const [standardRes, colorRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/productImage", { headers }),
          axios.get("http://127.0.0.1:8000/api/productColorImage", { headers }),
        ]);

        const stdMapTemp: Record<number, { url: string; sort: number }> = {};
        standardRes.data.forEach((img: ProductImage) => {
          const key = img.product_id;
          if (!(key in stdMapTemp) || img.sort < stdMapTemp[key].sort) {
            stdMapTemp[key] = { url: img.url, sort: img.sort };
          }
        });
        const stdMap: Record<number, string> = Object.fromEntries(
          Object.entries(stdMapTemp).map(([k, v]) => [k, v.url])
        );
        setProductImageMap(stdMap);

        const colorMapTemp: Record<
          string,
          { url: string; sort: number }
        > = {};
        colorRes.data.forEach((img: ProductColorImage) => {
          const key = `${img.product_id}_${img.color_id}`;
          console.log("GÖRSEL BULUNDU ->", key, img.url);

          if (!(key in colorMapTemp) || img.sort < colorMapTemp[key].sort) {
            colorMapTemp[key] = { url: img.url, sort: img.sort };
          }
        });
        const colorMap: Record<string, string> = Object.fromEntries(
          Object.entries(colorMapTemp).map(([k, v]) => [k, v.url])
        );

        setProductColorImageMap(colorMap);
      } catch (err) {
        console.error("Görseller alınamadı:", err);
      }
    };

    fetchImages();
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
    if (!selectedColor && !selectedSize) return true;
    if (p.type === "VARIANTED") return filteredVariantProductIds.has(p.id);
    return false;
  });

  if (loading) return <p>Yükleniyor...</p>;

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#d2d2d2ff",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      {user ? (
        <>
          <h2 style={{ marginBottom: "2rem", color: "#2c3e50" }}>
            Hoş geldiniz,{" "}
            <span style={{ color: "#0b4774ff" }}>{user.email}</span>!
          </h2>

          <div style={{ position: "absolute", top: "1rem", right: "2rem" }}>
            <button
              onClick={() =>
                user?.is_admin
                  ? (window.location.href = "/Create")
                  : alert("Bu kullanıcının erişim izni yok.")
              }
              style={{
                backgroundColor: "#0c476eff",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                cursor: "pointer",
                marginRight: "12px",
              }}
            >
              Admin Panel
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              style={{
                backgroundColor: "#5f140cff",
                color: "white",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Çıkış Yap
            </button>
          </div>

          {/* Filtre */}
          <div style={{ marginBottom: "2rem" }}>
            <label style={{ color: "#2c3e50" }}>
              <strong>Renk:</strong>{" "}
              <select
                value={selectedColor || ""}
                onChange={(e) =>
                  setSelectedColor(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                style={{ padding: "0.4rem", borderRadius: "4px" }}
              >
                <option value="">Tümü</option>
                {colors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ marginLeft: "1rem", color: "#2c3e50" }}>
              <strong>Beden:</strong>{" "}
              <select
                value={selectedSize || ""}
                onChange={(e) =>
                  setSelectedSize(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                style={{ padding: "0.4rem", borderRadius: "4px" }}
              >
                <option value="">Tümü</option>
                {sizes.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <h3 style={{ marginBottom: "1rem", color: "#2c3e50" }}>Ürünler:</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "1.5rem",
              marginBottom: "50px",
            }}
          >
            {filteredProducts.map((p) => {
              const productVariants = variants.filter(
                (v) =>
                  v.product_id === p.id &&
                  (!selectedColor || v.color.id === selectedColor) &&
                  (!selectedSize || v.size.id === selectedSize)
              );
              let imageUrl =
                "https://via.placeholder.com/300x180?text=No+Image";

              if (p.type === "STANDARD") {
                imageUrl = productImageMap[p.id] || imageUrl;
              } else if (productVariants.length > 0) {
                // Filtrelenmiş varyantlara bak, ilk bulduğun görseli al
                const firstImageVariant = productVariants.find((v) => {
                  const key = `${p.id}_${v.color.id}`;
                  return productColorImageMap[key]; // görsel varsa true
                });

                if (firstImageVariant) {
                  const key = `${p.id}_${firstImageVariant.color.id}`;
                  imageUrl = productColorImageMap[key];
                  console.log("VARYANT RESMİ BULUNDU:", key, "->", imageUrl);
                }

                productVariants.forEach((v) => {
                  const key = `${p.id}_${v.color.id}`;
                  if (!productColorImageMap[key]) {
                    console.warn(
                      `Eksik görsel: product_id=${p.id}, color_id=${v.color.id}`
                    );
                  }
                });

                // Eğer hiçbir varyantta resim yoksa, ürünün genel resmini dene
                if (imageUrl.includes("No+Image")) {
                  imageUrl = productImageMap[p.id] || imageUrl;
                  if (!imageUrl.includes("No+Image")) {
                    console.log(
                      "FALLBACK olarak productImageMap kullanıldı:",
                      imageUrl
                    );
                  }
                }
              }

              return (
                <div
                  key={p.id}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "12px",
                    padding: "1rem",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                    transition: "0.3s",
                    display: "flex",
                    flexDirection: "column",
                    height: "100%",
                    marginBottom: "50px",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "30%",
                      aspectRatio: "3/2",
                      borderRadius: "8px",
                      marginBottom: "1rem",
                      backgroundImage: `url(${imageUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundColor: "#eee",
                    }}
                  ></div>
                  <h4 style={{ marginBottom: "0.5rem", color: "#2c3e50" }}>
                    Ürün Adı: {p.title}
                  </h4>
                  <p
                    style={{
                      margin: "0.25rem 0",
                      fontSize: "0.9rem",
                      color: "#2c3e50",
                    }}
                  >
                    <strong>Tip:</strong> {p.type}
                  </p>
                  {p.type === "STANDARD" ? (
                    <p
                      style={{
                        fontSize: "0.9rem",
                        marginTop: "0.5rem",
                        color: "#2c3e50",
                      }}
                    >
                      <strong>Fiyat:</strong> {p.base_price ?? "Yok"} ₺<br />
                      <strong>Stok:</strong> {p.base_stock ?? "Yok"}
                    </p>
                  ) : productVariants.length > 0 ? (
                    productVariants.map((v) => {
                      const key = `${p.id}_${v.color.id}`;
                      console.log("Kontrol edilen key:", key);
                      console.log("productColorImageMap keys:", Object.keys(productColorImageMap));
                      console.log("productImageMap keys:", Object.keys(productImageMap));
                      
                      const variantImageUrl =
                        productColorImageMap[key] ||
                        productImageMap[p.id] ||
                        "https://via.placeholder.com/300x180?text=No+Image";

                      return (
                        <div
                          key={v.id}
                          style={{
                            borderTop: "1px solid #ddd",
                            marginTop: "0.75rem",
                            paddingTop: "0.5rem",
                            fontSize: "0.85rem",
                            color: "#2c3e50",
                          }}
                        >
                          <div
                            style={{
                              width: "100%",
                              height: "120px",
                              backgroundImage: `url(${variantImageUrl})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              borderRadius: "6px",
                              marginBottom: "0.5rem",
                            }}
                          ></div>

                          <div>
                            <strong>Renk:</strong> {v.color.name}
                            <span
                              style={{
                                display: "inline-block",
                                width: "12px",
                                height: "12px",
                                backgroundColor: v.color.hex,
                                marginLeft: "6px",
                                borderRadius: "50%",
                                border: "1px solid #000",
                              }}
                            ></span>
                          </div>
                          <div>
                            <strong>Beden:</strong> {v.size.code}
                          </div>
                          <div>
                            <strong>Fiyat:</strong> {v.price} ₺ |{" "}
                            <strong>Stok:</strong> {v.stock}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p style={{ fontSize: "0.85rem", color: "#2c3e50" }}>
                      Varyant bulunamadı.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <h2>Giriş yapmadınız.</h2>
          <button
            onClick={() => {
              window.location.href = "/Login";
            }}
            style={{
              backgroundColor: "#2c3e50",
              color: "white",
              border: "none",
              padding: "0.6rem 1.2rem",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Giriş Yap
          </button>
        </>
      )}
    </div>
  );
}

export default Home;