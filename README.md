# MIRA Lab 網站

國立中興大學資訊工程學系「生醫資訊推理與分析實驗室」（MIRA: Medical Information Reasoning and Analysis）的官方網站。

- 線上網址：<https://miralabnchu.github.io/>
- Repo：<https://github.com/miralabnchu/miralabnchu.github.io>

網站是純靜態頁面（HTML、CSS、JavaScript），沒有框架，也不需要安裝或建置。`main` 分支上的內容就是線上的內容：**推上 `main` 後約一到兩分鐘，線上網站就會更新。**

## 檔案結構

| 檔案 | 內容 |
|---|---|
| `index.html` | 所有頁面內容：研究領域、合作圖、成員、課程、活動、聯絡 |
| `css/style.css` | 樣式。顏色、字型、間距都定義在最上方的 `:root` |
| `js/main.js` | 中英文切換與頁尾年份 |
| `assets/` | 標誌、分頁圖示、頁尾花紋 |
| `assets/members/` | 成員頭像短影片與封面（有影片時才建立） |
| `.nojekyll` | 讓 GitHub Pages 直接提供檔案，不要刪 |

## 第一次設定

1. 請實驗室的 repo 管理者把你的 GitHub 帳號加進 `miralabnchu` 組織，並給這個 repo 寫入（Write）權限。
2. 下載 repo：

   ```bash
   git clone https://github.com/miralabnchu/miralabnchu.github.io.git
   ```

3. 如果你的電腦登入過別的 GitHub 帳號，推送時可能會用錯帳號而被拒絕（`Permission denied to <別的帳號>`）。在這個專案裡指定要用的帳號：

   ```bash
   git remote set-url origin https://<你的帳號>@github.com/miralabnchu/miralabnchu.github.io.git
   ```

## 修改流程

每次修改都照這個順序做：

1. **先拉最新版本**，避免蓋掉別人的修改：

   ```bash
   git pull --rebase origin main
   ```

2. **修改檔案。**
3. **在自己電腦上預覽**（見下一節），中文版、英文版、手機寬度都看過。
4. **提交**，訊息寫清楚改了什麼：

   ```bash
   git add -A
   ```

   ```bash
   git commit -m "新增 115 學年度下學期課程"
   ```

5. **推送**：

   ```bash
   git push origin main
   ```

6. 等一到兩分鐘，打開線上網址確認結果。瀏覽器可能顯示舊版，按 Ctrl+F5 強制重新整理。

如果只是想看別人有沒有更新、但還不想合併進來，用 `git fetch origin`，再用 `git log HEAD..origin/main --oneline` 看有哪些新的 commit。

## 本機預覽

在專案資料夾執行下面的指令，然後用瀏覽器開 <http://localhost:8765>：

```bash
python -m http.server 8765
```

直接雙擊 `index.html` 也能看，但字型與部分行為可能和線上不同，建議用上面的方式。

## 規定

- **推送前一定要先 `git pull --rebase`。** 推送被拒絕（`rejected`）時，代表別人先推了，先拉下來再推一次。
- **不要使用 `git push --force`。** 這會刪掉別人已經推上去的修改。
- **推送前一定要在本機預覽過。** `main` 就是線上網站，推上去的錯誤所有訪客都看得到。
- **一次 commit 只做一件事**，訊息用一句話說明內容，例如「更新碩一成員名單」，不要寫「update」或「修改」。
- **較大的改動（改版面、加新區塊）另開分支**，推上去後開 Pull Request，請另一位成員看過再合併：

  ```bash
  git checkout -b add-publications
  ```

- **不要上傳密碼、金鑰、未公開的研究資料或病患資料。** 這是公開 repo，推上去後任何人都看得到，刪除後歷史紀錄裡仍然存在。
- **放上個人資料前先取得本人同意**，包括姓名、照片、信箱。
- **圖片放在 `assets/`**，上傳前先壓縮，單張建議小於 500 KB，檔名用英文小寫與連字號，例如 `lab-outing-2026.jpg`。
- **不要把無關的檔案推上來**，例如編輯器設定、系統檔、個人筆記。需要排除的檔案加到 `.gitignore`。

