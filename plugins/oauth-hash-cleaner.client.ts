/**
 * OAuth Hash 清理 Plugin
 * 清理 Supabase OAuth 回調時產生的 #access_token=... 等 hash 片段
 * 避免 Vue Router 將其誤認為路由 selector
 */

export default defineNuxtPlugin((nuxtApp) => {
  // 清理 OAuth hash 片段
  const cleanOAuthHash = () => {
    if (typeof window === 'undefined') return

    const hash = window.location.hash
    
    // 檢查是否包含 OAuth 相關的 hash 參數
    if (hash && (hash.includes('access_token') || hash.includes('refresh_token') || hash.includes('token_type'))) {
      console.log('OAuth Hash Cleaner: 偵測到 OAuth hash 參數，正在清理:', hash)
      
      // 清除 hash 並保持當前路徑
      const cleanUrl = window.location.href.split('#')[0]
      window.history.replaceState(null, '', cleanUrl)
      
      console.log('OAuth Hash Cleaner: 已清理 OAuth hash 參數')
    }
  }

  // 在頁面載入完成後執行清理
  nuxtApp.hook('page:finish', () => {
    cleanOAuthHash()
  })

  // 在 app 啟動時也執行一次清理
  nuxtApp.hook('app:mounted', () => {
    cleanOAuthHash()
  })

  // 監聽 popstate 事件（瀏覽器前進/後退）
  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', () => {
      setTimeout(cleanOAuthHash, 0)
    })
  }
}) 