type RenderOptions = {
  title: string;
  body: string;
};

export const renderPage = ({ title, body }: RenderOptions) => {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: #0B0F1A;
        --surface: #141A2A;
        --text: #E6EAF2;
        --primary: #FF2D95;
        --secondary: #00F5FF;
        --accent: #B6FF3A;
        --glow: rgba(0, 245, 255, 0.35);
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: Inter, system-ui, sans-serif;
        background: radial-gradient(circle at top, #101629, var(--bg));
        color: var(--text);
        min-height: 100vh;
        overflow-x: hidden;
      }

      .layout {
        max-width: 960px;
        margin: 0 auto;
        padding: 48px 24px 72px;
        position: relative;
      }

      .card {
        background: var(--surface);
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 0 24px rgba(255, 45, 149, 0.15);
        border-radius: 20px;
        padding: 32px;
        position: relative;
        overflow: hidden;
      }

      .card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(120deg, rgba(0, 245, 255, 0.05), rgba(255, 45, 149, 0.08));
        opacity: 0.5;
        pointer-events: none;
      }

      h1, h2 {
        font-family: Orbitron, Inter, system-ui, sans-serif;
        margin-top: 0;
      }

      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 12px 20px;
        border-radius: 999px;
        border: 1px solid var(--secondary);
        color: var(--text);
        background: transparent;
        text-decoration: none;
        font-weight: 600;
        letter-spacing: 0.5px;
        box-shadow: 0 0 12px rgba(0, 245, 255, 0.2);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .button:hover {
        transform: translateY(-1px);
        box-shadow: 0 0 16px var(--glow);
      }

      .button.primary {
        border-color: var(--primary);
        box-shadow: 0 0 16px rgba(255, 45, 149, 0.35);
      }

      .row {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
      }

      .muted {
        color: rgba(230, 234, 242, 0.7);
      }

      input[type='text'] {
        width: 100%;
        padding: 10px 14px;
        margin-top: 6px;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.12);
        background: rgba(10, 14, 26, 0.8);
        color: var(--text);
      }

      .ambient-orb {
        position: absolute;
        width: 180px;
        height: 180px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(0, 245, 255, 0.35), transparent 70%);
        filter: blur(2px);
        animation: float 8s ease-in-out infinite;
        top: -40px;
        right: -60px;
        opacity: 0.6;
        pointer-events: none;
      }

      .scanline {
        position: absolute;
        inset: 0;
        background: repeating-linear-gradient(
          180deg,
          rgba(255, 255, 255, 0.02),
          rgba(255, 255, 255, 0.02) 1px,
          transparent 1px,
          transparent 4px
        );
        mix-blend-mode: screen;
        opacity: 0.25;
        pointer-events: none;
        animation: drift 6s linear infinite;
      }

      @keyframes float {
        0% { transform: translate(0, 0); }
        50% { transform: translate(-12px, 8px); }
        100% { transform: translate(0, 0); }
      }

      @keyframes drift {
        0% { transform: translateY(0); }
        100% { transform: translateY(12px); }
      }
    </style>
  </head>
  <body>
    <div class="layout">
      <div class="ambient-orb"></div>
      <div class="card">
        <div class="scanline"></div>
        ${body}
      </div>
    </div>
  </body>
</html>`;
};
