# Preloader Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a full-screen loading screen (preloader) with an animated owl logo, progress ring, breathing animation, and smooth fade-out on page load for a React + Vite project.

**Architecture:** React component mounted at root level in App.tsx before all content. Uses CSS custom properties from existing design system. Vanilla CSS animations with `transform`/`opacity` for performance. Listens to `window.onload` for fade-out trigger. Respects `prefers-reduced-motion`.

**Tech Stack:** React 18, Vite, CSS custom properties (existing design system), vanilla CSS animations.

**Spec:** User requirements above.

## Global Constraints

- Use exact CSS variables from existing design system (`--bg`, `--accent`, `--accent-3`, `--text`, `--font-display`, etc.)
- Logo path: `/assets/Logo blanco VERTICAL.png` (1081x1081, square)
- Fade-out duration: 600-800ms
- Z-index: highest on page (use 9999 or CSS variable)
- Performance: only animate `transform` and `opacity`
- `prefers-reduced-motion: reduce` → static version
- Component must be reusable and self-contained

---

### Task 1: Create Preloader React Component

**Files:**
- Create: `src/components/Preloader/Preloader.tsx`
- Create: `src/components/Preloader/Preloader.css`

**Interfaces:**
- Consumes: CSS variables from `:root` (already defined in `index.css`)
- Produces: `<Preloader />` component that mounts at root level

- [ ] **Step 1: Create Preloader.tsx with component structure**

```tsx
import "./Preloader.css";

interface PreloaderProps {
  /** Called when fade-out animation completes */
  onComplete?: () => void;
}

/**
 * Full-screen preloader with animated owl logo, progress ring, and loading text.
 * Fades out on window.onload or when parent calls onComplete.
 */
export function Preloader({ onComplete }: PreloaderProps) {
  // Implementation goes here
}
```

- [ ] **Step 2: Create Preloader.css with all animations**

```css
/* ============================================================
   PRELOADER
   ============================================================ */

.preloader {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: var(--bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
  opacity: 1;
  transition: opacity 700ms var(--ease), transform 700ms var(--ease);
  pointer-events: none;
}

.preloader--hidden {
  opacity: 0;
  transform: scale(1.02);
  pointer-events: none;
}

/* Logo with breathing animation */
.preloader__logo {
  width: clamp(120px, 22vw, 200px);
  height: auto;
  animation: breathe 3s var(--ease) infinite;
  filter: drop-shadow(0 0 24px rgba(var(--c-accent), 0.35))
          drop-shadow(0 0 48px rgba(var(--c-accent), 0.15));
}

/* Progress ring around logo */
.preloader__ring-wrapper {
  position: relative;
  width: clamp(160px, 28vw, 260px);
  height: clamp(160px, 28vw, 260px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.preloader__ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 3px solid transparent;
  border-top-color: var(--accent);
  border-right-color: var(--accent-3);
  animation: spin 1.6s linear infinite;
  filter: drop-shadow(0 0 12px rgba(var(--c-accent), 0.5));
}

.preloader__ring::before {
  content: "";
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  background: conic-gradient(
    from 0deg,
    transparent 0%,
    var(--accent) 25%,
    var(--accent-3) 50%,
    var(--accent) 75%,
    transparent 100%
  );
  mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #fff calc(100% - 3px));
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #fff calc(100% - 3px));
  animation: spin 2.4s var(--ease) infinite reverse;
  opacity: 0.6;
}

/* Loading text with animated ellipsis */
.preloader__text {
  font-family: var(--font-display);
  font-size: clamp(0.95rem, 1.8vw, 1.15rem);
  letter-spacing: var(--display-ls);
  color: var(--text);
  font-weight: 400;
  text-align: center;
  animation: ellipsis 1.8s steps(3) infinite;
}

.preloader__text::after {
  content: "";
  display: inline-block;
  width: 1.2em;
  text-align: left;
}

/* Ambient glow behind logo */
.preloader__glow {
  position: absolute;
  width: clamp(200px, 35vw, 320px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(var(--c-accent), 0.18) 0%,
    rgba(var(--c-accent), 0.06) 40%,
    transparent 70%
  );
  filter: blur(40px);
  pointer-events: none;
  animation: pulse-glow 4s var(--ease) infinite;
}

/* Keyframes */
@keyframes breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.03); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}

@keyframes ellipsis {
  0%   { content: "Cargando"; }
  33%  { content: "Cargando."; }
  66%  { content: "Cargando.."; }
  100% { content: "Cargando..."; }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .preloader__logo,
  .preloader__ring,
  .preloader__ring::before,
  .preloader__glow,
  .preloader__text {
    animation: none !important;
  }
  .preloader__logo { transform: scale(1); }
  .preloader__ring { border-top-color: var(--accent); border-right-color: var(--accent-3); }
  .preloader__text::after { content: "..."; }
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .preloader { gap: 20px; }
  .preloader__logo { width: clamp(100px, 28vw, 160px); }
  .preloader__ring-wrapper { width: clamp(140px, 32vw, 220px); height: clamp(140px, 32vw, 220px); }
}
```

