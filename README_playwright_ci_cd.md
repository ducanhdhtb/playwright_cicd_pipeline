# 🚀 Playwright CI/CD Demo (Automation Project)

Project demo này giúp thực hành:
- Playwright automation test
- Mock web app (login)
- CI/CD với GitHub Actions

---

# ⚙️ Cài đặt

## 1. Cài dependencies
npm install

## 2. Cài browser
npx playwright install --with-deps chromium

---

# ▶️ Chạy app
npm run start

Mở:
http://localhost:3000

---

# 🧪 Chạy test
npm test

---

# ⚡ CI/CD (GitHub Actions)

## Tạo file:
.github/workflows/playwright-ci.yml

## Nội dung:

name: Playwright CI

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
        env:
          CI: true

---

# 🔥 Quan trọng

playwright.config.js phải có:

webServer: {
  command: 'node scripts/server.js',
  url: 'http://127.0.0.1:3000',
}

---

# 💡 Flow CI

Push code → chạy test → pass/fail → xem report
