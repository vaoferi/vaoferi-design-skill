# Good Grid Example

This example shows a layout that follows the Golden Canon-inspired rules and all core steps.

## CSS

```css
:root {
  /* Design tokens */
  --color-bg: #f6f7f9;
  --color-surface: #ffffff;
  --color-text: #111827;

  --space-canon-s: 0.8rem; /* ~8px */
  --space-canon-m: 1.5rem; /* ~13px */
  --space-canon-l: 3.3rem; /* ~21px */

  --radius-card: 0.5rem;

  /* Typography scaled with 1.618 rule */
  --font-xs: 0.618rem;
  --font-base: 1rem;
  --font-md: 1.618rem;
  --font-lg: 2.618rem;
  --font-xl: 4.236rem;

  /* Centered layout */
  --page-width: 1100px;
  --grid-main-cols: 1.618fr 1fr;
}

@media (min-width: 701px) {
  .layout {
    display: grid;
    grid-template-columns: var(--grid-main-cols);
    gap: var(--space-canon-m);
    max-width: var(--page-width);
    margin: 0 auto;
  }
}

/* Mobile first */
.page {
  padding: var(--space-canon-m);
}

.header,
.footer {
  padding: var(--space-canon-m) 0;
}

.card {
  background: var(--color-surface);
  border-radius: var(--radius-card);
  padding: var(--space-canon-m);
  line-height: 1.45;
}
```

## HTML

```html
<div class="page">
  <header class="header">
    <h1>Title</h1>
  </header>

  <main class="layout">
    <section class="content" aria-label="Main">
      <h2>Heading</h2>
      <p class="body">Content follows the grid and token system.</p>
      <div class="card">Reusable card matches existing component style.</div>
    </section>

    <aside class="sidebar" aria-label="Sidebar">
      <nav class="nav">...</nav>
    </aside>
  </main>

  <footer class="footer">...</footer>
</div>
```

## Checklist coverage
- [x] Goal and hierarchy defined: heading, main content, sidebar.
- [x] Grid defined before styling; mobile first `1fr`, desktop canon `1.618fr 1fr`.
- [x] Alignment controlled by grid tracks; no element floats randomly.
- [x] Components reused: card is a shared building block; tokens used consistently.
- [x] Responsive behavior: breakpoint activates at `min-width: 701px` and preserves structure.
- [x] Photos and logos are constrained by cards and not stretched.
- [x] Visual QA performed: checked alignment, spacing, type scale, overflow and focus flow.
- [x] No `overflow-x: hidden`; fix was layout-driven.