## 常見的內容修改

以下都在 `index.html`，每個區塊上方都有註解標示格式。

### 中英文

頁面預設顯示中文，英文寫在同一個標籤的 `data-en` 屬性。新增文字時兩種語言都要寫：

```html
<dt data-en="Ph.D. student">博士生</dt>
```

沒有 `data-en` 的文字在兩種語言下都顯示原樣，例如人名。

### 新增成員

找到 `id="people"` 的區塊。成員依入學級別分組，每一組是一個 `<section class="cohort">`，每個人是一個 `<li class="person">`：

```html
<li class="person">
  <div class="portrait"><span class="portrait-ph" aria-hidden="true">姓</span></div>
  <p class="person-name">姓名</p>
</li>
```

新的一屆入學時，複製一整個 `<section class="cohort">` 並改標題；畢業的成員移到「已畢業學生」。

### 成員頭像短影片

每個人的頭像是一段 1 到 2 秒、無聲、循環播放的短影片。還沒有影片時，頭像格會顯示姓氏當佔位。

**影片規格**

| 項目 | 規格 |
|---|---|
| 長度 | 1 到 2 秒，頭尾動作盡量接得起來，循環時才不會跳 |
| 比例 | 直式 4:5，建議 480 × 600 像素 |
| 格式 | MP4（H.264），不要聲音軌 |
| 大小 | 每支 300 KB 以下 |
| 封面 | 另存一張同比例的 JPG（影片第一格），100 KB 以下 |
| 檔名 | 英文小寫與連字號，影片與封面同名，例如 `member-01.mp4`、`member-01.jpg` |

人臉放在畫面中間偏上，背景盡量單純；所有人用同一個背景或同一種色調，整排看起來才整齊。

手機拍的影片通常有幾 MB，要先轉檔。有安裝 ffmpeg 的話，下面的指令會取前 2 秒、裁成 4:5、去掉聲音並壓縮，第二行則是取出封面：

```bash
ffmpeg -i input.mov -t 2 -an -vf "crop=ih*4/5:ih,scale=480:600" -c:v libx264 -crf 28 -pix_fmt yuv420p -movflags +faststart member-01.mp4
```

```bash
ffmpeg -i member-01.mp4 -frames:v 1 -q:v 4 member-01.jpg
```

**放上網站**

1. 把影片與封面放進 `assets/members/`。
2. 在 `index.html` 找到那個人，把 `<span class="portrait-ph">…</span>` 整個換成：

   ```html
   <video src="assets/members/member-01.mp4" poster="assets/members/member-01.jpg" muted loop playsinline preload="metadata"></video>
   ```

**播放方式**

- 頭像捲進畫面時自動播放，捲出畫面就暫停，不會同時播放全部影片。
- 訪客的系統若開啟「減少動態效果」，影片不會自動播放，只顯示封面；滑鼠移上去或用鍵盤選到時才播放。
- 影片一律靜音。有聲音的影片瀏覽器不允許自動播放。

### 新增課程

找到 `id="courses"` 的區塊。每個學期是一個 `<div>`，新的學期放最上面：

```html
<li>
  <span data-en="English Course Name">課程中文名稱</span>
  <small data-en="Graduate · Elective · 3 credits">碩士班 · 選修 · 3 學分</small>
</li>
```

### 新增活動

找到 `id="activities"` 的區塊，新的活動放最上面：

```html
<div><dt>2026.09</dt><dd data-en="Event name">活動名稱</dd></div>
```

### 修改合作圖

找到 `id="collab"` 的區塊。每個 `<div class="flow">` 是一個研究領域，裡面的 `branch` 是合作單位，`leaf` 是研究計畫。連線由 CSS 自動畫出，增減節點不需要改樣式。修改後記得同步更新 `id="research"` 區塊裡的合作單位與計畫清單。

## 聯絡

網站內容有誤或需要權限，請聯絡網站維護者（71150561112nchu@smail.nchu.edu.tw）。
