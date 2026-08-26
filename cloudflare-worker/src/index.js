/**
 * Cloudflare Worker: TIS Schedule 11-TN Web App + Auto Sync Cron
 * 
 * Features:
 * 1. Serves the full Vite React Frontend Web App (UI, Icons, PWA).
 * 2. Runs background Cron check every 15 minutes.
 * 3. Broadcasts "Có thời khóa biểu mới" when changes are detected.
 */

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1H5U71l1QHVPwCBg9c3KPaADG_jjaaRmxfsCNIXpBQJ4/gviz/tq?tqx=out:csv&gid=209193378";

export default {
  /**
   * ⏰ Cron Scheduled Handler (Fires every 15 minutes)
   */
  async scheduled(event, env, ctx) {
    ctx.waitUntil(checkGoogleSheetForUpdates(env));
  },

  /**
   * 🌐 HTTP Handler (Serves React Web App + APIs)
   */
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS Headers for API endpoints
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 1. Manual Sync API Endpoint: GET /api/sync or /sync
    if (url.pathname === "/api/sync" || url.pathname === "/sync") {
      const result = await checkGoogleSheetForUpdates(env);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 2. Status API Endpoint: GET /api/status or /status
    if (url.pathname === "/api/status" || url.pathname === "/status") {
      const lastHash = env.SCHEDULE_KV ? await env.SCHEDULE_KV.get("last_sheet_hash") : "KV_NOT_BOUND";
      const lastSync = env.SCHEDULE_KV ? await env.SCHEDULE_KV.get("last_sync_time") : "N/A";
      return new Response(JSON.stringify({ status: "running", lastSync, lastHash }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // 3. Serve Frontend Web App Assets (HTML, JS, CSS, PWA)
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response("TIS Schedule Active", { status: 200 });
  }
};

/**
 * Fetches Google Sheet, calculates SHA-256 hash, and triggers notification if changed
 */
async function checkGoogleSheetForUpdates(env) {
  try {
    const response = await fetch(SHEET_URL, {
      headers: { "User-Agent": "TIS-Schedule-Sync-Bot/1.0" }
    });

    if (!response.ok) {
      return { success: false, error: `Google Sheets HTTP ${response.status}` };
    }

    const csvText = await response.text();

    // Generate SHA-256 Hash of the sheet content
    const msgUint8 = new TextEncoder().encode(csvText);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const newHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");

    const nowIso = new Date().toISOString();

    if (!env.SCHEDULE_KV) {
      console.log("SCHEDULE_KV not bound, current hash:", newHash);
      return { success: true, changed: false, hash: newHash, note: "KV not bound" };
    }

    const previousHash = await env.SCHEDULE_KV.get("last_sheet_hash");

    // Check if sheet has changed
    if (previousHash && previousHash !== newHash) {
      console.log("🔔 New schedule detected! Sending notifications...");

      // 1. Send Simplified Notification
      await broadcastNotification(env, {
        title: "Có thời khóa biểu mới",
        body: "Lịch học Lớp 11-TN đã được cập nhật."
      });

      // 2. Update KV state
      await env.SCHEDULE_KV.put("last_sheet_hash", newHash);
      await env.SCHEDULE_KV.put("last_sync_time", nowIso);
      await env.SCHEDULE_KV.put("last_change_detected", nowIso);

      return { success: true, changed: true, newHash, previousHash };
    }

    // No change detected
    await env.SCHEDULE_KV.put("last_sheet_hash", newHash);
    await env.SCHEDULE_KV.put("last_sync_time", nowIso);

    return { success: true, changed: false, hash: newHash };
  } catch (error) {
    console.error("Sync error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Broadcasts notification payload to Discord / Telegram webhook or Web Push subscribers
 */
async function broadcastNotification(env, payload) {
  if (env.DISCORD_WEBHOOK_URL) {
    try {
      await fetch(env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `🔔 **${payload.title}**\n${payload.body}`
        })
      });
    } catch (err) {
      console.error("Discord webhook dispatch failed:", err);
    }
  }

  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    try {
      const tgUrl = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;
      await fetch(tgUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text: `🔔 *${payload.title}*\n${payload.body}`,
          parse_mode: "Markdown"
        })
      });
    } catch (err) {
      console.error("Telegram dispatch failed:", err);
    }
  }
}
