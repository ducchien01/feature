import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';
import {Utils} from './src/common/Utils'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port: 3002, 
  },
  resolve: {
    alias: {
        '@': path.resolve(__dirname, './src'), // Alias @ trỏ tới thư mục src
    },
},
})
