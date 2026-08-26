# ⚡ Cloudflare Worker: TIS Schedule 11-TN Auto Sync Cron

This serverless Cloudflare Worker automatically monitors the Google Sheets timetable every **15 minutes** (100% Free on Cloudflare).

When changes or new weeks are detected, it dispatches the simplified notification:
* **Title**: `Có thời khóa biểu mới`
* **Body**: `Lịch học Lớp 11-TN đã được cập nhật.`

---

## 🚀 Quick Deployment Options

### Option 1: Via Cloudflare Web Dashboard (Zero Terminal Required)
1. Go to **[Cloudflare Dashboard](https://dash.cloudflare.com/)** ➔ **Workers & Pages** ➔ **Create Worker**.
2. Name it `tis-schedule-sync` and click **Deploy**.
3. Click **Edit Code**, paste the entire code from `src/index.js`, and click **Deploy**.
4. In your Worker settings:
   * Go to **Triggers** ➔ **Add Cron Trigger** ➔ Set to `*/15 * * * *` (Every 15 minutes).
   * Go to **KV Namespace Bindings** ➔ Create KV `SCHEDULE_KV` and bind it as `SCHEDULE_KV`.

---

### Option 2: Via Terminal (`wrangler`)
```bash
cd cloudflare-worker

# 1. Login to Cloudflare
npx wrangler login

# 2. Create KV Namespace
npx wrangler kv:namespace create SCHEDULE_KV

# 3. Paste the generated KV id into wrangler.toml, then deploy:
npx wrangler deploy
```

---

## 📡 API Endpoints
* `GET /sync`: Manually triggers check against Google Sheets.
* `GET /status`: View last sync timestamp and hash.
