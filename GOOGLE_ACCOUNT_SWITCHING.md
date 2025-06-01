# Google 帳號登入與登出功能說明

## 🎯 功能目的
提供簡潔的 Google 帳號登入與登出功能。登出後重新登入會自動顯示 Google 帳號選擇畫面，讓使用者可以選擇不同的帳號進行登入。  
適用情境：Nuxt 3 + Supabase 使用者登入流程。

## 🚀 使用方法

### 登入流程
1. 進入登入頁面 (`/login`)
2. 點擊 **「使用 Google 登入」** 按鈕
3. 如果首次登入或已登出，會彈出 Google 帳號選擇/登入畫面
4. 選擇 Google 帳號進行登入
5. 登入成功後會經過 `/auth/callback` 處理並導向控制面板

### 登出流程
1. 在控制面板 (`/dashboard`) 點擊 **「登出」** 按鈕
2. 系統會執行完整的登出流程：
   - 登出 Supabase session
   - 清除所有 localStorage 資料
   - 強制重新載入頁面以清除 Google session cache
3. 自動導向登入頁面

### 切換帳號（簡化版）
1. 點擊「登出」按鈕完全登出
2. 重新點擊「使用 Google 登入」
3. Google 會自動顯示帳號選擇畫面（Google OAuth 預設行為）
4. 選擇不同的帳號進行登入

## 🔧 技術實現

### 簡化的登入流程
```javascript
// ✅ 標準 Google OAuth 登入
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent('/dashboard')}`
  }
})
```

### 完整的登出流程
```javascript
// ✅ Step 1. 登出 Supabase
await supabase.auth.signOut()

// ✅ Step 2. 清除所有本地資料
localStorage.clear()

// ✅ Step 3. 強制重新載入以確保清除 Google session cache
window.location.href = redirectTo
```

### OAuth Hash 清理
系統自動清理 OAuth 回調時產生的 hash 片段，避免 Vue Router 錯誤：
```javascript
// 自動偵測並清理 #access_token=... 等 hash 參數
if (hash.includes('access_token')) {
  const cleanUrl = window.location.href.split('#')[0]
  window.history.replaceState(null, '', cleanUrl)
}
```

## 📋 功能特色

### 1. 用戶體驗
- ✅ **自然的帳號選擇**: 登出後重新登入會自動顯示 Google 帳號選擇
- ✅ 清楚的視覺回饋（載入動畫、狀態訊息）
- ✅ 簡潔的操作流程
- ✅ 優雅的錯誤處理

### 2. 技術實現
- ✅ 完整的 session 清除
- ✅ 徹底的 localStorage 清理
- ✅ 統一的 OAuth 回調處理 (`/auth/callback`)
- ✅ 自動 OAuth hash 清理，避免路由錯誤
- ✅ 強制頁面重新載入確保完全登出

### 3. 安全性
- ✅ 確保完全登出
- ✅ 清除所有本地認證資料
- ✅ 標準 OAuth 流程
- ✅ 防止 session 殘留

## 🎨 UI 設計

### 登入頁面
- **Google 登入按鈕**: 主要的藍色漸層按鈕
- **載入狀態**: 轉圈動畫和狀態文字
- **錯誤/成功訊息**: 帶圖標的彩色提示框

### OAuth 回調頁面 (`/auth/callback`)
- **美觀的載入介面**: 與專案風格一致的設計
- **即時狀態更新**: 顯示登入處理進度
- **錯誤處理**: 友善的錯誤訊息和重試選項
- **自動導向**: 成功後自動跳轉到目標頁面

### 控制面板
- **登出按鈕**: 紅色主題的次要按鈕
- **載入狀態**: 登出時顯示處理中狀態

## 🐛 故障排除

### 常見問題

**Q: 點擊登入後沒有彈出 Google 登入畫面？**
A: 請檢查：
1. Supabase 專案的 Google OAuth 設定是否正確
2. Redirect URL 是否包含 `/auth/callback`
3. 瀏覽器是否阻擋了彈出視窗

**Q: 登入後停留在 `/auth/callback` 頁面？**
A: 請檢查：
1. 目標重導向 URL 是否正確
2. 瀏覽器 console 是否有錯誤訊息
3. Session 是否正確建立

**Q: 登出後仍然自動登入同一個帳號？**
A: 請確認：
1. 清除瀏覽器快取和 cookies
2. 檢查是否有其他頁面仍保持 Google 登入狀態
3. 嘗試無痕模式測試

**Q: 出現 Vue Router selector 錯誤？**
A: 系統已自動處理 OAuth hash 清理，如果仍有問題：
1. 檢查 `plugins/oauth-hash-cleaner.client.ts` 是否正確載入
2. 查看瀏覽器 console 是否有清理日誌

### 除錯資訊
系統會在瀏覽器 console 中記錄詳細的操作日誌：
```
AuthManager: 開始 Google 登入
AuthManager: Google 登入請求已發送
AuthCallback: 開始處理 OAuth 回調
AuthCallback: 登入成功，用戶: user@example.com
AuthCallback: 導向目標頁面: /dashboard
OAuth Hash Cleaner: 偵測到 OAuth hash 參數，正在清理
OAuth Hash Cleaner: 已清理 OAuth hash 參數
```

## 📚 相關檔案

### 主要實現檔案
- `composables/useAuthManager.ts` - 簡化的認證管理 composable
- `pages/login.vue` - 簡化的登入頁面
- `pages/auth/callback.vue` - OAuth 回調處理頁面
- `pages/dashboard.vue` - 控制面板，包含登出功能
- `plugins/oauth-hash-cleaner.client.ts` - OAuth hash 清理 plugin

### 關鍵函數
- `signInWithGoogle()` - 標準 Google 登入
- `signOut()` - 完整的登出功能（含強制重新載入）
- `clearSupabaseStorage()` - 清除 localStorage 資料

### OAuth 設定要求
在 Supabase 專案設定中，確保 Redirect URLs 包含：
```
https://yourdomain.com/auth/callback
http://localhost:3000/auth/callback  (開發環境)
```

## 🔄 更新紀錄

### v3.0.0 (2024/12/19) - 簡化版本
- ✅ **簡化**: 移除複雜的「切換帳號」按鈕和提示
- ✅ **改進**: 登出後自動顯示 Google 帳號選擇（標準 OAuth 行為）
- ✅ **新增**: OAuth hash 清理 plugin，修正 Vue Router 錯誤
- ✅ **增強**: 強制重新載入頁面確保完全登出
- ✅ **簡化**: 更直觀的用戶體驗

### v2.0.0 (2024/12/19) - 功能完整版
- ✅ **新增**: `prompt: 'select_account'` 參數，強制彈出 Google 帳號選擇畫面
- ✅ **新增**: `/auth/callback` 頁面處理 OAuth 回調
- ✅ **改進**: 統一的認證管理 composable (`useAuthManager`)

### v1.0.0 (2024/12/19) - 初始版本
- ✅ 實現基本的 Google 帳號登入登出功能

---

## 💡 使用建議

1. **Supabase 設定**: 確保在 Supabase 專案中正確設定 Google OAuth 和 Redirect URLs
2. **測試環境**: 在不同瀏覽器和帳號狀態下測試登入登出功能
3. **完全登出**: 使用登出功能而非瀏覽器操作來確保完全清除登入狀態
4. **監控日誌**: 定期檢查 console 日誌以了解使用者行為和潛在問題
5. **彈出視窗**: 確保網站允許彈出視窗，避免登入畫面被阻擋

---

**開發團隊**: DungeonTeamUp  
**最後更新**: 2024/12/19  
**版本**: 3.0.0 