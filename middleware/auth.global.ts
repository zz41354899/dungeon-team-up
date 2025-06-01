export default defineNuxtRouteMiddleware(async (to) => {
  if (process.client && to.path === '/dashboard') {
    const supabase = useNuxtApp().$supabase
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return navigateTo('/login')
    }
  }
}) 