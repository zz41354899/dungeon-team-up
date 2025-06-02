<template>
  <div class="bg-gray-900/90 border border-white/10 rounded-3xl p-6 shadow-xl max-md:p-4">
    <div class="flex items-center justify-between mb-6 max-md:flex-col max-md:space-y-3 max-md:items-start max-md:mb-4">
      <h3 class="text-xl font-bold text-white max-md:text-lg">我的專案</h3>
      <button
        @click="showCreateModal = true"
        :disabled="!profileId"
        class="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 rounded-xl transition-colors duration-200 disabled:opacity-50 max-md:w-full max-md:py-3"
      >
        新增專案
      </button>
    </div>

    <!-- 專案列表 -->
    <div v-if="loading" class="text-center py-8">
      <div class="w-8 h-8 border-2 border-blue-300/30 border-t-blue-300 rounded-full animate-spin mx-auto"></div>
      <p class="text-gray-400 mt-4 max-md:text-sm">載入專案中...</p>
    </div>
    
    <div v-else-if="!profileId" class="text-center py-8">
      <p class="text-gray-400 max-md:text-sm">請先建立角色卡</p>
    </div>
    
    <div v-else-if="projects.length === 0" class="text-center py-8">
      <div class="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 max-md:w-12 max-md:h-12">
        <svg class="w-8 h-8 text-blue-400 max-md:w-6 max-md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
        </svg>
      </div>
      <h4 class="text-lg font-semibold text-white mb-2 max-md:text-base">尚無專案</h4>
      <p class="text-gray-400 mb-4 max-md:text-sm">開始建立你的第一個專案吧！</p>
      <button
        @click="showCreateModal = true"
        class="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 rounded-xl transition-colors duration-200 max-md:px-4 max-md:py-3"
      >
        建立專案
      </button>
    </div>
    
    <div v-else class="space-y-4 max-md:space-y-3">
      <div 
        v-for="project in projects" 
        :key="project.id"
        class="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-4 hover:border-blue-500/30 transition-colors duration-200 max-md:p-3"
      >
        <div class="flex items-start justify-between max-md:flex-col max-md:space-y-3">
          <div class="flex-1 min-w-0 max-md:w-full">
            <h4 class="text-lg font-semibold text-white mb-2 max-md:text-base">{{ project.title }}</h4>
            <p class="text-gray-400 text-sm mb-3 line-clamp-2 max-md:text-xs max-md:mb-2">{{ project.description }}</p>
            <div class="text-xs text-gray-500">
              建立時間：{{ formatDate(project.created_at) }}
            </div>
          </div>
          
          <div class="flex space-x-2 ml-4 max-md:ml-0 max-md:w-full max-md:justify-end">
            <button
              @click="editProject(project)"
              class="p-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-300 rounded-lg transition-colors duration-200 max-md:flex-1 max-md:flex max-md:items-center max-md:justify-center max-md:py-3"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
              <span class="ml-2 hidden max-md:inline">編輯</span>
            </button>
            <button
              @click="deleteProject(project)"
              class="p-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 rounded-lg transition-colors duration-200 max-md:flex-1 max-md:flex max-md:items-center max-md:justify-center max-md:py-3"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
              <span class="ml-2 hidden max-md:inline">刪除</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 建立專案 Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center">
      <div class="relative max-w-lg w-full mx-4 bg-gray-900/95 border border-blue-500/30 rounded-3xl p-6 shadow-2xl max-md:max-w-[90vw] max-md:p-4">
        <div class="flex justify-between items-center mb-6 max-md:mb-4">
          <h3 class="text-xl font-bold text-white max-md:text-lg">建立新專案</h3>
          <button @click="closeCreateModal" class="p-2 hover:bg-white/10 rounded-full">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="space-y-4 mb-6 max-md:space-y-4 max-md:mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">專案名稱 *</label>
            <input 
              v-model="createForm.title"
              type="text" 
              class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 max-md:py-4"
              placeholder="輸入專案名稱"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">專案描述</label>
            <textarea 
              v-model="createForm.description"
              rows="4" 
              class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 max-md:py-4"
              placeholder="描述你的專案..."
            ></textarea>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 max-md:flex-col max-md:space-x-0 max-md:space-y-3">
          <button @click="closeCreateModal" class="px-6 py-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 text-gray-300 rounded-xl max-md:w-full max-md:py-3">
            取消
          </button>
          <button
            @click="createProject"
            :disabled="!createForm.title.trim() || creating"
            class="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 rounded-xl disabled:opacity-50 max-md:w-full max-md:py-3"
          >
            {{ creating ? '建立中...' : '建立專案' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 編輯專案 Modal -->
    <div v-if="showEditModal && editingProject" class="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center">
      <div class="relative max-w-lg w-full mx-4 bg-gray-900/95 border border-yellow-500/30 rounded-3xl p-6 shadow-2xl max-md:max-w-[90vw] max-md:p-4">
        <div class="flex justify-between items-center mb-6 max-md:mb-4">
          <h3 class="text-xl font-bold text-white max-md:text-lg">編輯專案</h3>
          <button @click="closeEditModal" class="p-2 hover:bg-white/10 rounded-full">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="space-y-4 mb-6 max-md:space-y-4 max-md:mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">專案名稱 *</label>
            <input 
              v-model="editForm.title"
              type="text" 
              class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 max-md:py-4"
              placeholder="輸入專案名稱"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">專案描述</label>
            <textarea 
              v-model="editForm.description"
              rows="4" 
              class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 max-md:py-4"
              placeholder="描述你的專案..."
            ></textarea>
          </div>
        </div>
        
        <div class="flex justify-end space-x-3 max-md:flex-col max-md:space-x-0 max-md:space-y-3">
          <button @click="closeEditModal" class="px-6 py-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 text-gray-300 rounded-xl max-md:w-full max-md:py-3">
            取消
          </button>
          <button
            @click="updateProject"
            :disabled="!editForm.title.trim() || updating"
            class="px-6 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-300 rounded-xl disabled:opacity-50 max-md:w-full max-md:py-3"
          >
            {{ updating ? '更新中...' : '更新專案' }}
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

interface Props {
  profileId: string | undefined
}

interface Emits {
  (e: 'project-created', project: Project): void
  (e: 'project-updated', project: Project): void
  (e: 'project-deleted', project: Project): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 狀態
const loading = ref(false)
const creating = ref(false)
const updating = ref(false)
const projects = ref<Project[]>([])

// Modal 狀態
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingProject = ref<Project | null>(null)

// 表單
const createForm = ref({
  title: '',
  description: ''
})

const editForm = ref({
  title: '',
  description: ''
})

// 載入專案
const loadProjects = async () => {
  if (!props.profileId) return

  try {
    loading.value = true
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
    loading.value = false
  }
}

// 監聽 profileId 變化
watch(() => props.profileId, (newProfileId) => {
  if (newProfileId) {
    loadProjects()
  }
}, { immediate: true })

// 建立專案
const createProject = async () => {
  if (!createForm.value.title.trim() || !props.profileId || creating.value) return

  try {
    creating.value = true
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase

    const { data, error } = await supabase
      .from('projects')
      .insert({
        title: createForm.value.title.trim(),
        description: createForm.value.description || '',
        created_by: props.profileId
      })
      .select()
      .single()

    if (error) throw error

    projects.value.unshift(data)
    emit('project-created', data)
    closeCreateModal()

  } catch (error: any) {
    console.error('建立專案失敗:', error)
    alert(error.message || '建立專案失敗，請稍後再試')
  } finally {
    creating.value = false
  }
}

// 編輯專案
const editProject = (project: Project) => {
  editingProject.value = project
  editForm.value = {
    title: project.title,
    description: project.description
  }
  showEditModal.value = true
}

// 更新專案
const updateProject = async () => {
  if (!editForm.value.title.trim() || !editingProject.value || updating.value) return

  try {
    updating.value = true
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase

    const { data, error } = await supabase
      .from('projects')
      .update({
        title: editForm.value.title.trim(),
        description: editForm.value.description || ''
      })
      .eq('id', editingProject.value.id)
      .select()
      .single()

    if (error) throw error

    // 更新本地資料
    const index = projects.value.findIndex(p => p.id === editingProject.value!.id)
    if (index !== -1) {
      projects.value[index] = data
    }

    emit('project-updated', data)
    closeEditModal()

  } catch (error: any) {
    console.error('更新專案失敗:', error)
    alert(error.message || '更新專案失敗，請稍後再試')
  } finally {
    updating.value = false
  }
}

// 刪除專案
const deleteProject = async (project: Project) => {
  if (!confirm(`確定要刪除專案「${project.title}」嗎？此操作無法復原。`)) return

  try {
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', project.id)

    if (error) throw error

    // 從本地資料中移除
    projects.value = projects.value.filter(p => p.id !== project.id)
    emit('project-deleted', project)

  } catch (error: any) {
    console.error('刪除專案失敗:', error)
    alert(error.message || '刪除專案失敗，請稍後再試')
  }
}

// 關閉建立 Modal
const closeCreateModal = () => {
  showCreateModal.value = false
  createForm.value = {
    title: '',
    description: ''
  }
}

// 關閉編輯 Modal
const closeEditModal = () => {
  showEditModal.value = false
  editingProject.value = null
  editForm.value = {
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
  projects: readonly(projects)
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