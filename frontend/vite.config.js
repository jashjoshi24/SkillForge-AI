import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// SkillForge AI frontend — Module B/C/D screens (Member 1).
// VITE_API_URL points at the FastAPI backend; see .env.example.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
});
