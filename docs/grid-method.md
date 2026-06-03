# Grid Method

Use this as a short operational guide for building layouts with structure first.

## Still use this before decoration

1. Define the layout goal and user action.
2. Set the macro grid.
3. Draw alignment lines.
4. Place major regions first.
5. Add components and tokens.
6. Finish with visual QA.

## Macro grid

- Start mobile-first with `1fr`.
- At `min-width: 701px`, switch to a canonical composition.
- Desktop default: `1.618fr 1fr` for main content and sidebar.
- Centered layout should use a global max-width container.
- Use `grid` for the page structure; use `flex` inside components.

## Rhythm and spacing

- Use Fibonacci spacing for gaps and section rhythm: `5, 8, 13, 21`.
- Treat grid gap as track spacing.
- Avoid compensating broken rhythm with child margin hacks.

## Responsive behavior

- Breakpoints should change structure, not only sizes.
- Use `minmax(min, max)` for flexible tracks.
- Keep the layout readable from mobile to desktop.
- Prevent accidental horizontal scroll.

## Visual QA

- Check alignment, spacing, hierarchy, and media.
- Check at least `320px`, `375px`, `768px`, `1024px`, and `1440px`.
- Do not mark layout Done before visual confirmation.
