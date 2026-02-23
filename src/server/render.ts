import { runConfig } from './config.js';

type RenderOptions = {
  title: string;
  body: string;
  tierScore?: number;
  minimalEffects?: boolean;
};

const escapeHtml = (value: string) => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

const toTitleCase = (value: string) => {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
};

const clampTier = (value: number | undefined) => {
  if (!value || Number.isNaN(value)) {
    return 5;
  }

  return Math.max(1, Math.min(9, Math.round(value)));
};

const getThemeTokens = () => {
  if (runConfig.themePack === 'neutral') {
    return {
      bg: '#0E1522',
      surface: '#172236',
      text: '#E6ECF5',
      primary: '#4F8CFF',
      secondary: '#7CE0FF',
      accent: '#A1F0C4',
      glow: 'rgba(79, 140, 255, 0.35)',
      headline: 'Neutral Training Theme',
    };
  }

  return {
    bg: '#160D0A',
    surface: '#261410',
    text: '#F7E9DE',
    primary: '#FF6A00',
    secondary: '#FFB347',
    accent: '#FFD166',
    glow: 'rgba(255, 106, 0, 0.38)',
    headline: 'Inferno Training Theme',
  };
};

const resolveBrandLabel = () => {
  const themeLabel = runConfig.themePack === 'neutral' ? 'Neutral' : 'Inferno';
  const tenantLabel = runConfig.tenantId ? toTitleCase(runConfig.tenantId) : null;

  if (runConfig.brandLogoMode === 'none') {
    return '';
  }

  if (runConfig.brandLogoMode === 'tenant' && tenantLabel) {
    return `${tenantLabel} Training`;
  }

  return `Challenge 001 · ${themeLabel}`;
};

const resolveWatermark = () => {
  if (!runConfig.themeWatermark) {
    return '';
  }

  const tenant = runConfig.tenantId ? toTitleCase(runConfig.tenantId) : 'Challenge 001';
  return `${tenant} · Internal Training`;
};

