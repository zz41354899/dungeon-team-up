<template>
    <div class="min-h-screen bg-black text-white relative overflow-hidden">
      <!-- 純黑背景與漸層光暈 -->
      <div class="absolute inset-0">
        <!-- 漸層光暈效果 -->
        <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl"></div>
        <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-transparent rounded-full blur-3xl"></div>
      </div>
  
      <!-- 固定導覽列 -->
      <nav class="fixed top-6 left-6 right-6 z-50 flex items-center justify-between max-md:top-4 max-md:left-4 max-md:right-4">
        <!-- Logo -->
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center max-md:w-8 max-md:h-8">
            <svg class="w-6 h-6 text-white max-md:w-5 max-md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 8.172V5L8 4z"/>
            </svg>
          </div>
          <h1 class="text-xl font-bold text-white max-md:text-lg">
            DungeonTeamUp
          </h1>
        </div>
        
        <!-- 導覽按鈕 -->
        <div class="flex items-center space-x-3 max-md:space-x-2">
          <NuxtLink 
            v-if="user"
            to="/dashboard"
            class="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-xl transition-colors text-sm font-medium text-blue-300 max-md:px-3 max-md:py-2 max-md:text-xs"
          >
            控制面板
          </NuxtLink>
          <NuxtLink 
            v-else
            to="/login"
            class="border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-xl transition-colors max-md:px-4 max-md:py-2 max-md:text-sm"
          >
            開始冒險
          </NuxtLink>
        </div>
      </nav>
  
      <!-- 主要內容 -->
      <div class="relative z-10 min-h-screen flex items-center justify-center">
        <div class="max-w-screen-lg mx-auto px-4 sm:px-8 text-center animate-fade-in max-md:px-4">
          
          <!-- Beta 標籤 -->
          <div class="inline-flex items-center px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-sm text-cyan-300 mb-8 max-md:mb-6 max-md:px-3 max-md:py-2 max-md:text-xs">
            <span class="w-2 h-2 bg-cyan-400 rounded-full mr-2 animate-pulse max-md:w-1.5 max-md:h-1.5"></span>
            Beta Version 1.0
          </div>
          
          <!-- 主標題 -->
          <h1 class="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight tracking-tight max-md:text-3xl max-md:mb-4">
            <span class="bg-gradient-to-r from-white via-cyan-200 to-blue-200 bg-clip-text text-transparent">
              DungeonTeamUp
            </span>
            <br>
            <span class="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              組團打地下城
            </span>
          </h1>
          
          <!-- 副標題 -->
          <p class="text-lg sm:text-xl text-zinc-300/90 mb-4 max-w-3xl mx-auto leading-relaxed tracking-wider max-md:text-base max-md:mb-3">
            一起完成副本任務
          </p>
          
          <p class="text-base text-zinc-400 max-w-2xl mx-auto mb-12 max-md:text-sm max-md:mb-8">
            連結志同道合的冒險者，組建最強團隊，征服每一個挑戰
          </p>
  
          <!-- CTA 按鈕組 -->
          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 max-md:mb-24 max-md:gap-4 max-md:w-full">
            <button 
              @click="openSearchModal"
              class="border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-xl transition-colors flex items-center space-x-3 max-md:w-full max-md:px-8 max-md:py-4 max-md:text-lg max-md:font-medium max-md:justify-center"
            >
              <svg class="w-5 h-5 max-md:w-6 max-md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <span>瀏覽任務</span>
            </button>
            
            <button 
              @click="openProfilesModal"
              class="border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-xl transition-colors flex items-center space-x-3 max-md:w-full max-md:px-8 max-md:py-4 max-md:text-lg max-md:font-medium max-md:justify-center"
            >
              <svg class="w-5 h-5 max-md:w-6 max-md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <span>顯示角色卡</span>
            </button>
          </div>
  
          <!-- 特色圖標 -->
          <div class="grid grid-cols-3 gap-8 max-w-md mx-auto max-md:fixed max-md:bottom-6 max-md:left-0 max-md:right-0 max-md:bg-black/80 max-md:backdrop-blur-sm max-md:border-t max-md:border-white/10 max-md:p-4 max-md:gap-0 max-md:max-w-none">
            <div class="flex flex-col items-center space-y-3 max-md:space-y-2">
              <div class="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center max-md:w-12 max-md:h-12 max-md:rounded-xl">
                <svg class="w-6 h-6 text-cyan-400 max-md:w-5 max-md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <span class="text-sm text-gray-400 max-md:text-xs">組隊</span>
            </div>
            
            <div class="flex flex-col items-center space-y-3 max-md:space-y-2">
              <div class="w-16 h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center max-md:w-12 max-md:h-12 max-md:rounded-xl">
                <svg class="w-6 h-6 text-purple-400 max-md:w-5 max-md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span class="text-sm text-gray-400 max-md:text-xs">任務</span>
            </div>
            
            <div class="flex flex-col items-center space-y-3 max-md:space-y-2">
              <div class="w-16 h-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center max-md:w-12 max-md:h-12 max-md:rounded-xl">
                <svg class="w-6 h-6 text-emerald-400 max-md:w-5 max-md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                </svg>
              </div>
              <span class="text-sm text-gray-400 max-md:text-xs">冒險</span>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 底部裝飾 - 桌面版顯示 -->
      <div class="absolute bottom-6 left-1/2 transform -translate-x-1/2 max-md:hidden">
        <div class="flex space-x-3">
          <div class="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></div>
          <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style="animation-delay: 0.3s;"></div>
          <div class="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style="animation-delay: 0.7s;"></div>
          <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" style="animation-delay: 1s;"></div>
        </div>
      </div>
  
      <!-- 搜尋任務模態框 -->
      <div v-if="showSearchModal" class="fixed inset-0 z-[9999] flex items-center justify-center">
        <div class="absolute inset-0 bg-black/70" @click="closeSearchModal"></div>
        <div class="relative max-w-2xl w-full mx-4 bg-gray-900/90 border border-white/10 rounded-2xl shadow-md p-6 max-md:max-w-[90vw] max-md:mx-4 max-md:p-4">
          <div class="flex justify-between items-center mb-6 max-md:mb-4">
            <h3 class="text-2xl font-bold text-white max-md:text-xl">所有任務</h3>
            <button 
              @click="closeSearchModal"
              class="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
  
          <!-- 搜尋輸入 -->
          <div class="mb-6 max-md:mb-4">
            <div class="relative">
              <input 
                v-model="searchQuery"
                type="text" 
                class="w-full bg-black/30 border border-white/20 rounded-xl px-4 py-3 pl-12 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 max-md:px-3 max-md:py-3 max-md:pl-10"
                placeholder="搜尋任務關鍵字..."
                @input="searchMissions"
              />
              <svg class="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2 max-md:left-3 max-md:w-4 max-md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
  
          <!-- 任務結果 -->
          <div class="max-h-96 overflow-y-auto max-md:max-h-80">
            <div v-if="searchLoading" class="text-center py-8">
              <div class="w-8 h-8 border-2 border-blue-300/30 border-t-blue-300 rounded-full animate-spin mx-auto"></div>
              <p class="text-gray-400 mt-4">載入任務中...</p>
            </div>
            <div v-else-if="allMissions.length === 0" class="text-center py-8">
              <p class="text-gray-400">目前沒有任務</p>
            </div>
            <div v-else class="space-y-3">
              <div 
                v-for="mission in filteredMissions" 
                :key="mission.id"
                class="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors max-md:p-3"
              >
                <div class="flex items-start justify-between">
                  <div>
                    <h4 class="text-lg font-semibold text-white mb-2 max-md:text-base">{{ mission.title }}</h4>
                    <p class="text-sm text-gray-400 mb-3 max-md:text-xs max-md:mb-2">{{ mission.description || '無說明' }}</p>
                    <div class="flex items-center space-x-3 flex-wrap gap-2 max-md:gap-1">
                      <span class="px-3 py-1 bg-emerald-500/20 rounded-lg text-xs text-emerald-300 max-md:px-2 max-md:py-1">
                        專案：{{ mission.projects?.title || '未知專案' }}
                      </span>
                      <span class="px-3 py-1 bg-blue-500/20 rounded-lg text-xs text-blue-300 max-md:px-2 max-md:py-1">
                        建立者：{{ mission.creator?.username || '未知用戶' }}
                      </span>
                      <span class="text-xs text-gray-500">
                        {{ formatDate(mission.created_at) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- 角色卡模態框 -->
      <div v-if="showProfilesModal" class="fixed inset-0 z-[9999] flex items-center justify-center">
        <div class="absolute inset-0 bg-black/70" @click="closeProfilesModal"></div>
        <div class="relative max-w-4xl w-full mx-4 bg-gray-900/90 border border-white/10 rounded-2xl shadow-md p-6 max-md:max-w-[90vw] max-md:mx-4 max-md:p-4">
          <div class="flex justify-between items-center mb-6 max-md:mb-4">
            <h3 class="text-2xl font-bold text-white max-md:text-xl">冒險者角色卡</h3>
            <button 
              @click="closeProfilesModal"
              class="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
  
          <!-- 角色卡列表 -->
          <div class="max-h-96 overflow-y-auto max-md:max-h-80">
            <div v-if="profilesLoading" class="text-center py-8">
              <div class="w-8 h-8 border-2 border-purple-300/30 border-t-purple-300 rounded-full animate-spin mx-auto"></div>
              <p class="text-gray-400 mt-4">載入角色卡中...</p>
            </div>
            <div v-else-if="profiles.length === 0" class="text-center py-8">
              <p class="text-gray-400">暫無角色卡</p>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-md:grid-cols-1 max-md:gap-3">
              <div 
                v-for="profile in profiles" 
                :key="profile.id"
                class="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors max-md:p-3"
              >
                <div class="flex items-center space-x-3 mb-3 max-md:space-x-2 max-md:mb-2">
                  <img 
                    v-if="profile.avatar_url"
                    :src="profile.avatar_url"
                    :alt="profile.username"
                    class="w-12 h-12 rounded-full border-2 border-purple-400/50 max-md:w-10 max-md:h-10"
                  >
                  <div v-else class="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center border-2 border-purple-400/50 max-md:w-10 max-md:h-10">
                    <span class="text-white text-lg font-bold max-md:text-sm">
                      {{ profile.username.charAt(0).toUpperCase() }}
                    </span>
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-white max-md:text-base">{{ profile.username }}</h4>
                    <div class="px-2 py-1 bg-purple-500/20 rounded-lg text-xs text-purple-300 max-md:px-1.5 max-md:py-0.5">
                      {{ profile.style || '未設定' }}
                    </div>
                  </div>
                </div>
                <p class="text-sm text-gray-400 max-md:text-xs">
                  {{ profile.bio || '這位冒險者還沒有留下任何介紹...' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  // 頁面 meta
  useHead({
    title: 'DungeonTeamUp - 組團打地下城，一起完成副本任務',
    meta: [
      { name: 'description', content: '連結志同道合的冒險者，組建最強團隊，征服每一個挑戰' },
      { name: 'keywords', content: 'DungeonTeamUp, 組隊, 地下城, 副本, 遊戲, 冒險' }
    ]
  })
  
  // 用戶狀態
  const user = ref(null)
  
  // 模態框狀態
  const showSearchModal = ref(false)
  const showProfilesModal = ref(false)
  
  // 搜尋功能
  const searchQuery = ref('')
  const allMissions = ref([])
  const searchLoading = ref(false)
  
  // 角色卡功能
  const profiles = ref([])
  const profilesLoading = ref(false)
  
  // 計算屬性：根據搜尋關鍵字過濾任務
  const filteredMissions = computed(() => {
    if (!searchQuery.value.trim()) {
      return allMissions.value
    }
    
    const query = searchQuery.value.toLowerCase()
    return allMissions.value.filter(mission => 
      mission.title.toLowerCase().includes(query) ||
      mission.description?.toLowerCase().includes(query) ||
      mission.projects?.title?.toLowerCase().includes(query) ||
      mission.creator?.username?.toLowerCase().includes(query)
    )
  })
  
  // 檢查用戶登入狀態
  onMounted(async () => {
    try {
      const { $supabase } = useNuxtApp()
      if ($supabase) {
        const { data: { user: currentUser } } = await $supabase.auth.getUser()
        user.value = currentUser
      }
    } catch (error) {
      console.log('檢查用戶狀態失敗:', error)
    }
  })
  
  // 開啟搜尋模態框
  const openSearchModal = async () => {
    showSearchModal.value = true
    searchQuery.value = ''
    await loadAllMissions()
  }
  
  // 關閉搜尋模態框
  const closeSearchModal = () => {
    showSearchModal.value = false
    searchQuery.value = ''
    allMissions.value = []
  }
  
  // 載入所有任務
  const loadAllMissions = async () => {
    try {
      searchLoading.value = true
      const { $supabase } = useNuxtApp()
      
      const { data, error } = await $supabase
        .from('missions')
        .select(`
          id, 
          title, 
          description, 
          project_id, 
          created_by, 
          created_at,
          projects(title),
          profiles!missions_created_by_fkey(username)
        `)
        .order('created_at', { ascending: false })
        .limit(50)
      
      if (error) throw error
      
      // 處理 Supabase join 結果
      allMissions.value = (data || []).map((mission) => ({
        ...mission,
        projects: mission.projects?.[0] || null,
        creator: mission.profiles?.[0] || null
      }))
    } catch (error) {
      console.error('載入任務失敗:', error)
      allMissions.value = []
    } finally {
      searchLoading.value = false
    }
  }
  
  // 搜尋任務 (現在只用於即時過濾)
  const searchMissions = () => {
    // 搜尋邏輯已移至 computed property filteredMissions
  }
  
  // 開啟角色卡模態框
  const openProfilesModal = async () => {
    showProfilesModal.value = true
    await loadProfiles()
  }
  
  // 關閉角色卡模態框
  const closeProfilesModal = () => {
    showProfilesModal.value = false
    profiles.value = []
  }
  
  // 載入角色卡
  const loadProfiles = async () => {
    try {
      profilesLoading.value = true
      const { $supabase } = useNuxtApp()
      
      const { data, error } = await $supabase
        .from('profiles')
        .select('id, username, avatar_url, bio, style, created_at')
        .order('created_at', { ascending: false })
        .limit(12)
      
      if (error) throw error
      
      profiles.value = data || []
    } catch (error) {
      console.error('載入角色卡失敗:', error)
      profiles.value = []
    } finally {
      profilesLoading.value = false
    }
  }
  
  // 格式化日期
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-TW')
  }
  </script>
  
  <style scoped>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.7s ease-out;
  }
  
  @keyframes pulse {
    0%, 100% { 
      opacity: 0.4; 
    }
    50% { 
      opacity: 1; 
    }
  }
  
  .animate-pulse {
    animation: pulse 2s ease-in-out infinite;
  }
  </style> 