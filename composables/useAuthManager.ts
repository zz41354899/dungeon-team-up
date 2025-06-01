/**
 * 認證管理 Composable
 * 提供統一的登入、登出功能
 * 適用於 Nuxt 3 + Supabase 環境
 */

import type { SupabaseClient } from '@supabase/supabase-js'

export const useAuthManager = () => {
  // 狀態管理
  const isSigningIn = ref(false)
  const isSigningOut = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')

  /**
   * 清除 Supabase 相關的 localStorage 資料
   * 包含舊版和新版 SDK 的所有相關項目
   */
  const clearSupabaseStorage = () => {
    if (typeof window !== 'undefined') {
      try {
        // 清除所有 localStorage
        localStorage.clear()
        
        console.log('AuthManager: 所有 localStorage 已清除')
        return true
      } catch (error) {
        console.error('AuthManager: 清除 localStorage 失敗:', error)
        return false
      }
    }
    return false
  }

  /**
   * Google 登入
   * @param redirectTo 登入成功後的重導向路徑
   */
  const signInWithGoogle = async (redirectTo: string = '/dashboard') => {
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase as SupabaseClient

    if (!supabase || isSigningIn.value) return false

    try {
      isSigningIn.value = true
      errorMessage.value = ''
      successMessage.value = ''

      console.log('AuthManager: 開始 Google 登入')

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
          queryParams: {
            prompt: 'select_account'
          }
        }
      })

      if (error) {
        throw error
      }

      successMessage.value = '正在跳轉到 Google 登入...'
      console.log('AuthManager: Google 登入請求已發送')
      return true

    } catch (error: any) {
      console.error('AuthManager: Google 登入失敗:', error)
      errorMessage.value = error?.message || 'Google 登入失敗，請稍後再試'
      return false
    } finally {
      isSigningIn.value = false
    }
  }

  /**
   * 完整登出流程
   * 包含清除 session、localStorage 和強制重新載入
   * @param redirectTo 登出後的重導向路徑
   */
  const signOut = async (redirectTo: string = '/login') => {
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase as SupabaseClient

    if (!supabase || isSigningOut.value) return false

    try {
      isSigningOut.value = true
      console.log('AuthManager: 開始完整登出流程')

      // ✅ Step 1. 登出 Supabase
      console.log('AuthManager: Step 1 - 登出 Supabase')
      await supabase.auth.signOut()

      // ✅ Step 2. 清除所有本地資料
      console.log('AuthManager: Step 2 - 清除所有本地登入資料')
      clearSupabaseStorage()

      console.log('AuthManager: 登出成功，準備重新載入頁面')
      
      // ✅ Step 3. 強制重新載入以確保清除 Google session cache
      window.location.href = redirectTo
      return true

    } catch (error) {
      console.error('AuthManager: 登出失敗:', error)
      // 即使出錯也要清除本地資料並重新載入
      clearSupabaseStorage()
      window.location.href = redirectTo
      return false
    } finally {
      isSigningOut.value = false
    }
  }

  /**
   * 清除所有錯誤和成功訊息
   */
  const clearMessages = () => {
    errorMessage.value = ''
    successMessage.value = ''
  }

  /**
   * 檢查是否有任何操作正在進行中
   */
  const isLoading = computed(() => {
    return isSigningIn.value || isSigningOut.value
  })

  return {
    // 狀態
    isSigningIn: readonly(isSigningIn),
    isSigningOut: readonly(isSigningOut),
    isLoading: readonly(isLoading),
    errorMessage: readonly(errorMessage),
    successMessage: readonly(successMessage),

    // 方法
    signInWithGoogle,
    signOut,
    clearSupabaseStorage,
    clearMessages,
  }
} 