export const renderPage = ({ title, body, tierScore, minimalEffects }: RenderOptions) => {
  const tokens = getThemeTokens();
  const tier = clampTier(tierScore);
  const intensity = 0.14 + tier * 0.05;
  const isInferno = runConfig.themePack !== 'neutral';
  const smokeOpacity = isInferno ? 0.06 + tier * 0.045 : 0.03;
  const fireOpacity = isInferno ? 0.08 + tier * 0.05 : 0.04;
  const emberOpacity = isInferno ? 0.03 + tier * 0.03 : 0.02;
  const hazeOpacity = isInferno ? 0.04 + tier * 0.025 : 0.015;
  const motionScale = isInferno ? 0.8 + tier * 0.1 : 0.35;
  const brandLabel = resolveBrandLabel();
  const watermarkLabel = resolveWatermark();

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      :root {
        color-scheme: dark;
        --bg: ${tokens.bg};
        --surface: ${tokens.surface};
        --text: ${tokens.text};
        --primary: ${tokens.primary};
        --secondary: ${tokens.secondary};
        --accent: ${tokens.accent};
        --glow: ${tokens.glow};
        --tier-intensity: ${intensity.toFixed(2)};
        --smoke-opacity: ${smokeOpacity.toFixed(3)};
        --fire-opacity: ${fireOpacity.toFixed(3)};
        --ember-opacity: ${emberOpacity.toFixed(3)};
        --haze-opacity: ${hazeOpacity.toFixed(3)};
        --motion-scale: ${motionScale.toFixed(2)};
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        font-family: Inter, system-ui, sans-serif;
        background: radial-gradient(circle at top, rgba(255, 130, 60, calc(var(--tier-intensity) * 0.9)), var(--bg));
        color: var(--text);
        min-height: 100vh;
        overflow-x: hidden;
        position: relative;
      }

      .theme-backdrop {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
      }

      .smoke-layer,
      .flame-layer,
      .embers-layer,
      .heat-haze {
        position: absolute;
        inset: 0;
      }

      .smoke-layer {
        background:
          radial-gradient(42% 34% at 22% 100%, rgba(156, 156, 156, 0.65), transparent 76%),
          radial-gradient(38% 30% at 70% 98%, rgba(124, 124, 124, 0.58), transparent 78%),
          radial-gradient(48% 36% at 50% 102%, rgba(166, 166, 166, 0.42), transparent 80%);
        filter: blur(28px) saturate(0.8);
        opacity: var(--smoke-opacity);
        transform: translateY(0);
        animation: smokeRise calc(18s / var(--motion-scale)) ease-in-out infinite;
      }

      .flame-layer {
        inset: auto -12% -22% -12%;
        height: 72%;
        background:
          radial-gradient(40% 80% at 20% 100%, rgba(255, 138, 51, 0.56), transparent 70%),
          radial-gradient(42% 84% at 54% 100%, rgba(255, 93, 15, 0.52), transparent 72%),
          radial-gradient(36% 76% at 84% 100%, rgba(255, 177, 78, 0.45), transparent 73%);
        filter: blur(8px) saturate(1.15);
        mix-blend-mode: screen;
        opacity: var(--fire-opacity);
        transform-origin: bottom center;
        animation:
          flameWave calc(7s / var(--motion-scale)) ease-in-out infinite,
          flameFlicker calc(2.4s / var(--motion-scale)) linear infinite;
      }

      .embers-layer {
        background-image:
          radial-gradient(circle at 8% 92%, rgba(255, 185, 90, 0.72) 0 1px, transparent 2px),
          radial-gradient(circle at 18% 98%, rgba(255, 122, 34, 0.62) 0 1px, transparent 2px),
          radial-gradient(circle at 32% 94%, rgba(255, 165, 73, 0.7) 0 1px, transparent 2px),
          radial-gradient(circle at 46% 96%, rgba(255, 140, 42, 0.66) 0 1px, transparent 2px),
          radial-gradient(circle at 61% 93%, rgba(255, 188, 96, 0.72) 0 1px, transparent 2px),
          radial-gradient(circle at 73% 97%, rgba(255, 128, 38, 0.62) 0 1px, transparent 2px),
          radial-gradient(circle at 88% 95%, rgba(255, 169, 77, 0.68) 0 1px, transparent 2px);
        opacity: var(--ember-opacity);
        filter: blur(0.3px);
        animation: embersLift calc(12s / var(--motion-scale)) linear infinite;
      }

      .heat-haze {
        background: linear-gradient(
          180deg,
          rgba(255, 255, 255, 0.03),
          rgba(255, 140, 50, 0.05) 35%,
          rgba(255, 110, 30, 0.08) 60%,
          rgba(255, 255, 255, 0.02)
        );
        opacity: var(--haze-opacity);
        mix-blend-mode: screen;
        animation: hazeShift calc(10s / var(--motion-scale)) ease-in-out infinite;
      }

      .layout {
        max-width: 960px;
        margin: 0 auto;
        padding: 48px 24px 72px;
        position: relative;
        z-index: 1;
      }

      .card {
        background: var(--surface);
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 0 calc(20px + 6px * ${tier}) color-mix(in srgb, var(--primary) 72%, transparent);
        border-radius: 20px;
        padding: 32px;
        position: relative;
        overflow: hidden;
      }

      .card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(120deg, rgba(255, 179, 71, calc(var(--tier-intensity) * 0.25)), rgba(255, 106, 0, calc(var(--tier-intensity) * 0.32)));
        opacity: 0.65;
        pointer-events: none;
      }

      .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 12px;
        margin-bottom: 18px;
        position: relative;
        z-index: 1;
      }

      .brand-chip {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 6px 12px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(0, 0, 0, 0.18);
        font-size: 0.84rem;
        letter-spacing: 0.3px;
      }

      .tier-pill {
        display: inline-flex;
        align-items: center;
        padding: 6px 10px;
        border-radius: 999px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(0, 0, 0, 0.16);
        font-weight: 700;
        font-size: 0.82rem;
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

      .inferno-landing {
        position: relative;
        z-index: 1;
      }

      .inferno-photo-hero {
        position: relative;
        margin: -6px 0 22px;
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid rgba(255, 178, 112, 0.28);
        background: #120c0a;
      }

      .inferno-photo {
        display: block;
        width: 100%;
        height: min(64vh, 720px);
        object-fit: cover;
        object-position: center;
      }

      .inferno-photo-vignette {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(80% 56% at 50% 76%, rgba(255, 116, 34, 0.18), transparent 70%),
          linear-gradient(180deg, rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.36));
        pointer-events: none;
      }

      .latin-on-photo {
        position: absolute;
        left: 50%;
        top: 8%;
        transform: translateX(-50%);
        width: min(82%, 720px);
        color: rgba(233, 213, 192, 0.95);
        text-shadow:
          0 1px 0 rgba(18, 10, 8, 0.9),
          0 2px 2px rgba(0, 0, 0, 0.5),
          0 0 12px rgba(255, 138, 60, 0.2);
        animation: none;
      }

      .inferno-gate-scene {
        position: relative;
        margin: -6px 0 22px;
        height: 470px;
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid rgba(255, 180, 120, 0.24);
        background:
          radial-gradient(72% 58% at 50% 70%, rgba(255, 86, 24, 0.22), transparent 72%),
          linear-gradient(180deg, rgba(22, 11, 10, 0.93) 0%, rgba(15, 7, 6, 0.985) 100%);
        perspective: 1100px;
      }

      .volcanic-wall {
        position: absolute;
        top: -4%;
        width: 37%;
        height: 72%;
        background:
          radial-gradient(70% 88% at 50% 10%, rgba(104, 68, 54, 0.54), rgba(40, 22, 18, 0.9) 64%, rgba(12, 7, 6, 0.98));
        filter: blur(0.8px);
      }

      .wall-left {
        left: -8%;
        transform: rotate(-9deg);
      }

      .wall-right {
        right: -8%;
        transform: rotate(9deg);
      }

      .smoke-sheet {
        content: '';
        position: absolute;
        inset: auto -10% -16% -10%;
        height: 78%;
        background:
          radial-gradient(24% 34% at 20% 100%, rgba(172, 172, 172, 0.36), transparent 72%),
          radial-gradient(30% 34% at 54% 100%, rgba(148, 148, 148, 0.32), transparent 76%),
          radial-gradient(24% 32% at 86% 100%, rgba(176, 176, 176, 0.3), transparent 74%);
        filter: blur(18px);
        opacity: 0.36;
        animation: smokeRise calc(16s / var(--motion-scale)) ease-in-out infinite;
      }

      .smoke-back {
        opacity: 0.24;
        transform: translateY(24px);
      }

      .smoke-front {
        opacity: 0.38;
      }

      .lava-chasm {
        position: absolute;
        inset: auto -16% -24% -16%;
        height: 62%;
        border-radius: 52% 52% 0 0;
        background:
          linear-gradient(90deg, rgba(255, 78, 20, 0.88), rgba(255, 166, 56, 0.8), rgba(255, 52, 10, 0.88));
        background-size: 240% 100%;
        filter: saturate(1.25) blur(0.45px);
        animation: lavaFlow calc(6.8s / var(--motion-scale)) linear infinite;
      }

      .lava-chasm::before {
        content: '';
        position: absolute;
        inset: 8% 4% auto 4%;
        height: 44%;
        background: linear-gradient(90deg, rgba(255, 124, 34, 0.6), rgba(255, 176, 77, 0.68), rgba(255, 107, 27, 0.6));
        background-size: 260% 100%;
        filter: blur(2px);
        opacity: 0.7;
        animation: lavaFlow calc(4.4s / var(--motion-scale)) linear infinite reverse;
      }

      .lava-chasm-glow {
        position: absolute;
        inset: auto 14% 28% 14%;
        height: 20%;
        border-radius: 999px;
        background: radial-gradient(circle at center, rgba(255, 128, 36, 0.52), transparent 72%);
        filter: blur(12px);
        opacity: 0.78;
      }

      .foreground-rim {
        position: absolute;
        left: -6%;
        right: -6%;
        bottom: -22%;
        height: 30%;
        border-radius: 50% 50% 0 0;
        background:
          linear-gradient(180deg, rgba(45, 27, 22, 0.96), rgba(20, 12, 10, 0.98));
        box-shadow: inset 0 10px 14px rgba(255, 122, 36, 0.22);
        z-index: 7;
      }

      .bridge-rope {
        position: absolute;
        bottom: 39%;
        width: 40%;
        height: 10px;
        border-radius: 999px;
        background: linear-gradient(90deg, rgba(128, 84, 52, 0.84), rgba(84, 54, 33, 0.88));
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.28);
        transform-origin: center;
        z-index: 8;
      }

      .rope-left {
        left: 18%;
        transform: rotate(-6deg);
      }

      .rope-right {
        right: 18%;
        transform: rotate(6deg);
      }

      .bridge-planks {
        position: absolute;
        left: 16%;
        right: 16%;
        bottom: 28%;
        height: 84px;
        display: grid;
        grid-template-columns: repeat(11, minmax(0, 1fr));
        gap: 9px;
        transform: perspective(780px) rotateX(59deg) rotateZ(-1.6deg) translateZ(12px);
        z-index: 8;
      }

      .plank {
        display: block;
        height: 100%;
        border-radius: 4px;
        background: linear-gradient(180deg, rgba(74, 48, 36, 0.96), rgba(30, 20, 16, 0.98));
        border: 1px solid rgba(161, 109, 72, 0.34);
        box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.3), 0 10px 14px rgba(0, 0, 0, 0.32), 0 0 8px rgba(255, 124, 32, 0.08);
      }

      .plank:nth-child(3),
      .plank:nth-child(8) {
        transform: translateY(7px) rotate(1.6deg);
      }

      .plank:nth-child(5),
      .plank:nth-child(10) {
        transform: translateY(-4px) rotate(-1.2deg);
      }

      .gate-silhouette-wrap {
        position: absolute;
        left: 19%;
        right: 19%;
        bottom: 18%;
        height: 76%;
        z-index: 9;
      }

      .gate-silhouette {
        width: 100%;
        height: 100%;
        filter: drop-shadow(0 0 10px rgba(255, 128, 38, 0.24)) drop-shadow(0 22px 26px rgba(0, 0, 0, 0.45));
      }

      .latin-inscription {
        position: relative;
        margin: 0;
        font-size: 0.74rem;
        text-align: center;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: rgba(228, 170, 123, 0.92);
        text-shadow:
          0 1px 0 rgba(42, 18, 12, 0.84),
          0 2px 0 rgba(30, 14, 10, 0.74),
          0 0 8px rgba(255, 130, 56, 0.38);
        cursor: help;
        outline: none;
        position: absolute;
        left: 50%;
        top: 11%;
        transform: translateX(-50%);
        width: 84%;
        animation: inscriptionFlicker calc(5.2s / var(--motion-scale)) ease-in-out infinite;
        z-index: 11;
      }

      .latin-text {
        display: block;
      }

      .latin-translation {
        position: absolute;
        left: 50%;
        top: calc(100% + 10px);
        transform: translate(-50%, 6px);
        white-space: nowrap;
        font-size: 0.68rem;
        letter-spacing: 0.03em;
        text-transform: none;
        padding: 6px 8px;
        border-radius: 8px;
        background: rgba(18, 10, 8, 0.96);
        border: 1px solid rgba(255, 172, 104, 0.35);
        color: rgba(246, 219, 192, 0.96);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.22s ease, transform 0.22s ease;
      }

      .latin-inscription:hover .latin-translation,
      .latin-inscription:focus .latin-translation,
      .latin-inscription:focus-visible .latin-translation {
        opacity: 1;
        transform: translate(-50%, 0);
      }

      .gate-rim-glow {
        position: absolute;
        inset: auto 8% 12% 8%;
        height: 22%;
        border-radius: 999px;
        background: radial-gradient(circle at center, rgba(255, 136, 44, 0.52), transparent 72%);
        filter: blur(10px);
        opacity: 0.78;
        z-index: 10;
      }

      .gate-flame-crown {
        position: absolute;
        inset: auto 10% 12% 10%;
        height: 28%;
        background:
          radial-gradient(30% 88% at 16% 100%, rgba(255, 146, 58, 0.6), transparent 72%),
          radial-gradient(32% 90% at 50% 100%, rgba(255, 112, 30, 0.62), transparent 74%),
          radial-gradient(30% 86% at 84% 100%, rgba(255, 168, 78, 0.56), transparent 72%);
        opacity: 0.7;
        filter: blur(5px);
        animation:
          flameWave calc(5.6s / var(--motion-scale)) ease-in-out infinite,
          flameFlicker calc(2.1s / var(--motion-scale)) linear infinite;
        z-index: 10;
      }

      .heat-shimmer {
        position: absolute;
        inset: 8% 16% 16% 16%;
        background:
          linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 150, 64, 0.08) 38%, rgba(255, 98, 34, 0.06));
        mix-blend-mode: screen;
        opacity: 0.18;
        filter: blur(2px);
        animation: shimmerWarp calc(4.8s / var(--motion-scale)) ease-in-out infinite;
        z-index: 12;
      }

      .veil-b {
        inset: 12% 19% 18% 19%;
        opacity: 0.12;
        animation-duration: calc(6.4s / var(--motion-scale));
        animation-direction: reverse;
      }

      .ember-field {
        position: absolute;
        inset: 12% 10% 8% 10%;
        background-image:
          radial-gradient(circle at 8% 92%, rgba(255, 192, 102, 0.72) 0 1px, transparent 2px),
          radial-gradient(circle at 18% 96%, rgba(255, 124, 34, 0.62) 0 1px, transparent 2px),
          radial-gradient(circle at 33% 94%, rgba(255, 180, 84, 0.66) 0 1px, transparent 2px),
          radial-gradient(circle at 47% 97%, rgba(255, 138, 44, 0.64) 0 1px, transparent 2px),
          radial-gradient(circle at 62% 93%, rgba(255, 190, 98, 0.72) 0 1px, transparent 2px),
          radial-gradient(circle at 74% 95%, rgba(255, 132, 42, 0.62) 0 1px, transparent 2px),
          radial-gradient(circle at 90% 96%, rgba(255, 178, 88, 0.68) 0 1px, transparent 2px);
        opacity: 0.52;
        animation: embersLift calc(9.4s / var(--motion-scale)) linear infinite;
        z-index: 12;
      }

      @media (max-width: 900px) {
        .inferno-photo {
          height: min(52vh, 520px);
        }

        .latin-on-photo {
          top: 6%;
          width: 88%;
          font-size: 0.64rem;
          letter-spacing: 0.05em;
        }

        .inferno-gate-scene {
          height: 390px;
        }

        .gate-silhouette-wrap {
          left: 10%;
          right: 10%;
          bottom: 17%;
          height: 74%;
        }

        .bridge-planks {
          left: 10%;
          right: 10%;
          height: 70px;
        }

        .latin-inscription {
          font-size: 0.66rem;
          letter-spacing: 0.06em;
        }
      }

      .inferno-cta {
        position: relative;
        border-color: rgba(255, 179, 92, 0.86);
        background: linear-gradient(180deg, rgba(98, 54, 34, 0.72), rgba(42, 24, 17, 0.86));
        box-shadow:
          0 0 12px rgba(255, 114, 34, 0.36),
          inset 0 0 10px rgba(255, 178, 98, 0.16);
        overflow: hidden;
      }

      .inferno-cta::before {
        content: '';
        position: absolute;
        inset: -2px;
        background: linear-gradient(110deg, transparent 20%, rgba(255, 188, 102, 0.26) 48%, transparent 72%);
        background-size: 220% 100%;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      .inferno-cta:hover::before {
        opacity: 1;
        animation: moltenSweep 1.2s linear infinite;
      }

      .inferno-cta:hover {
        box-shadow:
          0 0 20px rgba(255, 126, 40, 0.5),
          inset 0 0 14px rgba(255, 201, 120, 0.2);
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
        background: radial-gradient(circle, color-mix(in srgb, var(--secondary) 68%, transparent), transparent 70%);
        filter: blur(2px);
        animation: float calc(8s / var(--motion-scale)) ease-in-out infinite;
        top: -40px;
        right: -60px;
        opacity: calc(0.28 + var(--tier-intensity) * 0.38);
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
        opacity: calc(0.12 + var(--tier-intensity) * 0.16);
        pointer-events: none;
        animation: drift calc(6s / var(--motion-scale)) linear infinite;
      }

      .watermark {
        position: fixed;
        right: 16px;
        bottom: 10px;
        font-size: 0.72rem;
        letter-spacing: 0.4px;
        opacity: 0.2;
        pointer-events: none;
        user-select: none;
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

      @keyframes smokeRise {
        0% { transform: translateY(14px) scale(1); }
        50% { transform: translateY(-12px) scale(1.04); }
        100% { transform: translateY(14px) scale(1); }
      }

      @keyframes flameWave {
        0% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-10px) scale(1.05, 1.08); }
        100% { transform: translateY(0) scale(1); }
      }

      @keyframes flameFlicker {
        0%, 100% { opacity: calc(var(--fire-opacity) * 0.92); }
        25% { opacity: calc(var(--fire-opacity) * 1.05); }
        50% { opacity: calc(var(--fire-opacity) * 0.86); }
        75% { opacity: calc(var(--fire-opacity) * 1.08); }
      }

      @keyframes embersLift {
        0% { transform: translateY(16px); }
        100% { transform: translateY(-44px); }
      }

      @keyframes hazeShift {
        0% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
        100% { transform: translateY(0); }
      }

      @keyframes lavaFlow {
        0% { background-position: 0% 0%; }
        100% { background-position: 200% 0%; }
      }

      @keyframes lavaSparkle {
        0%, 100% { opacity: 0.62; }
        50% { opacity: 0.88; }
      }

      @keyframes shimmerWarp {
        0% { transform: translateY(0) skewX(0deg); }
        50% { transform: translateY(-5px) skewX(-1.5deg); }
        100% { transform: translateY(0) skewX(0deg); }
      }

      @keyframes inscriptionFlicker {
        0%, 100% { opacity: 0.9; }
        22% { opacity: 0.86; }
        41% { opacity: 0.96; }
        63% { opacity: 0.88; }
        82% { opacity: 0.95; }
      }

      @keyframes moltenSweep {
        0% { background-position: 210% 0; }
        100% { background-position: -20% 0; }
      }

      @media (prefers-reduced-motion: reduce) {
        .ambient-orb,
        .scanline,
        .smoke-layer,
        .flame-layer,
        .embers-layer,
        .heat-haze,
        .smoke-sheet,
        .lava-chasm,
        .lava-chasm::before,
        .gate-flame-crown,
        .ember-field,
        .heat-shimmer,
        .latin-inscription {
          animation: none !important;
        }
      }
    </style>
  </head>
  <body>
    ${minimalEffects ? '' : '<div class="theme-backdrop" aria-hidden="true"><div class="smoke-layer"></div><div class="flame-layer"></div><div class="embers-layer"></div><div class="heat-haze"></div></div>'}
    <div class="layout">
      ${minimalEffects ? '' : '<div class="ambient-orb"></div>'}
      <div class="card">
        ${minimalEffects ? '' : '<div class="scanline"></div>'}
        <div class="topbar">
          ${brandLabel ? `<div class="brand-chip">${escapeHtml(brandLabel)}</div>` : '<div></div>'}
          <div class="tier-pill">Level ${tier} / 9</div>
        </div>
        ${body}
      </div>
    </div>
    ${watermarkLabel ? `<div class="watermark">${escapeHtml(watermarkLabel)}</div>` : ''}
  </body>
</html>`;
};
