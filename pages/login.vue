<template>
  <ClientOnly>
    <div class="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
      <!-- 科技背景效果 -->
      <div class="absolute inset-0">
        <!-- 漸層光暈 -->
        <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse"></div>
        
        <!-- 網格背景 -->
        <div class="absolute inset-0 bg-gradient-to-br from-gray-900/30 to-black/90"></div>
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0); background-size: 40px 40px;"></div>
      </div>

      <!-- 載入狀態 -->
      <div v-if="isLoading" class="relative z-10 text-center">
        <div class="bg-gray-900/90 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-blue-500/10">
          <!-- 載入 Spinner -->
          <div class="relative inline-flex items-center justify-center">
            <!-- 外圍發光效果 -->
            <div class="absolute w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-md opacity-40 animate-pulse"></div>
            <!-- 主要 Spinner -->
            <div class="relative w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          
          <h3 class="text-xl font-semibold text-white mt-6 mb-2">檢查登入狀態</h3>
          <p class="text-gray-400">正在驗證您的身分...</p>
        </div>
      </div>

      <!-- 登入卡片 -->
      <div v-else class="relative z-10 w-full max-w-md px-6">
        <div class="bg-gray-900/90 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-blue-500/10">
          <!-- 標題 -->
          <div class="text-center mb-8">
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-6 shadow-lg shadow-blue-500/30">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
            <h1 class="text-3xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent mb-2">
              DungeonTeamUp
            </h1>
            <p class="text-gray-400">開始你的冒險旅程</p>
          </div>

          <!-- Google 登入按鈕 -->
          <button
            @click="handleGoogleLogin"
            :disabled="signingIn"
            class="group relative w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold py-4 px-6 rounded-2xl transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <!-- 發光效果 -->
            <div class="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-300"></div>
            
            <div class="relative flex items-center justify-center space-x-3">
              <!-- Google 圖標或載入動畫 -->
              <svg v-if="!signingIn" class="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              
              <span class="text-lg">
                {{ signingIn ? '登入中...' : '使用 Google 登入' }}
              </span>
            </div>
          </button>

          <!-- 錯誤訊息 -->
          <div v-if="displayErrorMessage" class="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-300 text-sm">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span>{{ displayErrorMessage }}</span>
            </div>
          </div>

          <!-- 成功訊息 -->
          <div v-if="displaySuccessMessage" class="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-300 text-sm">
            <div class="flex items-center space-x-2">
              <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              <span>{{ displaySuccessMessage }}</span>
            </div>
          </div>

          <!-- 返回首頁 -->
          <div class="mt-6 text-center">
            <NuxtLink 
              to="/"
              class="text-gray-400 hover:text-cyan-400 transition-colors duration-200 text-sm"
            >
              返回首頁
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- ClientOnly fallback -->
    <template #fallback>
      <div class="min-h-screen bg-black text-white flex items-center justify-center">
        <div class="bg-gray-900/90 border border-white/10 rounded-3xl p-8">
          <div class="relative inline-flex items-center justify-center">
            <div class="absolute w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-md opacity-40 animate-pulse"></div>
            <div class="relative w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p class="text-gray-400 mt-4 text-center">載入中...</p>
        </div>
      </div>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
// 頁面設定
useHead({
  title: 'DungeonTeamUp - 登入',
  meta: [
    { name: 'description', content: '登入 DungeonTeamUp 開始你的冒險旅程' }
  ]
})

// 使用認證管理 composable
const {
  isSigningIn,
  errorMessage,
  successMessage,
  signInWithGoogle,
  clearMessages
} = useAuthManager()

// 頁面狀態
const isLoading = ref(true)
// 本地訊息狀態 (用於頁面初始化時的訊息)
const localSuccessMessage = ref('')
const localErrorMessage = ref('')

// 為了兼容性，保持原有的狀態命名
const signingIn = isSigningIn

// 合併訊息顯示 (優先顯示 composable 的訊息)
const displaySuccessMessage = computed(() => successMessage.value || localSuccessMessage.value)
const displayErrorMessage = computed(() => errorMessage.value || localErrorMessage.value)

// Supabase 實例
let supabase: any

// 初始化
onMounted(async () => {
  try {
    console.log('Login: 開始初始化')
    
    // 清理 URL hash 中的錯誤參數
    cleanUrlHash()
    
    // 獲取 Supabase 實例
    const nuxtApp = useNuxtApp()
    supabase = nuxtApp.$supabase
    
    if (!supabase) {
      throw new Error('Supabase 未初始化')
    }
    
    console.log('Login: Supabase 初始化完成')
    
    // 監聽認證狀態變化
    supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      console.log('Login: Auth state changed:', event, session?.user?.email)
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('Login: 用戶登入成功，導向控制面板')
        localSuccessMessage.value = '登入成功！正在導向控制面板...'
        
        // 短暫延遲讓用戶看到成功訊息
        setTimeout(() => {
          navigateTo('/dashboard')
        }, 1500)
      } else if (event === 'SIGNED_OUT') {
        console.log('Login: 用戶已登出')
      }
    })
    
    // 檢查當前登入狀態
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Login: 取得 session 失敗:', error)
      throw error
    }
    
    if (session?.user) {
      console.log('Login: 用戶已登入，導向控制面板')
      localSuccessMessage.value = '已登入，正在導向控制面板...'
      
      setTimeout(() => {
        navigateTo('/dashboard')
      }, 1000)
    } else {
      console.log('Login: 無現有登入，等待用戶操作')
    }
    
  } catch (error) {
    console.error('Login: 初始化失敗:', error)
    localErrorMessage.value = '系統初始化失敗，請重新整理頁面'
  } finally {
    isLoading.value = false
  }
})

// 清理 URL hash 參數
const cleanUrlHash = () => {
  if (typeof window !== 'undefined' && window.location.hash) {
    const hash = window.location.hash
    console.log('Login: 清理 URL hash:', hash)
    
    // 如果 hash 包含錯誤參數，清理它
    if (hash.includes('error=') || hash.includes('access_denied')) {
      history.replaceState(null, '', window.location.pathname)
      console.log('Login: URL hash 已清理')
    }
  }
}

// Google 登入 - 簡化版本（登出後會自動顯示帳號選擇）
const handleGoogleLogin = async () => {
  clearMessages()
  localSuccessMessage.value = ''
  localErrorMessage.value = ''
  // 標準 Google 登入，登出後會自動彈出帳號選擇
  await signInWithGoogle('/dashboard')
}
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