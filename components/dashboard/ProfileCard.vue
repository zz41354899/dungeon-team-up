<template>
  <div class="bg-gray-900/90 border border-white/10 rounded-3xl p-6 shadow-xl">
    <div class="flex items-start space-x-6">
      <!-- 頭像 -->
      <div class="flex-shrink-0">
        <div class="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
          <img 
            v-if="profile?.avatar_url" 
            :src="profile.avatar_url" 
            :alt="profile.username"
            class="w-full h-full rounded-2xl object-cover"
          />
          <svg v-else class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
          </svg>
        </div>
      </div>

      <!-- 個人資料內容 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-2xl font-bold text-white">{{ profile?.username }}</h3>
            <p class="text-gray-400">{{ userEmail }}</p>
          </div>
          <button
            @click="isEditing = !isEditing"
            class="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 rounded-xl transition-colors duration-200"
          >
            {{ isEditing ? '取消編輯' : '編輯資料' }}
          </button>
        </div>

        <!-- 編輯模式 -->
        <div v-if="isEditing" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">用戶名稱</label>
            <input 
              v-model="editForm.username"
              type="text" 
              class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">頭像網址</label>
            <input 
              v-model="editForm.avatar_url"
              type="url" 
              class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">角色風格</label>
            <select 
              v-model="editForm.style"
              class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">選擇風格</option>
              <option value="Builder">建造者</option>
              <option value="Designer">設計師</option>
              <option value="Organizer">組織者</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">個人介紹</label>
            <textarea 
              v-model="editForm.bio"
              rows="3" 
              class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div class="flex space-x-3">
            <button
              @click="saveProfile"
              :disabled="isSaving"
              class="px-6 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 rounded-xl transition-colors duration-200 disabled:opacity-50"
            >
              {{ isSaving ? '儲存中...' : '儲存' }}
            </button>
            <button
              @click="cancelEdit"
              class="px-6 py-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 text-gray-300 rounded-xl transition-colors duration-200"
            >
              取消
            </button>
          </div>
        </div>

        <!-- 顯示模式 -->
        <div v-else class="space-y-3">
          <div v-if="profile?.style">
            <span class="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm">
              {{ profile.style }}
            </span>
          </div>
          
          <div v-if="profile?.bio" class="text-gray-300">
            <p>{{ profile.bio }}</p>
          </div>
          
          <div class="text-sm text-gray-400">
            建立時間：{{ formatDate(profile?.created_at) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Profile {
  id: string
  username: string
  avatar_url?: string
  bio?: string
  style?: string
  created_at: string
}

interface Props {
  profile: Profile | null
  userEmail: string
  userId: string
}

interface Emits {
  (e: 'profile-updated', profile: Profile): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 狀態
const isEditing = ref(false)
const isSaving = ref(false)

// 編輯表單
const editForm = ref({
  username: '',
  avatar_url: '',
  bio: '',
  style: ''
})

// 監聽 profile 變化並更新表單
watch(() => props.profile, (newProfile) => {
  if (newProfile) {
    editForm.value = {
      username: newProfile.username || '',
      avatar_url: newProfile.avatar_url || '',
      bio: newProfile.bio || '',
      style: newProfile.style || ''
    }
  }
}, { immediate: true })

// 取消編輯
const cancelEdit = () => {
  if (props.profile) {
    editForm.value = {
      username: props.profile.username || '',
      avatar_url: props.profile.avatar_url || '',
      bio: props.profile.bio || '',
      style: props.profile.style || ''
    }
  }
  isEditing.value = false
}

// 儲存個人資料
const saveProfile = async () => {
  if (!props.profile || isSaving.value) return

  try {
    isSaving.value = true
    
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase

    const { data, error } = await supabase
      .from('profiles')
      .update({
        username: editForm.value.username.trim(),
        avatar_url: editForm.value.avatar_url || null,
        bio: editForm.value.bio || '',
        style: editForm.value.style || null
      })
      .eq('id', props.profile.id)
      .select()
      .single()

    if (error) throw error

    emit('profile-updated', data)
    isEditing.value = false
    
  } catch (error: any) {
    console.error('更新個人資料失敗:', error)
    alert(error.message || '更新失敗，請稍後再試')
  } finally {
    isSaving.value = false
  }
}

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return '未知'
  return new Date(dateString).toLocaleDateString('zh-TW')
}
</script> 