- [ ] **Step 3: Implement Preloader.tsx with window.onload logic**

```tsx
import { useEffect, useState } from "react";
import "./Preloader.css";

interface PreloaderProps {
  onComplete?: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [shouldFadeOut, setShouldFadeOut] = useState(false);

  useEffect(() => {
    const handleLoad = () => {
      // Small delay so user sees the animation at least briefly
      const timer = setTimeout(() => {
        setShouldFadeOut(true);
        onComplete?.();
      }, 400);
      return () => clearTimeout(timer);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, [onComplete]);

  return (
    <div
      className={`preloader ${shouldFadeOut ? "preloader--hidden" : ""}`}
      role="status"
      aria-label="Cargando página"
      aria-busy={!shouldFadeOut}
    >
      <div className="preloader__glow" aria-hidden="true" />
      <div className="preloader__ring-wrapper" aria-hidden="true">
        <div className="preloader__ring" aria-hidden="true" />
      </div>
      <img
        className="preloader__logo"
        src="/assets/Logo blanco VERTICAL.png"
        alt=""
        aria-hidden="true"
        width="1081"
        height="1081"
      />
      <p className="preloader__text" aria-live="polite">
        Cargando
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Run type-check to verify no TS errors**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/Preloader/
git commit -m "feat: add Preloader component with animated owl logo and progress ring"
```

---

### Task 2: Integrate Preloader into App.tsx

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `Preloader` component from Task 1
- Produces: Preloader wrapping the app content, conditionally removed after load

- [ ] **Step 1: Import Preloader and add state**

```tsx
import { Preloader } from "./components/Preloader/Preloader";
// ... existing imports
```

- [ ] **Step 2: Add loading state and render Preloader at root level**

```tsx
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const route = useHashRoute();

  // ... existing handlers

  return (
    <>
      <Preloader onComplete={() => setIsLoading(false)} />
      {isLoading ? null : (
        <>
          <a className="skip" href="#main">Saltar al contenido</a>
          <Ambient />
          <Nav />
          <main>...</main>
          <Footer />
          <Fab />
        </>
      )}
    </>
  );
}
```

- [ ] **Step 3: Run type-check**

Run: `npx tsc --noEmit`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: integrate Preloader at app root with fade-out on load"
```

---

### Task 3: Verify and Polish

**Files:**
- Test: Manual browser test
- Test: Check reduced motion

- [ ] **Step 1: Start dev server and verify preloader shows, animates, and fades out**

Run: `npm run dev`
Expected: Preloader visible on fresh load, owl breathes, ring spins, text animates, then smooth fade-out revealing content.

- [ ] **Step 2: Test reduced motion**

Open DevTools → Rendering → Emulate prefers-reduced-motion: reduce → reload
Expected: Static logo, static ring, "Cargando..." text, instant fade-out.

- [ ] **Step 3: Test mobile viewport**

DevTools device toolbar → iPhone/Android
Expected: Logo and ring scale properly, text readable, centered.

- [ ] **Step 4: Verify no layout shift or flash of content**

Reload multiple times
Expected: Preloader covers everything from first paint, no content leaks through.

- [ ] **Step 5: Commit final polish if needed**

```bash
git add -A
git commit -m "chore: polish preloader timing and responsive behavior"
```

---

## Summary

| Task | Files | Deliverable |
|------|-------|-------------|
| 1 | `src/components/Preloader/Preloader.tsx`, `src/components/Preloader/Preloader.css` | Reusable preloader component with all animations |
| 2 | `src/App.tsx` | Preloader integrated at root with load detection |
| 3 | — | Verified working on desktop, mobile, reduced motion |

Total estimated time: ~30 minutes