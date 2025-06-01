<template>
  <div class="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">
    <!-- 科技背景效果 -->
    <div class="absolute inset-0">
      <div class="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse"></div>
      
      <!-- 網格背景 -->
      <div class="absolute inset-0 bg-gradient-to-br from-gray-900/30 to-black/90"></div>
      <div class="absolute inset-0" style="background-image: radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0); background-size: 40px 40px;"></div>
    </div>

    <!-- 載入狀態 -->
    <div class="relative z-10 text-center">
      <div class="bg-gray-900/90 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-blue-500/10">
        <!-- 載入 Spinner -->
        <div class="relative inline-flex items-center justify-center">
          <!-- 外圍發光效果 -->
          <div class="absolute w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-md opacity-40 animate-pulse"></div>
          <!-- 主要 Spinner -->
          <div class="relative w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
        
        <h3 class="text-xl font-semibold text-white mt-6 mb-2">{{ message || '載入中' }}</h3>
        <p class="text-gray-400">請稍候...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  message?: string
}

defineProps<Props>()
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