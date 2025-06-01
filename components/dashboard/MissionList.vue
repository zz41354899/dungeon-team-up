<template>
  <div class="bg-gray-900/90 border border-white/10 rounded-3xl p-6 shadow-xl">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-bold text-white">我的任務</h3>
      <button
        v-if="hasProjects"
        @click="showCreateModal = true"
        :disabled="!profileId"
        class="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 rounded-xl transition-colors duration-200 disabled:opacity-50"
      >
        新增任務
      </button>
    </div>

    <!-- 無專案提示 -->
    <div v-if="!hasProjects && !loadingProjects" class="text-center py-8">
      <div class="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
      </div>
      <h4 class="text-lg font-semibold text-white mb-2">需要先建立專案</h4>
      <p class="text-gray-400 mb-4">請先建立一個專案後才能新增任務</p>
    </div>

    <!-- 任務列表 -->
    <div v-else-if="loading" class="text-center py-8">
      <div class="w-8 h-8 border-2 border-green-300/30 border-t-green-300 rounded-full animate-spin mx-auto"></div>
      <p class="text-gray-400 mt-4">載入任務中...</p>
    </div>
    
    <div v-else-if="!profileId" class="text-center py-8">
      <p class="text-gray-400">請先建立角色卡</p>
    </div>
    
    <div v-else-if="missions.length === 0" class="text-center py-8">
      <div class="w-16 h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
        </svg>
      </div>
      <h4 class="text-lg font-semibold text-white mb-2">尚無任務</h4>
      <p class="text-gray-400 mb-4">開始建立你的第一個任務吧！</p>
      <button
        @click="showCreateModal = true"
        class="px-6 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 rounded-xl transition-colors duration-200"
      >
        建立任務
      </button>
    </div>
    
    <div v-else class="space-y-4">
      <div 
        v-for="mission in missions" 
        :key="mission.id"
        class="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4 hover:border-green-500/30 transition-colors duration-200"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-2 mb-2">
              <h4 class="text-lg font-semibold text-white">{{ mission.title }}</h4>
              <span v-if="mission.projects" class="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs">
                {{ mission.projects.title }}
              </span>
            </div>
            <p class="text-gray-400 text-sm mb-3 line-clamp-2">{{ mission.description }}</p>
            <div class="text-xs text-gray-500">
              建立時間：{{ formatDate(mission.created_at) }}
            </div>
          </div>
          
          <div class="flex space-x-2 ml-4">
            <button
              @click="deleteMission(mission)"
              class="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-lg transition-colors duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 建立任務 Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center">
      <div class="relative max-w-lg w-full mx-4 bg-gray-900/95 border border-green-500/30 rounded-3xl p-6 shadow-2xl">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-white">建立新任務</h3>
          <button @click="closeCreateModal" class="p-2 hover:bg-white/10 rounded-full">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">所屬專案 *</label>
            <select 
              v-model="createForm.project_id"
              class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">選擇專案</option>
              <option v-for="project in projects" :key="project.id" :value="project.id">
                {{ project.title }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">任務名稱 *</label>
            <input 
              v-model="createForm.title"
              type="text" 
              class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="輸入任務名稱"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">任務描述</label>
            <textarea 
              v-model="createForm.description"
              rows="4" 
              class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="描述你的任務..."
            ></textarea>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3">
          <button @click="closeCreateModal" class="px-6 py-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 text-gray-300 rounded-xl">
            取消
          </button>
          <button
            @click="createMission"
            :disabled="!createForm.title.trim() || !createForm.project_id || creating"
            class="px-6 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 rounded-xl disabled:opacity-50"
          >
            {{ creating ? '建立中...' : '建立任務' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Project {
  id: string
  title: string
  description: string
  created_by: string
  created_at: string
}

interface Mission {
  id: string
  project_id: string
  title: string
  description: string
  created_by: string
  created_at: string
  projects?: {
    title: string
  } | null
}

interface Props {
  profileId: string | undefined
}

interface Emits {
  (e: 'mission-created', mission: Mission): void
  (e: 'mission-deleted', mission: Mission): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 狀態
const loading = ref(false)
const loadingProjects = ref(false)
const creating = ref(false)
const missions = ref<Mission[]>([])
const projects = ref<Project[]>([])

// Modal 狀態
const showCreateModal = ref(false)

// 表單
const createForm = ref({
  project_id: '',
  title: '',
  description: ''
})

// 計算屬性
const hasProjects = computed(() => projects.value.length > 0)

// 載入專案
const loadProjects = async () => {
  if (!props.profileId) return

  try {
    loadingProjects.value = true
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase

    const { data, error } = await supabase
      .from('projects')
      .select('id, title, description, created_by, created_at')
      .eq('created_by', props.profileId)
      .order('created_at', { ascending: false })

    if (error) throw error

    projects.value = data || []

  } catch (error) {
    console.error('載入專案失敗:', error)
    projects.value = []
  } finally {
    loadingProjects.value = false
  }
}

// 載入任務
const loadMissions = async () => {
  if (!props.profileId) return

  try {
    loading.value = true
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase

    const { data, error } = await supabase
      .from('missions')
      .select(`
        id,
        project_id,
        title,
        description,
        created_by,
        created_at,
        projects(title)
      `)
      .eq('created_by', props.profileId)
      .order('created_at', { ascending: false })

    if (error) throw error

    // 處理資料，確保 projects 是單一物件而非陣列
    const processedMissions = (data || []).map((mission: any) => ({
      ...mission,
      projects: mission.projects?.[0] || null
    }))

    missions.value = processedMissions

  } catch (error) {
    console.error('載入任務失敗:', error)
    missions.value = []
  } finally {
    loading.value = false
  }
}

// 監聽 profileId 變化
watch(() => props.profileId, (newProfileId) => {
  if (newProfileId) {
    loadProjects()
    loadMissions()
  }
}, { immediate: true })

// 建立任務
const createMission = async () => {
  if (!createForm.value.title.trim() || !createForm.value.project_id || !props.profileId || creating.value) return

  try {
    creating.value = true
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase

    const { data, error } = await supabase
      .from('missions')
      .insert({
        project_id: createForm.value.project_id,
        title: createForm.value.title.trim(),
        description: createForm.value.description || '',
        created_by: props.profileId
      })
      .select(`
        id,
        project_id,
        title,
        description,
        created_by,
        created_at,
        projects(title)
      `)
      .single()

    if (error) throw error

    // 處理回傳的資料
    const processedMission = {
      ...data,
      projects: data.projects?.[0] || null
    }

    missions.value.unshift(processedMission)
    emit('mission-created', processedMission)
    closeCreateModal()

  } catch (error: any) {
    console.error('建立任務失敗:', error)
    alert(error.message || '建立任務失敗，請稍後再試')
  } finally {
    creating.value = false
  }
}

// 刪除任務
const deleteMission = async (mission: Mission) => {
  if (!confirm(`確定要刪除任務「${mission.title}」嗎？此操作無法復原。`)) return

  try {
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase

    const { error } = await supabase
      .from('missions')
      .delete()
      .eq('id', mission.id)

    if (error) throw error

    // 從本地資料中移除
    missions.value = missions.value.filter(m => m.id !== mission.id)
    emit('mission-deleted', mission)

  } catch (error: any) {
    console.error('刪除任務失敗:', error)
    alert(error.message || '刪除任務失敗，請稍後再試')
  }
}

// 關閉建立 Modal
const closeCreateModal = () => {
  showCreateModal.value = false
  createForm.value = {
    project_id: '',
    title: '',
    description: ''
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-TW')
}

// 公開方法給父組件使用
defineExpose({
  loadProjects,
  loadMissions,
  projects: readonly(projects),
  missions: readonly(missions)
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 
