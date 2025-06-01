// nuxt.config.ts
export default defineNuxtConfig({
  ssr: false, // ✅ 強制禁用 SSR，避免 hydration mismatch
  devtools: { enabled: true },
  css: ['@/assets/css/tailwind.css', '@/assets/css/global.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {}
    }
  },
  experimental: {
    clientFallback: true // ✅ 為 <ClientOnly> 加強 fallback 支援（保險用）
  },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL ?? '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY ?? ''
    }
  }
})
