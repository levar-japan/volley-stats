# node:20-alpine ベース（軽量・無料）
FROM node:20-alpine

# pnpm を Corepack 経由で有効化
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@9.7.0 --activate

# Next.js の sharp 等で必要（alpine用）＋ 開発時に便利なツールも入れる
# すべてコンテナ内で完結：git / bash / curl / openssh / firebase-tools など
RUN apk add --no-cache \
    libc6-compat \
    git \
    bash \
    curl \
    openssh-client

# Firebase CLI（エミュレータ/運用確認用。不要なら削除可）
# npm で global インストール（pnpm のグローバルでも可だが、互換性で npm を採用）
RUN npm i -g firebase-tools@13

WORKDIR /app

# 依存関係を先にインストール（キャッシュ効かせる）
COPY package.json pnpm-lock.yaml* ./
# lockfile が無い初回でも通るように fallback
RUN pnpm install --frozen-lockfile || pnpm install

# アプリ本体
COPY . .

EXPOSE 3000

# dev 用：コンテナ外からアクセスできるよう 0.0.0.0
CMD ["pnpm", "dev", "--", "-H", "0.0.0.0", "-p", "3000"]
