import React from "react";

function Page() {
  // Tüm yol: eg. 'http://localhost:5173/src/pages/HomePage.tsx'
  const fullUrl = import.meta.url;

  // Sadece dosya adı: eg. 'HomePage.tsx'
  const filename = new URL(fullUrl).pathname.split("/").pop();

  // Uzantısız ad: eg. 'HomePage'
  const sayfaAdi = filename?.split(".")[0];

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Hoş geldiniz!</h1>
      <h2>{sayfaAdi}</h2>
    </div>
  );
}

export default Page;
