import * as Sentry from "@sentry/browser";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN", // ご自身の DSN に置き換えてください
  // 必要に応じたオプション（環境、リリース情報など）を追加
});
