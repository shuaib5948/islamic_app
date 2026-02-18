/**
 * Web-specific global styles injected once when the app loads on web.
 * This ensures proper mobile web behavior (no bounce scroll, proper touch, etc.)
 */
import { Platform } from 'react-native';

let injected = false;

export function injectWebStyles() {
  if (Platform.OS !== 'web' || injected) return;
  if (typeof document === 'undefined') return;
  
  injected = true;

  const style = document.createElement('style');
  style.textContent = `
    /* === Reset & Base === */
    *, *::before, *::after {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }
    
    html, body, #root, #main {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
      -webkit-overflow-scrolling: touch;
    }

    /* === Mobile web optimizations === */
    body {
      /* Prevent text selection on touch */
      -webkit-user-select: none;
      user-select: none;
      /* Smooth font rendering */
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      /* Prevent pull-to-refresh on mobile Chrome */
      overscroll-behavior-y: contain;
    }

    /* Allow text selection in inputs/textareas */
    input, textarea {
      -webkit-user-select: auto;
      user-select: auto;
    }

    /* === Scrollbar styling === */
    ::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.15);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: rgba(0, 0, 0, 0.25);
    }

    /* Dark mode scrollbar */
    @media (prefers-color-scheme: dark) {
      ::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.15);
      }
      ::-webkit-scrollbar-thumb:hover {
        background: rgba(255, 255, 255, 0.25);
      }
    }

    /* === Touch & interaction === */
    [role="button"], button, a {
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    /* === Responsive text === */
    @media (max-width: 360px) {
      html { font-size: 14px; }
    }
    @media (min-width: 361px) and (max-width: 480px) {
      html { font-size: 15px; }
    }
    @media (min-width: 481px) {
      html { font-size: 16px; }
    }

    /* === PWA / Fullscreen appearance === */
    @media (display-mode: standalone) {
      body {
        /* Safe area handled by React Native SafeAreaView - only set top for status bar */
        padding-top: env(safe-area-inset-top);
        padding-bottom: 0;
        padding-left: env(safe-area-inset-left);
        padding-right: env(safe-area-inset-right);
      }
    }

    /* === Prevent iOS bounce === */
    html {
      position: fixed;
      width: 100%;
      height: 100%;
    }

    /* === Modal backdrop blur === */
    .modal-backdrop {
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
    }

    /* === Smooth transitions for interactive elements === */
    [data-focusable="true"] {
      transition: transform 0.15s ease, opacity 0.15s ease;
    }
    [data-focusable="true"]:active {
      transform: scale(0.97);
    }

    /* === Safe area support (browser mode) === */
    @supports (padding: env(safe-area-inset-top)) {
      body {
        padding-top: env(safe-area-inset-top);
        /* Bottom safe area handled by React Native tab bar */
        padding-bottom: 0;
      }
    }
  `;
  document.head.appendChild(style);
}
