<template>
  <ClientOnly>
    <div class="min-h-screen bg-black text-white relative overflow-hidden">
      <!-- 科技背景效果 -->
      <div class="absolute inset-0">
        <div class="absolute top-1/4 left-1/6 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-1/4 right-1/6 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        
        <!-- 網格背景 -->
        <div class="absolute inset-0 bg-gradient-to-br from-gray-900/30 to-black/80"></div>
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0); background-size: 40px 40px;"></div>
      </div>

      <!-- 載入狀態 -->
      <LoadingSpinner v-if="isLoading" :message="loadingMessage" />

      <!-- 角色卡建立 Modal - 當沒有 profile 時顯示 -->
      <div v-else-if="user && !profile && !isLoading" class="fixed inset-0 z-[99999] flex items-center justify-center">
        <!-- 背景遮罩 -->
        <div class="absolute inset-0 bg-black/80"></div>
        
        <!-- Modal 內容 -->
        <div class="relative max-w-lg w-full mx-4 bg-gray-900/95 border border-blue-500/30 rounded-3xl p-8 shadow-2xl shadow-blue-500/20 max-md:max-w-[90vw] max-md:mx-4 max-md:p-6">
          <div class="text-center mb-8 max-md:mb-6">
            <div class="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 max-md:w-16 max-md:h-16 max-md:mb-4">
              <svg class="w-10 h-10 text-blue-400 max-md:w-8 max-md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <h2 class="text-3xl font-bold text-white mb-2 max-md:text-2xl">建立你的角色卡</h2>
            <p class="text-gray-400 max-md:text-sm">開始你的冒險之旅！</p>
          </div>
          
          <div class="space-y-6 mb-8 max-md:space-y-4 max-md:mb-6">
            <div>
              <label for="modal-username" class="block text-sm font-medium text-gray-300 mb-2">用戶名稱 *</label>
              <input 
                id="modal-username"
                v-model="profileForm.username"
                type="text" 
                class="form-input max-md:py-4"
                placeholder="輸入你的用戶名稱"
                :class="{ 'border-red-500': profileFormErrors.username }"
              />
              <p v-if="profileFormErrors.username" class="text-red-400 text-sm mt-1">{{ profileFormErrors.username }}</p>
            </div>
            
            <div>
              <label for="modal-avatar" class="block text-sm font-medium text-gray-300 mb-2">頭像網址</label>
              <input 
                id="modal-avatar"
                v-model="profileForm.avatar_url"
                type="url" 
                class="form-input max-md:py-4"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
            
            <div>
              <label for="modal-style" class="block text-sm font-medium text-gray-300 mb-2">角色風格</label>
              <select 
                id="modal-style"
                v-model="profileForm.style"
                class="form-select max-md:py-4"
              >
                <option value="">選擇你的風格</option>
                <option value="Builder">建造者 - 喜歡構建和創造</option>
                <option value="Designer">設計師 - 專注於美學和體驗</option>
                <option value="Organizer">組織者 - 擅長規劃和協調</option>
              </select>
            </div>
            
            <div>
              <label for="modal-bio" class="block text-sm font-medium text-gray-300 mb-2">個人介紹</label>
              <textarea 
                id="modal-bio"
                v-model="profileForm.bio"
                rows="4" 
                class="form-textarea max-md:py-4"
                placeholder="介紹一下你自己..."
              ></textarea>
            </div>
          </div>
          
          <div class="flex justify-end space-x-4 max-md:space-x-2">
            <button
              @click="createProfile"
              :disabled="isCreatingProfile || !profileForm.username.trim()"
              class="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-xl max-md:py-4"
            >
              <div v-if="isCreatingProfile" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span>{{ isCreatingProfile ? '建立中...' : '開始冒險' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 主要內容 - 用戶已登入且有角色卡 -->
      <div v-else-if="user" class="relative z-10">
        <!-- 導覽列 -->
        <nav class="p-6 border-b border-white/10 bg-black/50 max-md:p-4">
          <div class="max-w-6xl mx-auto flex justify-between items-center max-md:flex-col max-md:space-y-4 max-md:items-start">
            <div class="flex items-center space-x-4">
              <NuxtLink 
                to="/"
                class="flex items-center space-x-4 hover:opacity-80 transition-opacity max-md:space-x-3"
              >
                <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 max-md:w-8 max-md:h-8">
                  <svg class="w-6 h-6 text-white max-md:w-5 max-md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                  </svg>
                </div>
                <div>
                  <h1 class="text-xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent max-md:text-lg">
                    DungeonTeamUp
                  </h1>
                  <p class="text-sm text-gray-400 max-md:text-xs">控制面板</p>
                </div>
              </NuxtLink>
            </div>
            
            <div class="flex items-center space-x-4 max-md:w-full max-md:justify-between max-md:space-x-2">
              <NuxtLink 
                to="/"
                class="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl text-white transition-colors duration-200 max-md:px-3 max-md:py-2 max-md:text-sm"
              >
                返回首頁
              </NuxtLink>
              <button
                @click="handleLogout"
                :disabled="isSigningOut"
                class="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed max-md:px-3 max-md:py-2 max-md:text-sm"
              >
                <span v-if="isSigningOut" class="flex items-center space-x-2">
                  <div class="w-4 h-4 border-2 border-red-300/30 border-t-red-300 rounded-full animate-spin"></div>
                  <span>登出中...</span>
                </span>
                <span v-else>登出</span>
              </button>
            </div>
          </div>
        </nav>

        <!-- 主要內容 -->
        <main class="max-w-6xl mx-auto p-6 lg:p-8 space-y-8 max-md:p-4 max-md:space-y-6">
          <!-- 歡迎區域 -->
          <div class="text-center max-md:text-left">
            <h2 class="text-4xl lg:text-5xl font-bold mb-4 max-md:text-2xl max-md:mb-2">
              <span class="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                歡迎回來，{{ profile?.username || user.email?.split('@')[0] || '冒險者' }}！
              </span>
            </h2>
            <p class="text-xl text-gray-400 max-md:text-base">準備好開始新的冒險了嗎？</p>
          </div>

          <!-- 個人資料卡 -->
          <ProfileCard 
            v-if="profile"
            :profile="profile"
            :user-email="user.email || ''"
            :user-id="user.id"
            @profile-updated="handleProfileUpdated"
          />

          <!-- 技能與偏好面板 -->
          <SkillPreferencePanel 
            v-if="profile"
            :profile-id="profile.id"
            @skills-updated="handleSkillsUpdated"
            @preferences-updated="handlePreferencesUpdated"
          />

          <!-- 可用性顯示 -->
          <AvailabilityDisplay 
            v-if="profile"
            :profile-id="profile.id"
            @availability-updated="handleAvailabilityUpdated"
          />
          
          <!-- 專案列表 -->
          <ProjectList 
            v-if="profile"
            :profile-id="profile.id"
            @project-created="handleProjectCreated"
            @project-updated="handleProjectUpdated"
            @project-deleted="handleProjectDeleted"
          />
          
          <!-- 任務列表 -->
          <MissionList 
            v-if="profile"
            ref="missionListRef"
            :profile-id="profile.id"
            @mission-created="handleMissionCreated"
            @mission-deleted="handleMissionDeleted"
          />
        </main>
      </div>

      <!-- 未登入狀態 -->
      <div v-else class="relative z-10 min-h-screen flex items-center justify-center">
        <div class="text-center max-w-md mx-auto px-4">
          <div class="bg-gray-900/90 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-red-500/10">
            <div class="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white mb-4">需要登入</h2>
            <p class="text-gray-400 mb-6">您需要先登入才能存取控制面板</p>
            <NuxtLink 
              to="/login"
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl transition-colors duration-200 hover:shadow-lg hover:shadow-blue-500/25"
            >
              前往登入
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- ClientOnly fallback -->
    <template #fallback>
      <LoadingSpinner message="初始化..." />
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
// 明確引入所有 Dashboard 組件
import ProfileCard from '@/components/dashboard/ProfileCard.vue'
import SkillPreferencePanel from '@/components/dashboard/SkillPreferencePanel.vue'
import AvailabilityDisplay from '@/components/dashboard/AvailabilityDisplay.vue'
import ProjectList from '@/components/dashboard/ProjectList.vue'
import MissionList from '@/components/dashboard/MissionList.vue'

// 介面定義
interface User {
  id: string
  email?: string
}

interface Profile {
  id: string
  username: string
  avatar_url?: string
  bio?: string
  style?: string
  created_at: string
}

interface Project {
  id: string
  title: string
  description: string
  created_at: string
  created_by: string
}

interface Mission {
  id: string
  title: string
  description: string
  project_id: string
  created_at: string
  created_by: string
  projects?: {
    title: string
  } | null
}

// 頁面設定
useHead({
  title: 'DungeonTeamUp - 控制面板',
  meta: [
    { name: 'description', content: 'DungeonTeamUp 控制面板 - 管理你的冒險團隊' }
  ]
})

// 使用認證管理 composable
const { isSigningOut, signOut } = useAuthManager()

// 基本狀態
const user = ref<User | null>(null)
const profile = ref<Profile | null>(null)
const isLoading = ref(true)
const loadingMessage = ref('正在載入資料...')

// 角色卡建立表單
const profileForm = ref({
  username: '',
  avatar_url: '',
  bio: '',
  style: ''
})

const profileFormErrors = ref({
  username: ''
})

const isCreatingProfile = ref(false)

// 組件引用
const missionListRef = ref()

// Supabase 實例
let supabase: any

// 載入 Profile 函數定義
const loadProfile = async (userId: string) => {
  if (!supabase) return
  
  try {
    console.log('Dashboard: 載入 Profile')
    
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, bio, style, created_at')
      .eq('id', userId)
      .maybeSingle()
    
    if (fetchError) {
      throw fetchError
    }
    
    if (existingProfile) {
      console.log('Dashboard: Profile 載入成功')
      profile.value = existingProfile
    } else {
      console.log('Dashboard: 未找到 Profile，需要手動建立')
      profile.value = null
    }
    
  } catch (error) {
    console.error('Dashboard: Profile 載入失敗:', error)
    profile.value = null
  }
}

// 初始化
onMounted(async () => {
  try {
    console.log('Dashboard: 開始初始化')
    
    // 獲取 Supabase 實例
    const nuxtApp = useNuxtApp()
    supabase = nuxtApp.$supabase
    
    if (!supabase) {
      throw new Error('Supabase 未初始化')
    }
    
    console.log('Dashboard: Supabase 初始化完成')
    
    // 獲取用戶資料
    loadingMessage.value = '正在驗證身分...'
    const { data: { user: currentUser }, error } = await supabase.auth.getUser()
    
    if (error) {
      console.error('Dashboard: 取得用戶失敗:', error)
      throw error
    }
    
    if (!currentUser) {
      console.log('Dashboard: 無有效用戶，導向登入頁')
      await navigateTo('/login')
      return
    }
    
    console.log('Dashboard: 用戶資料載入成功')
    user.value = currentUser
    
    // 載入 Profile
    loadingMessage.value = '正在載入角色卡...'
    await loadProfile(currentUser.id)
    
  } catch (error) {
    console.error('Dashboard: 初始化失敗:', error)
    await navigateTo('/login')
  } finally {
    isLoading.value = false
  }
})

// 處理 Profile 更新
const handleProfileUpdated = async (updatedProfile: Profile) => {
  profile.value = updatedProfile
}

// 處理技能更新
const handleSkillsUpdated = () => {
  console.log('技能已更新')
}

// 處理偏好更新
const handlePreferencesUpdated = () => {
  console.log('偏好已更新')
}

// 處理可用性更新
const handleAvailabilityUpdated = () => {
  console.log('可用性已更新')
}

// 處理專案建立
const handleProjectCreated = async (newProject: Project) => {
  console.log('專案已建立:', newProject.title)
  // 通知 MissionList 重新載入專案資料
  if (missionListRef.value && missionListRef.value.loadProjects) {
    await missionListRef.value.loadProjects()
  }
}

// 處理任務建立
const handleMissionCreated = (newMission: Mission) => {
  console.log('任務已建立:', newMission.title)
}

// 處理專案更新
const handleProjectUpdated = async (updatedProject: Project) => {
  console.log('專案已更新:', updatedProject.title)
  // 通知 MissionList 重新載入專案資料
  if (missionListRef.value && missionListRef.value.loadProjects) {
    await missionListRef.value.loadProjects()
  }
}

// 處理專案刪除
const handleProjectDeleted = async (deletedProject: Project) => {
  console.log('專案已刪除:', deletedProject.title)
  // 通知 MissionList 重新載入專案資料
  if (missionListRef.value && missionListRef.value.loadProjects) {
    await missionListRef.value.loadProjects()
  }
}

// 處理任務刪除
const handleMissionDeleted = (deletedMission: Mission) => {
  console.log('任務已刪除:', deletedMission.title)
}

// 建立角色卡
const createProfile = async () => {
  if (isCreatingProfile.value || !user.value) return
  
  // 重置錯誤
  profileFormErrors.value.username = ''
  
  // 驗證表單
  if (!profileForm.value.username.trim()) {
    profileFormErrors.value.username = '用戶名稱為必填欄位'
    return
  }
  
  try {
    isCreatingProfile.value = true
    
    // 處理 style 欄位的大小寫 - 確保首字母大寫
    let formattedStyle = null
    if (profileForm.value.style) {
      // 從下拉選項中取得完整值（例如 "Builder"）
      const styleValue = profileForm.value.style.split(' - ')[0] // 取得選項的第一部分
      formattedStyle = styleValue.charAt(0).toUpperCase() + styleValue.slice(1).toLowerCase()
    }
    
    const profileData = {
      id: user.value.id,
      username: profileForm.value.username.trim(),
      avatar_url: profileForm.value.avatar_url || null,
      bio: profileForm.value.bio || '',
      style: formattedStyle
    }
    
    console.log('即將建立角色卡:', profileData)
    
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select('id, username, avatar_url, bio, style, created_at')
      .single()
    
    if (error) throw error
    
    console.log('角色卡建立成功:', data)
    profile.value = data
    
    // 重置表單
    profileForm.value = {
      username: '',
      avatar_url: '',
      bio: '',
      style: ''
    }
    
  } catch (error: any) {
    console.error('建立角色卡失敗:', error)
    
    if (error.message?.includes('duplicate key')) {
      profileFormErrors.value.username = '此用戶名稱已被使用'
    } else if (error.message?.includes('invalid input value for enum')) {
      alert('角色風格選擇有誤，請重新選擇')
    } else {
      alert(error.message || '建立角色卡失敗，請稍後再試')
    }
  } finally {
    isCreatingProfile.value = false
  }
}

// 登出功能
const handleLogout = async () => {
  await signOut('/login')
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

/* 表單樣式 */
.form-input {
  @apply w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200;
}

.form-select {
  @apply w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200;
}

.form-textarea {
  @apply w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none;
}

.btn-primary {
  @apply px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-xl transition-colors duration-200 hover:shadow-lg hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50;
}

/* 文字截斷 */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 