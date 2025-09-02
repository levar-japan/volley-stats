# volley-stats (環境構築用最小雛形)

- Windows + VSCode + Docker + pnpm
- Next.js 14 + TypeScript + Tailwind CSS
- Firebase (Anonymous Auth + Firestore)
- スマホ優先 UI

## 使い方（超概要）
1. `.env.example` を `.env` にコピーし、Firebase の Web 設定値を投入
2. `docker compose up --build`
3. http://localhost:3000 を開く（匿名Authの uid が表示されればOK）
