# 🧩 DungeonTeamUp

DungeonTeamUp 是一款結合任務分工、技能偏好與角色卡管理的「共創副本」平台，協助創作者組團打地下城，找到志同道合的夥伴完成專案。

---

## 🚀 技術架構

- **Nuxt 3**（Composition API + TypeScript）
- **Tailwind CSS** `v3.4.17`
- **Supabase**（Authentication / Database）
- **Google OAuth 2.0** 作為登入方式

---

## 🔐 Google OAuth + Supabase Auth 使用方式

### ✅ 一、啟用 Google 登入（Supabase 後台）

1. 開啟 Supabase 專案 → `Authentication` → `Providers` → Google  
2. 填入 `Client ID` 與 `Client Secret`  
3. 在 Supabase 中設定合法 Redirect URLs（**不要加 query 參數**）：

```
http://localhost:3000/auth/callback
https://your-production-url.vercel.app/auth/callback
```

---

### ✅ 二、.env 設定範例

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

---

### ✅ 三、前端登入實作範例（with redirect）

```ts
await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectTo)}`,
    queryParams: {
      prompt: 'select_account'
    }
  }
})
```

---

## 🧩 資料庫設計（PostgreSQL + 關聯）

### 🔹 `profiles`（角色卡）

| 欄位           | 類型        | 描述                     |
|----------------|-------------|--------------------------|
| id             | `uuid`      | 對應 `auth.users.id`     |
| username       | `text`      | 使用者名稱               |
| avatar_url     | `text`      | 頭像網址                 |
| bio            | `text`      | 自我介紹                 |
| style          | `enum`      | Builder / Designer / Organizer |
| created_at     | `timestamptz` | 建立時間              |

### 🔹 `skills`, `preferences`

| skills / preferences 表 | 欄位            |
|------------------------|-----------------|
| `id` (`int4`)          | 技能 / 偏好編號 |
| `name` (`text`)        | 技能 / 偏好名稱 |

關聯表：

- `profile_skills`: `profile_id`, `skill_id`
- `profile_preferences`: `profile_id`, `preference_id`

### 🔹 `availability`

| 欄位名稱     | 類型    | 說明             |
|--------------|---------|------------------|
| profile_id   | `uuid`  | FK → profiles.id |
| weekly_hours | `int4`  | 每週可投入時數   |

### 🔹 `projects`

| 欄位         | 類型        | 說明             |
|--------------|-------------|------------------|
| id           | `uuid`      | 專案 ID          |
| title        | `text`      | 專案名稱         |
| description  | `text`      | 專案描述         |
| created_by   | `uuid`      | FK → profiles.id |
| created_at   | `timestamptz` | 建立時間        |

### 🔹 `missions`

| 欄位         | 類型        | 說明                   |
|--------------|-------------|------------------------|
| id           | `uuid`      | 任務 ID                |
| title        | `text`      | 任務名稱               |
| description  | `text`      | 任務描述（可選）       |
| project_id   | `uuid`      | FK → projects.id       |
| created_by   | `uuid`      | FK → profiles.id       |
| created_at   | `timestamptz` | 建立時間             |

---

## 🔐 Supabase RLS 設定建議

### ✅ profiles

```sql
CREATE POLICY "User owns their profile"
ON profiles FOR ALL
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);
```

### ✅ profile_skills / profile_preferences / availability

```sql
CREATE POLICY "Manage own record"
ON profile_skills FOR ALL
USING (auth.uid() = profile_id)
WITH CHECK (auth.uid() = profile_id);
```

> ⚠️ 請複製上述邏輯同樣套用至其他關聯表。

### ✅ projects / missions

```sql
CREATE POLICY "Project owner access"
ON projects FOR ALL
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Mission owner access"
ON missions FOR ALL
USING (auth.uid() = created_by)
WITH CHECK (auth.uid() = created_by);
```

---

## 🧪 開發與執行

```bash
npm install
npm run dev
```

---

## 🤝 社群與貢獻

- 歡迎 Fork、PR 或提出 Issue 一同打造共創副本體驗
- 請在提交 PR 前確保通過 Lint / Build

---

## 🗓️ 更新紀錄

最後更新：2025-06-01  
作者：黃奇昌｜DungeonTeamUp 共創平台