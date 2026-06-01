# vaoferi-design-skill

AI design skill for building responsive visual interfaces through structure, reusable components, design tokens, Golden Canon-inspired grids, and strict visual QA.

## Purpose

`vaoferi-design-skill` teaches AI agents to design systematically.

The agent must not start from decoration, random templates, or “looks nice” decisions.

The correct order is:

1. Structure.
2. Grid.
3. Alignment.
4. Components.
5. Tokens.
6. Visual style.
7. Responsive verification.

## Core Idea

Design must start with structure, not decoration.

Before creating a final layout, the AI agent must:

- define the content hierarchy;
- build a flexible layout grid;
- draw alignment lines;
- place elements intentionally;
- reuse existing project components;
- use approved design tokens;
- ask before adding new components or colors;
- visually verify the result on different screen sizes.

## Main Principles

### 1. Grid First

Every serious layout starts with a grid.

The grid may be inspired by:

- Golden Ratio;
- Golden Canon Grid;
- modular grids;
- responsive layout systems;
- visual rhythm principles.

The agent must use the grid to control:

- alignment;
- spacing;
- hierarchy;
- balance;
- rhythm;
- responsive behavior.

### 2. Component Library First

The agent must check the project component library before creating anything new.

Reusable elements include:

- buttons;
- cards;
- headings;
- arrows;
- icons;
- forms;
- navigation items;
- sections;
- spacing rules;
- typography styles;
- color tokens.

If a new element is needed, it must be approved by the user.

### 3. Tokens Before Styling

Colors, fonts, spacing, shadows, radius, borders, and sizes must come from design tokens.

The agent should not invent random values.

If a token is missing, the agent must propose it and ask for approval before adding it.

### 4. Responsive by Design

The layout must remain stable and visually balanced across screen sizes.

The agent must check that elements do not:

- drift;
- stretch;
- overlap;
- break;
- lose hierarchy;
- create accidental horizontal scroll.

### 5. Visual QA Is Required

A design task is not Done until the result is visually checked.

The agent must confirm the design in a browser, preview, screenshot, Figma-like view, or other visual environment when available.

If visual QA is not possible, the limitation must be stated clearly.

## Definition of Done

A design task is Done only when:

- the grid is defined;
- alignment lines are used;
- hierarchy is clear;
- components are reused;
- tokens are respected;
- new components are approved;
- colors are approved;
- spacing is consistent;
- text is readable;
- photos are not distorted;
- logos are not hidden or stretched;
- responsive behavior is checked;
- visual QA is complete;
- risks and limitations are stated clearly.

## SkillOpt Compatibility

This repository is intended to work with Microsoft SkillOpt.

`SKILL.md` is the human-written seed skill.

If SkillOpt optimization is used, the optimized artifact should be saved as:

```text
best_skill.md
```

Do not automatically replace `SKILL.md` with `best_skill.md`.

Before accepting an optimized version, verify that it did not remove or weaken the core rules:

- grid first;
- alignment lines;
- Golden Canon-inspired structure;
- component reuse;
- token discipline;
- approval before new components;
- approval before new colors;
- responsive visual QA;
- no random decoration-first design;
- no distorted photos or logos;
- no Done without visual verification.

## Repository Entry Point

The main skill file is:

```text
SKILL.md
```

## Expected Repository Structure

Minimum structure:

```text
AGENTS.md
README.md
SKILL.md
rubric.md
examples/
```

Optional future structure:

```text
best_skill.md
docs/grid-method.md
docs/component-library.md
docs/design-tokens.md
docs/visual-qa.md
examples/good-answer.md
examples/bad-answer.md
```

## Short Summary

```text
Design starts with structure, not decoration.
```
