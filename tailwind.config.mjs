// tailwind.config.cjs
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{astro,html,js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        clay: {
          primary: "#6C7A89",
          secondary: "#ABB7B7",
          accent: "#F2784B",
          neutral: "#ECF0F1",
          "base-100": "#F8F8F4",
          info: "#00BCD4",
          success: "#2ECC71",
          warning: "#F39C12",
          error: "#E74C3C",
        },
      },
      "nord",
      "dim", // DaisyUI のビルトイン "dim" テーマを利用
    ],
  },
};
