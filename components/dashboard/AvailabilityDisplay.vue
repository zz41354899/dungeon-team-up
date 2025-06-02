<template>
  <div class="bg-gray-900/90 border border-white/10 rounded-3xl p-6 shadow-xl max-md:p-4">
    <div class="flex items-center justify-between mb-6 max-md:flex-col max-md:space-y-3 max-md:items-start max-md:mb-4">
      <h3 class="text-xl font-bold text-white max-md:text-lg">每週可用時間</h3>
      <button 
        @click="isEditing = !isEditing"
        class="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 rounded-xl transition-colors duration-200 max-md:w-full max-md:py-3"
      >
        {{ isEditing ? '取消編輯' : '編輯時間' }}
      </button>
    </div>
    
    <!-- 顯示模式 -->
    <div v-if="!isEditing" class="text-center">
      <div class="inline-flex items-center justify-center w-24 h-24 bg-purple-500/20 rounded-2xl mb-4 max-md:w-20 max-md:h-20">
        <svg class="w-12 h-12 text-purple-400 max-md:w-10 max-md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        </div>
      
      <div class="text-3xl font-bold text-white mb-2 max-md:text-2xl">
        {{ weeklyHours || 0 }} 小時
        </div>
      
      <div class="text-gray-400 max-md:text-sm">
        每週可投入時間
            </div>
            
      <div v-if="weeklyHours" class="mt-4 text-sm text-purple-300 max-md:text-xs">
        平均每日約 {{ Math.round((weeklyHours / 7) * 10) / 10 }} 小時
        </div>
    </div>

    <!-- 編輯模式 -->
    <div v-else class="space-y-4 max-md:space-y-4">
          <div>
        <label class="block text-sm font-medium text-gray-300 mb-2">每週可用時間（小時）</label>
        <div class="flex items-center space-x-4 max-md:flex-col max-md:space-x-0 max-md:space-y-2">
              <input 
            v-model.number="editingHours"
            type="number" 
                min="0"
            max="168"
            step="0.5"
            class="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 max-md:w-full max-md:py-4"
            placeholder="輸入每週可用時間"
          />
          <span class="text-gray-400 text-sm max-md:text-xs">/ 168 小時</span>
                </div>
        <div class="mt-2 text-xs text-gray-500">
          提示：一週共有 168 小時，建議設定實際可投入的時間
              </div>
            </div>
            
      <div class="flex space-x-3 max-md:flex-col max-md:space-x-0 max-md:space-y-3">
                <button 
          @click="saveAvailability"
          :disabled="isSaving || editingHours < 0 || editingHours > 168"
          class="px-6 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 rounded-xl transition-colors duration-200 disabled:opacity-50 max-md:w-full max-md:py-3"
                >
          {{ isSaving ? '儲存中...' : '儲存' }}
                </button>
          <button
          @click="cancelEdit"
          class="px-6 py-2 bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 text-gray-300 rounded-xl transition-colors duration-200 max-md:w-full max-md:py-3"
          >
            取消
          </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  profileId: string | null
}

interface Emits {
  (e: 'availability-updated'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 狀態
const weeklyHours = ref<number>(0)
const isEditing = ref(false)
const isSaving = ref(false)
const editingHours = ref<number>(0)

// 載入可用性資料
const loadAvailability = async () => {
  if (!props.profileId) return
  
  try {
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase
    
    const { data, error } = await supabase
      .from('availability')
      .select('weekly_hours')
      .eq('profile_id', props.profileId)
      .maybeSingle()
    
    if (error) throw error

    weeklyHours.value = data?.weekly_hours || 0

  } catch (error) {
    console.error('載入可用性資料失敗:', error)
  }
}

// 監聽 profileId 變化
watch(() => props.profileId, (newProfileId) => {
  if (newProfileId) {
    loadAvailability()
  }
}, { immediate: true })

// 取消編輯
const cancelEdit = () => {
  editingHours.value = weeklyHours.value
  isEditing.value = false
}

// 開始編輯時初始化編輯值
watch(isEditing, (editing) => {
  if (editing) {
    editingHours.value = weeklyHours.value
  }
})

// 儲存可用性
const saveAvailability = async () => {
  if (!props.profileId || isSaving.value) return
  if (editingHours.value < 0 || editingHours.value > 168) return
  
  try {
    isSaving.value = true
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase

    // 檢查是否已有記錄
    const { data: existing } = await supabase
      .from('availability')
      .select('id')
      .eq('profile_id', props.profileId)
      .maybeSingle()

    if (existing) {
      // 更新現有記錄
      const { error } = await supabase
        .from('availability')
        .update({ weekly_hours: editingHours.value })
        .eq('profile_id', props.profileId)
      
      if (error) throw error
    } else {
      // 建立新記錄
      const { error } = await supabase
        .from('availability')
        .insert({
          profile_id: props.profileId,
          weekly_hours: editingHours.value
        })
      
      if (error) throw error
    }

    weeklyHours.value = editingHours.value
    isEditing.value = false
    emit('availability-updated')

  } catch (error: any) {
    console.error('儲存可用性資料失敗:', error)
    alert(error.message || '儲存失敗，請稍後再試')
  } finally {
    isSaving.value = false
  }
}
</script>