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

function Create() {
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

  const btnStyle = {
    backgroundColor: "#3498db",
    color: "white",
    border: "none",
    padding: "0.4rem 0.6rem",
    borderRadius: "4px",
    fontSize: "0.85rem",
    cursor: "pointer",
  };

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

          <div style={{ margin: "2rem 0" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "0.5rem",
                marginBottom: "0.5rem",
              }}
            >
              <button style={btnStyle} onClick={() => { window.location.href = "/UserSetting";}}>Kullanıcı Ayarları</button>
              <button style={btnStyle} onClick={() => { window.location.href = "/ProductSetting"; }}>Ürün Ayarları</button>
              <button style={btnStyle} onClick={() => { window.location.href = "/ProductVariantSetting"; }}>Varyant Ürün Ayarları</button>
              <button style={btnStyle} onClick={() => { window.location.href = "/SizeSetting"; }}>Beden Ayarları</button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "0.5rem",
              }}
            >
              <button style={btnStyle} onClick={() => { window.location.href = "/CategorySetting"; }}>Kategori Ayarları</button>
              <button style={btnStyle} onClick={() => { window.location.href = "/ColorSetting"; }}>Renk Ayarları</button>
              <button style={btnStyle} onClick={() => { window.location.href = ""; }}>Ürün içi Resim Ayarları</button>
              <button style={btnStyle} onClick={() => { window.location.href = ""; }}>Ürün Resim-renk Ayarları</button>
            </div>
          </div>

          <div>
            <p> not: variant ürün eklemek istenirse önce ürün ayarlarından fiyat ve stok 0 olacak şekilde ürün girişi sağlaması gerekiyor. </p>
          </div>
        </>
      ) : (
        <h2>Giriş yapmadınız.</h2>
      )}
    </div>
  );
}

export default Create;
