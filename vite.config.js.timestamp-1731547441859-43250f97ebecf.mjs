// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///H:/zhuwenrui/web-plumb-system/node_modules/vite/dist/node/index.js";
import vue from "file:///H:/zhuwenrui/web-plumb-system/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///H:/zhuwenrui/web-plumb-system/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import vueDevTools from "file:///H:/zhuwenrui/web-plumb-system/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
import postCssPxToRem from "file:///H:/zhuwenrui/web-plumb-system/node_modules/postcss-pxtorem/index.js";
var __vite_injected_original_import_meta_url = "file:///H:/zhuwenrui/web-plumb-system/vite.config.js";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools()
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  css: {
    postcss: {
      plugins: [
        postCssPxToRem({
          // 自适应，px>rem转换
          rootValue: 192,
          propList: ["*"],
          exclude: /(node_module)/,
          selectorBlackList: ["norem"]
          // 过滤掉norem-开头的class，不进行rem转换，这个内容可以不写
        })
      ]
    }
  },
  server: {
    host: "0.0.0.0",
    port: 8080,
    open: false,
    cors: true,
    proxy: {
      "/api": {
        target: "http://192.168.1.24:8008/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "")
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: "[ext]/[name]-[hash].[ext]",
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return id.toString().split("node_modules/")[1].split("/")[0].toString();
          }
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJIOlxcXFx6aHV3ZW5ydWlcXFxcd2ViLXBsdW1iLXN5c3RlbVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiSDpcXFxcemh1d2VucnVpXFxcXHdlYi1wbHVtYi1zeXN0ZW1cXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0g6L3podXdlbnJ1aS93ZWItcGx1bWItc3lzdGVtL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnXHJcblxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZSdcclxuaW1wb3J0IHZ1ZUpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUtanN4J1xyXG5pbXBvcnQgdnVlRGV2VG9vbHMgZnJvbSAndml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzJ1xyXG5pbXBvcnQgcG9zdENzc1B4VG9SZW0gZnJvbSAncG9zdGNzcy1weHRvcmVtJ1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoKSxcclxuICAgIHZ1ZUpzeCgpLFxyXG4gICAgdnVlRGV2VG9vbHMoKSxcclxuICBdLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgICdAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpXHJcbiAgICB9XHJcbiAgfSxcclxuICBjc3M6IHtcclxuICAgIHBvc3Rjc3M6IHtcclxuICAgICAgcGx1Z2luczogW1xyXG4gICAgICAgIHBvc3RDc3NQeFRvUmVtKHtcclxuICAgICAgICAgIC8vIFx1ODFFQVx1OTAwMlx1NUU5NFx1RkYwQ3B4PnJlbVx1OEY2Q1x1NjM2MlxyXG4gICAgICAgICAgcm9vdFZhbHVlOiAxOTIsXHJcbiAgICAgICAgICBwcm9wTGlzdDogWycqJ10sXHJcbiAgICAgICAgICBleGNsdWRlOiAvKG5vZGVfbW9kdWxlKS8sXHJcbiAgICAgICAgICBzZWxlY3RvckJsYWNrTGlzdDogWydub3JlbSddLCAvLyBcdThGQzdcdTZFRTRcdTYzODlub3JlbS1cdTVGMDBcdTU5MzRcdTc2ODRjbGFzc1x1RkYwQ1x1NEUwRFx1OEZEQlx1ODg0Q3JlbVx1OEY2Q1x1NjM2Mlx1RkYwQ1x1OEZEOVx1NEUyQVx1NTE4NVx1NUJCOVx1NTNFRlx1NEVFNVx1NEUwRFx1NTE5OVxyXG4gICAgICAgIH0pLFxyXG4gICAgICBdLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogXCIwLjAuMC4wXCIsXHJcbiAgICBwb3J0OiA4MDgwLFxyXG4gICAgb3BlbjogZmFsc2UsXHJcbiAgICBjb3JzOiB0cnVlLFxyXG4gICAgcHJveHk6IHtcclxuICAgICAgJy9hcGknOiB7XHJcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovLzE5Mi4xNjguMS4yNDo4MDA4LycsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGkvLCBcIlwiKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2pzL1tuYW1lXS1baGFzaF0uanMnLFxyXG4gICAgICAgIGVudHJ5RmlsZU5hbWVzOiAnanMvW25hbWVdLVtoYXNoXS5qcycsXHJcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdbZXh0XS9bbmFtZV0tW2hhc2hdLltleHRdJyxcclxuICAgICAgICBtYW51YWxDaHVua3M6IChpZCkgPT4ge1xyXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMnKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gaWQudG9TdHJpbmcoKS5zcGxpdCgnbm9kZV9tb2R1bGVzLycpWzFdLnNwbGl0KCcvJylbMF0udG9TdHJpbmcoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1EsU0FBUyxlQUFlLFdBQVc7QUFFbFQsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sWUFBWTtBQUNuQixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLG9CQUFvQjtBQU40SSxJQUFNLDJDQUEyQztBQVN4TixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFDSixPQUFPO0FBQUEsSUFDUCxZQUFZO0FBQUEsRUFDZDtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxjQUFjLElBQUksSUFBSSxTQUFTLHdDQUFlLENBQUM7QUFBQSxJQUN0RDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLEtBQUs7QUFBQSxJQUNILFNBQVM7QUFBQSxNQUNQLFNBQVM7QUFBQSxRQUNQLGVBQWU7QUFBQTtBQUFBLFVBRWIsV0FBVztBQUFBLFVBQ1gsVUFBVSxDQUFDLEdBQUc7QUFBQSxVQUNkLFNBQVM7QUFBQSxVQUNULG1CQUFtQixDQUFDLE9BQU87QUFBQTtBQUFBLFFBQzdCLENBQUM7QUFBQSxNQUNIO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFFBQVE7QUFBQSxRQUNOLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQyxTQUFTLEtBQUssUUFBUSxVQUFVLEVBQUU7QUFBQSxNQUM5QztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxlQUFlO0FBQUEsTUFDYixRQUFRO0FBQUEsUUFDTixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixnQkFBZ0I7QUFBQSxRQUNoQixjQUFjLENBQUMsT0FBTztBQUNwQixjQUFJLEdBQUcsU0FBUyxjQUFjLEdBQUc7QUFDL0IsbUJBQU8sR0FBRyxTQUFTLEVBQUUsTUFBTSxlQUFlLEVBQUUsQ0FBQyxFQUFFLE1BQU0sR0FBRyxFQUFFLENBQUMsRUFBRSxTQUFTO0FBQUEsVUFDeEU7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
