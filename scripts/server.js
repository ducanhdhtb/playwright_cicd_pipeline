const http = require('http');
const fs = require('fs');
const path = require('path');

const usersPath = path.join(__dirname, '..', 'test-data', 'users.json');
const users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

function layout(title, body) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      body { font-family: Arial, sans-serif; max-width: 860px; margin: 40px auto; padding: 0 16px; }
      .card { border: 1px solid #ddd; border-radius: 12px; padding: 20px; }
      label { display:block; margin-top: 12px; }
      input { width: 100%; padding: 10px; margin-top: 6px; }
      button { margin-top: 16px; padding: 10px 16px; cursor: pointer; }
      .error { color: #b00020; margin-top: 12px; }
      .ok { color: #0a7a2f; }
      nav a { margin-right: 12px; }
      code { background: #f4f4f4; padding: 2px 6px; border-radius: 6px; }
    </style>
  </head>
  <body>
    <nav>
      <a href="/">Home</a>
      <a href="/login">Login</a>
      <a href="/dashboard">Dashboard</a>
    </nav>
    ${body}
  </body>
  </html>`;
}

function parseBody(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', chunk => { data += chunk; });
    req.on('end', () => {
      const params = new URLSearchParams(data);
      resolve(Object.fromEntries(params.entries()));
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1:3000');

  if (req.method === 'GET' && url.pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(layout('Automation Demo Home', `
      <h1>Playwright CI/CD Demo</h1>
      <div class="card">
        <p>Mock app để luyện test login và pipeline CI/CD.</p>
        <p>Tài khoản hợp lệ: <code>demo_user / secret123</code></p>
        <a href="/login">Đi tới login</a>
      </div>
    `));
    return;
  }

  if (req.method === 'GET' && url.pathname === '/login') {
    const error = url.searchParams.get('error');
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(layout('Login Page', `
      <h1>Login</h1>
      <form class="card" method="POST" action="/login">
        <label for="username">Username</label>
        <input id="username" name="username" placeholder="Enter username" />
        <label for="password">Password</label>
        <input id="password" name="password" type="password" placeholder="Enter password" />
        <button type="submit">Sign in</button>
        ${error ? `<p class="error">${error}</p>` : ''}
      </form>
    `));
    return;
  }

  if (req.method === 'POST' && url.pathname === '/login') {
    const body = await parseBody(req);
    const matched = users.find(
      (u) => u.username === body.username && u.password === body.password
    );

    if (matched) {
      res.writeHead(302, { Location: `/dashboard?user=${encodeURIComponent(matched.username)}` });
      res.end();
      return;
    }

    res.writeHead(302, { Location: '/login?error=Invalid%20credentials' });
    res.end();
    return;
  }

  if (req.method === 'GET' && url.pathname === '/dashboard') {
    const user = url.searchParams.get('user');
    if (!user) {
      res.writeHead(302, { Location: '/login?error=Please%20login%20first' });
      res.end();
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(layout('Dashboard', `
      <h1>Dashboard</h1>
      <div class="card">
        <p class="ok">Welcome, ${user}</p>
        <p>Status: authenticated</p>
        <ul>
          <li>Job scheduler: healthy</li>
          <li>Bot sync: ready</li>
          <li>Last deploy: success</li>
        </ul>
      </div>
    `));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not found');
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Mock app running at http://127.0.0.1:3000');
});
