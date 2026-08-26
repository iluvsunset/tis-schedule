var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// cloudflare-worker/src/index.js
var SHEET_URL = "https://docs.google.com/spreadsheets/d/1H5U71l1QHVPwCBg9c3KPaADG_jjaaRmxfsCNIXpBQJ4/gviz/tq?tqx=out:csv&gid=209193378";
var index_default = {
  /**
   * ⏰ Cron Scheduled Handler (Fires every 15 minutes)
   */
  async scheduled(event, env, ctx) {
    ctx.waitUntil(checkGoogleSheetForUpdates(env));
  },
  /**
   * 🌐 HTTP API Handler (For manual sync, status check, or push subscriptions)
   */
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    if (url.pathname === "/sync") {
      const result = await checkGoogleSheetForUpdates(env);
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    if (url.pathname === "/status") {
      const lastHash = env.SCHEDULE_KV ? await env.SCHEDULE_KV.get("last_sheet_hash") : "KV_NOT_BOUND";
      const lastSync = env.SCHEDULE_KV ? await env.SCHEDULE_KV.get("last_sync_time") : "N/A";
      return new Response(JSON.stringify({ status: "running", lastSync, lastHash }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
    return new Response(JSON.stringify({ message: "TIS Schedule Sync Worker Active" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
};
async function checkGoogleSheetForUpdates(env) {
  try {
    const response = await fetch(SHEET_URL, {
      headers: { "User-Agent": "TIS-Schedule-Sync-Bot/1.0" }
    });
    if (!response.ok) {
      return { success: false, error: `Google Sheets HTTP ${response.status}` };
    }
    const csvText = await response.text();
    const msgUint8 = new TextEncoder().encode(csvText);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const newHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    const nowIso = (/* @__PURE__ */ new Date()).toISOString();
    if (!env.SCHEDULE_KV) {
      console.log("SCHEDULE_KV not bound, current hash:", newHash);
      return { success: true, changed: false, hash: newHash, note: "KV not bound" };
    }
    const previousHash = await env.SCHEDULE_KV.get("last_sheet_hash");
    if (previousHash && previousHash !== newHash) {
      console.log("\u{1F514} New schedule detected! Sending notifications...");
      await broadcastNotification(env, {
        title: "C\xF3 th\u1EDDi kh\xF3a bi\u1EC3u m\u1EDBi",
        body: "L\u1ECBch h\u1ECDc L\u1EDBp 11-TN \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EADp nh\u1EADt."
      });
      await env.SCHEDULE_KV.put("last_sheet_hash", newHash);
      await env.SCHEDULE_KV.put("last_sync_time", nowIso);
      await env.SCHEDULE_KV.put("last_change_detected", nowIso);
      return { success: true, changed: true, newHash, previousHash };
    }
    await env.SCHEDULE_KV.put("last_sheet_hash", newHash);
    await env.SCHEDULE_KV.put("last_sync_time", nowIso);
    return { success: true, changed: false, hash: newHash };
  } catch (error) {
    console.error("Sync error:", error);
    return { success: false, error: error.message };
  }
}
__name(checkGoogleSheetForUpdates, "checkGoogleSheetForUpdates");
async function broadcastNotification(env, payload) {
  if (env.DISCORD_WEBHOOK_URL) {
    try {
      await fetch(env.DISCORD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: `\u{1F514} **${payload.title}**
${payload.body}`
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
          text: `\u{1F514} *${payload.title}*
${payload.body}`,
          parse_mode: "Markdown"
        })
      });
    } catch (err) {
      console.error("Telegram dispatch failed:", err);
    }
  }
}
__name(broadcastNotification, "broadcastNotification");
export {
  index_default as default
};
//# sourceMappingURL=index.js.map
