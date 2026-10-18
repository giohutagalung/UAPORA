/*
 * Konfigurasi UAPORA
 * WEBSITE_URL adalah alamat website, bukan Google Form.
 * GOOGLE_FORM_URL harus diisi dengan link responden Google Forms, contohnya:
 * https://docs.google.com/forms/d/e/FORM_ID/viewform
 * atau https://forms.gle/FORM_ID
 */
window.UAPORA_CONFIG = {
  WEBSITE_URL: "https://giohutagalung.github.io/UAPORA/",
  GOOGLE_FORM_URL: "https://forms.gle/Jcy4Tf3F9zjmMxhT9", // Link responden UAPORA dari pengguna.
  MAX_TOPPINGS: 2,
  ingredients: {
    gurih: [
      { id: "singkong", name: "Singkong", note: "Tekstur lembut", color: "#f1dfb9" },
      { id: "ubi", name: "Ubi", note: "Warna alami", color: "#d9a4ba" },
      { id: "jagung", name: "Jagung", note: "Manis alami", color: "#f2cb55" }
    ],
    manis: [
      { id: "pisang", name: "Pisang", note: "Aroma khas", color: "#f2d36d" },
      { id: "ubi", name: "Ubi", note: "Warna alami", color: "#d9a4ba" },
      { id: "singkong", name: "Singkong", note: "Tekstur lembut", color: "#f1dfb9" }
    ]
  },
  toppings: {
    gurih: [
      { id: "bawang", name: "Taburan bawang", note: "Opsi konsep" },
      { id: "herbal", name: "Herba pilihan", note: "Opsi konsep" },
      { id: "saus-gurih", name: "Saus gurih", note: "Opsi konsep" }
    ],
    manis: [
      { id: "kelapa", name: "Kelapa parut", note: "Opsi konsep" },
      { id: "wijen", name: "Taburan wijen", note: "Opsi konsep" },
      { id: "saus-manis", name: "Saus manis", note: "Opsi konsep" }
    ]
  }
};
