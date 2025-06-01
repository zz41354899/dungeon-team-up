<template>
  <div class="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
    <!-- 科技背景效果 -->
    <div class="absolute inset-0">
      <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse"></div>
      
      <!-- 網格背景 -->
      <div class="absolute inset-0 bg-gradient-to-br from-gray-900/30 to-black/90"></div>
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0); background-size: 40px 40px;"></div>
    </div>

    <!-- 載入狀態 -->
    <div class="relative z-10 text-center">
      <div class="bg-gray-900/90 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-blue-500/10">
        <!-- 載入 Spinner -->
        <div class="relative inline-flex items-center justify-center">
          <!-- 外圍發光效果 -->
          <div class="absolute w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-md opacity-40 animate-pulse"></div>
          <!-- 主要 Spinner -->
          <div class="relative w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        
        <h3 class="text-xl font-semibold text-white mt-6 mb-2">{{ statusMessage }}</h3>
        <p class="text-gray-400">{{ detailMessage }}</p>

        <!-- 錯誤狀態 -->
        <div v-if="hasError" class="mt-6">
          <div class="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-300 text-sm mb-4">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ errorMessage }}</span>
            </div>
          </div>
          
          <NuxtLink 
            to="/login"
            class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl transition-colors duration-200 hover:shadow-lg hover:shadow-blue-500/25"
          >
            返回登入頁面
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 頁面設定
useHead({
  title: 'DungeonTeamUp - 登入處理中',
  meta: [
    { name: 'description', content: '正在處理您的登入資訊' }
  ]
})

// 狀態管理
const statusMessage = ref('處理登入中')
const detailMessage = ref('正在驗證您的身分...')
const hasError = ref(false)
const errorMessage = ref('')

// 處理 OAuth 回調
onMounted(async () => {
  try {
    console.log('AuthCallback: 開始處理 OAuth 回調')
    
    // 獲取 URL 參數
    const route = useRoute()
    const redirectTo = (route.query.redirect as string) || '/dashboard'
    
    console.log('AuthCallback: 目標重導向頁面:', redirectTo)
    
    // 獲取 Supabase 實例
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase
    
    if (!supabase) {
      throw new Error('Supabase 未初始化')
    }
    
    console.log('AuthCallback: Supabase 初始化完成')
    
    // 檢查 OAuth 回調是否成功
    statusMessage.value = '驗證登入狀態'
    detailMessage.value = '正在確認您的身分...'
    
    // 等待一下讓 Supabase 處理 OAuth 回調
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('AuthCallback: 取得 session 失敗:', sessionError)
      throw sessionError
    }
    
    if (!session?.user) {
      console.error('AuthCallback: 未找到有效的 session 或用戶')
      throw new Error('登入驗證失敗，請重新嘗試')
    }
    
    console.log('AuthCallback: 登入成功，用戶:', session.user.email)
    
    // 更新狀態訊息
    statusMessage.value = '登入成功！'
    detailMessage.value = `歡迎回來，${session.user.email?.split('@')[0] || '冒險者'}！`
    
    // 短暫顯示成功訊息
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 導向目標頁面
    console.log('AuthCallback: 導向目標頁面:', redirectTo)
    statusMessage.value = '正在導向'
    detailMessage.value = '請稍候...'
    
    await navigateTo(redirectTo)
    
  } catch (error: any) {
    console.error('AuthCallback: 處理失敗:', error)
    
    hasError.value = true
    statusMessage.value = '登入失敗'
    detailMessage.value = '處理您的登入時發生錯誤'
    errorMessage.value = error?.message || '未知錯誤，請重新嘗試'
    
    // 如果是 OAuth 錯誤，嘗試從 URL 中解析
    const route = useRoute()
    if (route.query.error) {
      const oauthError = route.query.error as string
      const errorDescription = route.query.error_description as string || ''
      
      console.error('AuthCallback: OAuth 錯誤:', oauthError, errorDescription)
      
      switch (oauthError) {
        case 'access_denied':
          errorMessage.value = '您拒絕了登入授權，請重新嘗試'
          break
        case 'invalid_request':
          errorMessage.value = '登入請求無效，請檢查設定'
          break
        case 'server_error':
          errorMessage.value = '伺服器錯誤，請稍後再試'
          break
        default:
          errorMessage.value = `登入錯誤：${errorDescription || oauthError}`
      }
    }
  }
})
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.8; }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

.animate-pulse {
  animation: pulse 4s ease-in-out infinite;
}
</style> 