import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],build: {
    // บังคับให้บิวด์ผ่านสภาวะเออร์เรอร์เล็กๆ น้อยๆ และข้ามการแจ้งเตือนเรื่องขนาดไฟล์
    chunkSizeWarningLimit: 1600,
  }
})
