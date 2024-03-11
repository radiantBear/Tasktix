import type { Config } from "tailwindcss";
import {nextui} from "@nextui-org/react";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    themes: {
      dark: {
        colors: {
          primary: {
            50: "#05281e",
            100: "#0a3f30",
            200: "#115743",
            300: "#1b6e56",
            400: "#29856b",
            500: "#3e9d82",
            600: "#80cbb6",
            700: "#97d7c5",
            800: "#b0e3d4",
            900: "#e8faf5",
            DEFAULT: "#29856b",
            foreground: "#ffffff",
          }
        }
      }
    }
  })],
};
export default config;
