<template>
  <div class="bg-gray-900/90 border border-white/10 rounded-3xl p-6 shadow-xl">
    <h3 class="text-xl font-bold text-white mb-6">技能與偏好</h3>
    
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 技能區塊 -->
      <div>
        <h4 class="text-lg font-semibold text-blue-300 mb-4">技能</h4>
        <div v-if="skills.length > 0" class="flex flex-wrap gap-2 mb-4">
          <span 
            v-for="skill in skills" 
            :key="skill.id"
            class="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm"
          >
            {{ skill.name }}
            <button 
              @click="removeSkill(skill.id)"
              class="ml-2 hover:text-red-300"
            >
              ×
            </button>
          </span>
        </div>
        <div v-else class="text-gray-400 text-sm mb-4">
          尚未設定任何技能
        </div>
        
        <!-- 新增技能 -->
        <div class="flex space-x-2">
          <input 
            v-model="newSkill"
            @keyup.enter="addSkill"
            type="text" 
            placeholder="新增技能"
            class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            @click="addSkill"
            :disabled="!newSkill.trim() || addingSkill"
            class="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 text-blue-300 rounded-lg text-sm transition-colors duration-200 disabled:opacity-50"
          >
            {{ addingSkill ? '新增中...' : '新增' }}
          </button>
        </div>
      </div>
    
      <!-- 偏好區塊 -->
      <div>
        <h4 class="text-lg font-semibold text-green-300 mb-4">偏好</h4>
        <div v-if="preferences.length > 0" class="flex flex-wrap gap-2 mb-4">
          <span 
            v-for="preference in preferences" 
            :key="preference.id"
            class="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-300 rounded-lg text-sm"
          >
            {{ preference.name }}
            <button 
              @click="removePreference(preference.id)"
              class="ml-2 hover:text-red-300"
            >
              ×
            </button>
          </span>
        </div>
        <div v-else class="text-gray-400 text-sm mb-4">
          尚未設定任何偏好
        </div>
        
        <!-- 新增偏好 -->
        <div class="flex space-x-2">
          <input 
            v-model="newPreference"
            @keyup.enter="addPreference"
            type="text" 
            placeholder="新增偏好"
            class="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            @click="addPreference"
            :disabled="!newPreference.trim() || addingPreference"
            class="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 rounded-lg text-sm transition-colors duration-200 disabled:opacity-50"
          >
            {{ addingPreference ? '新增中...' : '新增' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Skill {
  id: string
  name: string
}

interface Preference {
  id: string
  name: string
}

interface Props {
  profileId: string | null
}

interface Emits {
  (e: 'skills-updated'): void
  (e: 'preferences-updated'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 狀態
const skills = ref<Skill[]>([])
const preferences = ref<Preference[]>([])
const newSkill = ref('')
const newPreference = ref('')
const addingSkill = ref(false)
const addingPreference = ref(false)

// 載入技能
const loadSkills = async () => {
  if (!props.profileId) return

  try {
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase

    const { data, error } = await supabase
      .from('profile_skills')
      .select('skill_id, skills(id, name)')
      .eq('profile_id', props.profileId)

    if (error) throw error

    skills.value = data?.map((item: any) => ({
      id: item.skills.id,
      name: item.skills.name
    })) || []

  } catch (error) {
    console.error('載入技能失敗:', error)
  }
}

// 載入偏好
const loadPreferences = async () => {
  if (!props.profileId) return

  try {
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase

    const { data, error } = await supabase
      .from('profile_preferences')
      .select('preference_id, preferences(id, name)')
      .eq('profile_id', props.profileId)

    if (error) throw error

    preferences.value = data?.map((item: any) => ({
      id: item.preferences.id,
      name: item.preferences.name
    })) || []

  } catch (error) {
    console.error('載入偏好失敗:', error)
  }
}

// 監聽 profileId 變化
watch(() => props.profileId, (newProfileId) => {
  if (newProfileId) {
    loadSkills()
    loadPreferences()
  }
}, { immediate: true })

// 新增技能
const addSkill = async () => {
  if (!newSkill.value.trim() || !props.profileId || addingSkill.value) return

  try {
    addingSkill.value = true
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase

    // 先檢查技能是否已存在
    const { data: existingSkill } = await supabase
      .from('skills')
      .select('id')
      .eq('name', newSkill.value.trim())
      .single()

    let skillId = existingSkill?.id

    // 如果技能不存在，先建立
    if (!skillId) {
      const { data: newSkillData, error: skillError } = await supabase
        .from('skills')
        .insert({ name: newSkill.value.trim() })
        .select('id')
        .single()

      if (skillError) throw skillError
      skillId = newSkillData.id
    }

    // 新增到用戶技能
    const { error } = await supabase
      .from('profile_skills')
      .insert({
        profile_id: props.profileId,
        skill_id: skillId
      })

    if (error) throw error

    newSkill.value = ''
    await loadSkills()
    emit('skills-updated')

  } catch (error: any) {
    console.error('新增技能失敗:', error)
    if (error.message?.includes('duplicate key')) {
      alert('您已經擁有這個技能了')
    } else {
      alert('新增技能失敗，請稍後再試')
    }
  } finally {
    addingSkill.value = false
  }
}

// 移除技能
const removeSkill = async (skillId: string) => {
  if (!props.profileId) return

  try {
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase

    const { error } = await supabase
      .from('profile_skills')
      .delete()
      .eq('profile_id', props.profileId)
      .eq('skill_id', skillId)

    if (error) throw error

    await loadSkills()
  emit('skills-updated')

  } catch (error) {
    console.error('移除技能失敗:', error)
    alert('移除技能失敗，請稍後再試')
  }
}

// 新增偏好
const addPreference = async () => {
  if (!newPreference.value.trim() || !props.profileId || addingPreference.value) return

  try {
    addingPreference.value = true
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase

    // 先檢查偏好是否已存在
    const { data: existingPreference } = await supabase
      .from('preferences')
      .select('id')
      .eq('name', newPreference.value.trim())
      .single()

    let preferenceId = existingPreference?.id

    // 如果偏好不存在，先建立
    if (!preferenceId) {
      const { data: newPreferenceData, error: preferenceError } = await supabase
        .from('preferences')
        .insert({ name: newPreference.value.trim() })
        .select('id')
        .single()

      if (preferenceError) throw preferenceError
      preferenceId = newPreferenceData.id
    }

    // 新增到用戶偏好
    const { error } = await supabase
      .from('profile_preferences')
      .insert({
        profile_id: props.profileId,
        preference_id: preferenceId
      })

    if (error) throw error

    newPreference.value = ''
    await loadPreferences()
    emit('preferences-updated')

  } catch (error: any) {
    console.error('新增偏好失敗:', error)
    if (error.message?.includes('duplicate key')) {
      alert('您已經擁有這個偏好了')
    } else {
      alert('新增偏好失敗，請稍後再試')
    }
  } finally {
    addingPreference.value = false
  }
}

// 移除偏好
const removePreference = async (preferenceId: string) => {
  if (!props.profileId) return

  try {
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase

    const { error } = await supabase
      .from('profile_preferences')
      .delete()
      .eq('profile_id', props.profileId)
      .eq('preference_id', preferenceId)

    if (error) throw error

    await loadPreferences()
  emit('preferences-updated')

  } catch (error) {
    console.error('移除偏好失敗:', error)
    alert('移除偏好失敗，請稍後再試')
  }
}
</script> 