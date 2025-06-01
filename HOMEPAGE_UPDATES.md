# DungeonTeamUp 首頁功能更新

## 📋 完成的修改

### ✅ 1. 移除「立即登入」按鈕
- **修改檔案**: `pages/index.vue`
- **變更內容**: 
  - 從 CTA 按鈕組中移除「立即登入」按鈕
  - 保留「瀏覽任務」和「顯示角色卡」按鈕
  - 用戶仍可透過右上角導覽列的「開始冒險」按鈕進入登入頁面

### ✅ 2. 修改任務顯示邏輯
- **原功能**: 搜尋特定任務
- **新功能**: 顯示所有任務並支援即時過濾
- **變更詳情**:
  - 模態框標題改為「所有任務」
  - 按鈕文字改為「瀏覽任務」
  - 載入時顯示所有任務（最多 50 個）
  - 搜尋框改為即時過濾功能
  - 新增建立者資訊顯示（透過 JOIN profiles 表）

### ✅ 3. 強化任務資訊顯示
每個任務現在顯示：
- ✅ 任務名稱（title）
- ✅ 任務描述（description）
- ✅ 所屬專案名稱（透過 project_id join projects.title）
- ✅ 建立者（透過 created_by join profiles.username）
- ✅ 建立時間（格式化為中文日期）

### ✅ 4. 角色卡功能確認
角色卡模態框正常顯示：
- ✅ 使用者名稱（username）
- ✅ 風格（style）
- ✅ 自我介紹（bio）
- ✅ 頭像（avatar_url，若無則顯示預設圖）

## 🔧 技術實現

### Supabase 查詢最佳化
```sql
-- 任務查詢（包含關聯資料）
SELECT 
  id, title, description, project_id, created_by, created_at,
  projects(title),
  profiles!missions_created_by_fkey(username)
FROM missions
ORDER BY created_at DESC
LIMIT 50
```

### 即時搜尋過濾
使用 Vue 3 Computed Property 實現：
```javascript
const filteredMissions = computed(() => {
  if (!searchQuery.value.trim()) {
    return allMissions.value
  }
  
  const query = searchQuery.value.toLowerCase()
  return allMissions.value.filter(mission => 
    mission.title.toLowerCase().includes(query) ||
    mission.description?.toLowerCase().includes(query) ||
    mission.projects?.title?.toLowerCase().includes(query) ||
    mission.creator?.username?.toLowerCase().includes(query)
  )
})
```

## 🔐 RLS Policy 設定需求

為了讓未登入用戶也能查看資料，需要在 Supabase 中執行以下 SQL：

```sql
-- 允許公開讀取角色卡
CREATE POLICY "公開讀取角色卡" ON profiles
FOR SELECT USING (true);

-- 允許公開讀取專案
CREATE POLICY "公開讀取專案" ON projects
FOR SELECT USING (true);

-- 允許公開讀取任務
CREATE POLICY "公開讀取任務" ON missions
FOR SELECT USING (true);
```

> 📌 **注意**: 這些 Policy 只允許讀取，寫入權限仍然受限於原有的 RLS 設定

## 🎨 UI/UX 改進

### 任務顯示優化
- 專案名稱使用綠色標籤（emerald）
- 建立者使用藍色標籤（blue）
- 時間資訊使用灰色顯示
- 支援 RWD 排版（flexbox + gap）

### 角色卡展示
- 網格佈局：手機 1 欄、平板 2 欄、桌面 3 欄
- 頭像支援預設字母圓形
- 風格標籤使用紫色主題

## 📱 響應式設計
- 模態框在小螢幕上適當調整大小
- 標籤在小螢幕上自動換行
- 按鈕組在手機上改為垂直排列

## 🚀 效能優化
- 任務載入限制為 50 筆
- 即時搜尋無需額外 API 請求
- 使用 computed property 減少重複計算 