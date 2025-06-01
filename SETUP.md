# DungeonTeamUp 角色卡系統設置指南

## 📋 資料表結構

### 必要的 Supabase 資料表

```sql
-- 1. profiles 表 (角色卡主表)
CREATE TABLE profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    username text NOT NULL,
    avatar_url text,
    bio text,
    style text CHECK (style IN ('builder', 'designer', 'organizer')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. skills 表 (技能主表)
CREATE TABLE skills (
    id serial PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. preferences 表 (偏好主表)
CREATE TABLE preferences (
    id serial PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. profile_skills 表 (用戶技能關聯)
CREATE TABLE profile_skills (
    profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    skill_id integer REFERENCES skills(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (profile_id, skill_id)
);

-- 5. profile_preferences 表 (用戶偏好關聯)
CREATE TABLE profile_preferences (
    profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    preference_id integer REFERENCES preferences(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (profile_id, preference_id)
);

-- 6. availability 表 (時間可用性)
CREATE TABLE availability (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    weekly_hours integer NOT NULL DEFAULT 0 CHECK (weekly_hours >= 0 AND weekly_hours <= 40),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. projects 表 (專案)
CREATE TABLE projects (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    created_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. missions 表 (任務)
CREATE TABLE missions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
    created_by uuid REFERENCES profiles(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### 初始化資料

```sql
-- 插入預設技能
INSERT INTO skills (name, description) VALUES
('前端開發', '網頁前端界面開發'),
('後端開發', '伺服器端應用開發'),
('UI/UX設計', '使用者界面與體驗設計'),
('專案管理', '專案規劃與執行管理'),
('資料分析', '資料收集與分析'),
('行銷推廣', '產品行銷與推廣策略'),
('文案撰寫', '內容創作與文案撰寫'),
('測試除錯', '軟體測試與問題修復');

-- 插入預設偏好
INSERT INTO preferences (name, description) VALUES
('遠端工作', '偏好在家或遠端工作'),
('彈性時間', '喜歡彈性的工作時間'),
('團隊合作', '喜歡與團隊密切合作'),
('獨立作業', '偏好獨立完成工作'),
('學習導向', '重視學習新技術機會'),
('快節奏', '適應快速變化的環境'),
('創新挑戰', '喜歡創新與挑戰性工作'),
('穩定發展', '偏好穩定的工作環境');
```

## 🔧 權限設置 (RLS)

### Supabase 資料表權限

```sql
-- profiles 表權限
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "使用者可查看自己的角色卡" ON profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "使用者可更新自己的角色卡" ON profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "使用者可插入自己的角色卡" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- profile_skills 表權限
ALTER TABLE profile_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "使用者可管理自己的技能" ON profile_skills
FOR ALL USING (auth.uid() = profile_id);

-- profile_preferences 表權限
ALTER TABLE profile_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "使用者可管理自己的偏好" ON profile_preferences
FOR ALL USING (auth.uid() = profile_id);

-- availability 表權限
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "使用者可管理自己的可用性" ON availability
FOR ALL USING (auth.uid() = profile_id);

-- skills 和 preferences 表設為公開讀取
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "所有人可讀取技能" ON skills FOR SELECT USING (true);

ALTER TABLE preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "所有人可讀取偏好" ON preferences FOR SELECT USING (true);

-- projects 表權限
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "使用者可管理自己的專案" ON projects
FOR ALL USING (auth.uid() = created_by);

-- missions 表權限
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "使用者可管理自己的任務" ON missions
FOR ALL USING (auth.uid() = created_by);
```

## 🎨 組件架構

### 1. ProfileCard.vue
- **功能**: 顯示和編輯用戶角色卡
- **特色**: 
  - 自動檢測是否已建立角色卡
  - style 字段使用 enum 驗證 (builder, designer, organizer)
  - 模態框使用 z-[9999] 避免層級問題

### 2. SkillPreferencePanel.vue
- **功能**: 管理技能和偏好設定
- **特色**:
  - 使用 PreferenceTag 組件顯示標籤
  - 多選介面設定技能和偏好
  - 資料庫更新採用 delete-then-insert 模式

### 3. AvailabilityDisplay.vue
- **功能**: 設定每週可投入時間
- **特色**:
  - 滑桿式時間選擇 (0-40 小時)
  - 預設快速選項 (兼職、輕度、中度等)
  - 即時描述預覽

### 4. PreferenceTag.vue
- **功能**: 可重用的標籤組件
- **特色**:
  - 多種顏色變體 (skill, preference, success 等)
  - 支援圖標和刪除功能
  - 科技風格設計

## 🚀 使用方式

### 1. 環境變數設置
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. 組件導入
```vue
<template>
  <div>
    <ProfileCard 
      :profile="profile"
      :user-email="user.email"
      :user-id="user.id"
      @profile-updated="handleProfileUpdated"
    />
    
    <SkillPreferencePanel 
      :profile-id="profile?.id"
      @skills-updated="handleSkillsUpdated"
      @preferences-updated="handlePreferencesUpdated"
    />
    
    <AvailabilityDisplay 
      :profile-id="profile?.id"
      @availability-updated="handleAvailabilityUpdated"
    />
  </div>
</template>
```

### 3. 事件處理
```typescript
const handleProfileUpdated = (updatedProfile: Profile) => {
  profile.value = updatedProfile
}

const handleSkillsUpdated = () => {
  // 重新載入相關資料
}

const handlePreferencesUpdated = () => {
  // 重新載入相關資料
}

const handleAvailabilityUpdated = () => {
  // 處理可用性更新
}
```

## 📝 注意事項

1. **enum 驗證**: style 字段只能使用 'builder', 'designer', 'organizer'
2. **權限控制**: 所有操作都受 RLS 保護，只能操作自己的資料
3. **手動建立**: 移除了自動建立 profile 功能，避免 enum 錯誤
4. **z-index**: 所有模態框使用 z-[9999] 確保正確顯示層級
5. **驗證**: 所有表單都有必要的欄位驗證

## 🎯 功能特色

- ✅ 科技風主題設計
- ✅ 響應式 UI
- ✅ TypeScript 完整支援
- ✅ 完整錯誤處理
- ✅ 載入狀態管理
- ✅ 事件驅動架構
- ✅ 可重用組件設計
- ✅ 資料庫關聯完整 