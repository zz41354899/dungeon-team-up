# Supabase Google OAuth 設定指南

## 🎯 目標
正確配置 Supabase 的 Google OAuth 設定，以支援 `prompt: 'select_account'` 功能，讓使用者能夠切換 Google 帳號。

## 📋 必要設定

### 1. Supabase 專案設定

#### Authentication Settings
1. 登入 [Supabase Dashboard](https://supabase.com/dashboard)
2. 選擇您的專案
3. 前往 **Authentication** > **Settings**

#### Site URL 設定
```
Site URL: https://yourdomain.com
```
開發環境：
```
Site URL: http://localhost:3000
```

#### Redirect URLs 設定 ⭐ **重要**
必須包含以下 URLs：

**正式環境：**
```
https://yourdomain.com/auth/callback
https://yourdomain.com/dashboard
https://yourdomain.com/login
```

**開發環境：**
```
http://localhost:3000/auth/callback
http://localhost:3000/dashboard
http://localhost:3000/login
```

> 🔑 **關鍵**: `/auth/callback` 是新增的回調頁面，必須加入 Redirect URLs 清單中

### 2. Google OAuth Provider 設定

#### 啟用 Google Provider
1. 在 **Authentication** > **Providers** 中
2. 找到 **Google** 並點擊啟用
3. 輸入以下資訊：

#### Client ID 和 Client Secret
```
Client ID: [從 Google Cloud Console 取得]
Client Secret: [從 Google Cloud Console 取得]
```

#### Redirect URL（自動產生）
Supabase 會自動產生：
```
https://[your-project-id].supabase.co/auth/v1/callback
```

## 🔧 Google Cloud Console 設定

### 1. 建立 OAuth 2.0 Client
1. 前往 [Google Cloud Console](https://console.cloud.google.com/)
2. 選擇或建立專案
3. 啟用 **Google+ API** 和 **OAuth 2.0**
4. 前往 **APIs & Services** > **Credentials**
5. 點擊 **Create Credentials** > **OAuth 2.0 Client ID**

### 2. 應用程式類型
選擇 **Web application**

### 3. 授權重導向 URI
加入以下 URIs：

**Supabase 回調 URI（必須）：**
```
https://[your-project-id].supabase.co/auth/v1/callback
```

**應用程式回調 URI（選擇性）：**
```
https://yourdomain.com/auth/callback
http://localhost:3000/auth/callback  (開發環境)
```

### 4. OAuth 同意畫面設定
1. 前往 **APIs & Services** > **OAuth consent screen**
2. 設定應用程式名稱、使用者支援電子郵件
3. 加入授權網域：
   ```
   yourdomain.com
   supabase.co
   localhost (開發環境)
   ```

## ✅ 測試設定

### 驗證步驟
1. **基本登入測試**：確認 Google OAuth 正常運作
2. **帳號切換測試**：
   - 使用帳號 A 登入
   - 點擊「切換 Google 帳號」
   - 應該看到 Google 帳號選擇畫面
   - 選擇帳號 B 登入
   - 確認系統正確識別新帳號

### 常見錯誤和解決方案

#### `redirect_uri_mismatch` 錯誤
**原因**: Redirect URI 不匹配
**解決**: 檢查 Google Cloud Console 和 Supabase 的 Redirect URLs 設定

#### `invalid_client` 錯誤
**原因**: Client ID 或 Client Secret 錯誤
**解決**: 重新檢查 Google Cloud Console 的憑證

#### 帳號選擇畫面沒有出現
**原因**: `prompt: 'select_account'` 參數沒有正確傳遞
**解決**: 檢查程式碼中的 OAuth 調用

## 🔒 安全性考量

### 1. HTTPS 要求
- 正式環境必須使用 HTTPS
- Google OAuth 不支援 HTTP（除了 localhost）

### 2. 網域驗證
- 確保所有 Redirect URLs 都是您控制的網域
- 不要加入未驗證的第三方網域

### 3. Client Secret 保護
- 永遠不要在前端程式碼中暴露 Client Secret
- Client Secret 只在 Supabase 伺服器端使用

## 📝 設定檢查清單

### Supabase 設定
- [ ] Site URL 正確設定
- [ ] Redirect URLs 包含所有必要的路徑
- [ ] Google Provider 已啟用
- [ ] Client ID 和 Client Secret 正確填入

### Google Cloud Console 設定
- [ ] OAuth 2.0 Client 已建立
- [ ] 授權重導向 URI 包含 Supabase 回調
- [ ] OAuth 同意畫面已設定
- [ ] 必要的 API 已啟用

### 應用程式設定
- [ ] `/auth/callback` 頁面已建立
- [ ] `prompt: 'select_account'` 參數正確使用
- [ ] 錯誤處理機制完整

## 🚀 部署注意事項

### 環境變數（如果使用）
```env
# .env (僅供參考，實際使用 Supabase Dashboard 設定)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 多環境設定
- **開發環境**: 使用 `localhost` URLs
- **測試環境**: 使用測試網域 URLs
- **正式環境**: 使用正式網域 URLs

---

## 📞 支援

如果遇到設定問題：
1. 檢查 Supabase Dashboard 的錯誤訊息
2. 查看瀏覽器 Console 的錯誤日誌
3. 參考 [Supabase Auth 文件](https://supabase.com/docs/guides/auth)
4. 參考 [Google OAuth 文件](https://developers.google.com/identity/protocols/oauth2)

---

**建立日期**: 2024/6/1  
**適用版本**: DungeonTeamUp v1.0.0 
