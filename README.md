# Playwright CI/CD Advanced Demo

Project này giúp bạn thực hành:

- Viết test Playwright cơ bản
- Test login flow với dữ liệu mẫu
- Chạy local bằng mock app đơn giản
- Thiết lập CI bằng GitHub Actions
- Thực hành Jenkins pipeline
- Thu thập và "deploy" report theo kiểu demo

## 1. Cài đặt

```bash
npm install
npx playwright install --with-deps chromium
```

## 2. Chạy test

```bash
npm test
```

Chạy có giao diện:

```bash
npm run test:headed
```

Mở UI mode:

```bash
npm run test:ui
```

## 3. Cấu trúc project

- `scripts/server.js`: mock web app có trang home, login, dashboard
- `test-data/users.json`: dữ liệu test
- `tests/home.spec.js`: test smoke cho home page
- `tests/login.spec.js`: test login thành công, sai mật khẩu, truy cập dashboard trái phép
- `.github/workflows/playwright-ci.yml`: pipeline CI demo
- `Jenkinsfile`: pipeline Jenkins demo

## 4. Kịch bản test hiện có

### Smoke test
- Trang chủ mở được
- Có title đúng
- Có link tới login

### Login flow
- Đăng nhập thành công với `demo_user / secret123`
- Sai mật khẩu thì hiện `Invalid credentials`
- Vào `/dashboard` trực tiếp thì bị redirect về login

## 5. Luồng CI/CD demo

### GitHub Actions
1. Checkout code
2. Setup Node.js
3. `npm ci`
4. Cài browser Playwright
5. Run lint
6. Run test
7. Upload `playwright-report`
8. Nếu branch là `main`, chạy bước giả lập deploy report

### Jenkins
1. Checkout
2. Install dependencies
3. Install Playwright browser
4. Run lint
5. Run tests
6. Archive report và test results
7. Nếu là branch `main`, giả lập publish report

## 6. Bài tập để tự nâng cấp

- Thêm test logout
- Tách `loginPage` thành Page Object Model
- Thêm test data cho nhiều role
- Thêm environment variable cho `BASE_URL`
- Dùng GitHub Pages hoặc S3 để publish report thật
- Thêm job deploy staging sau khi test pass

## 7. Gợi ý CI/CD thực tế hơn

- Chạy test theo tag: smoke, regression
- Chạy matrix nhiều browser
- Dùng secret manager thay vì hardcode config
- Gửi thông báo Slack khi pipeline fail
- Có environment staging riêng
- Có approval trước production
