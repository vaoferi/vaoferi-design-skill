# Project Log

## 2026-06-03

- Опис: Кураторський цикл по `vaoferi-design-skill`.
- Дія: прочитано `SKILL.md`; виправлено прогалину в розділі **Golden Canon Anti-patterns** — додано блок **What to do instead** з konkретними альтернативами замість лише списку проблем.
- Мета: зменшити нечіткість і дати агенту explicit fix-direction, а не тільки перелік forbidden patterns.
- Деталі: `SKILL.md` оновлено; `README.md` перевірено, актуальний; `rubric.md` перевірено, актуальний.
- Ризик: низький; зміна локальна, не ламає існуючі правила.
- Нотатка: `notebooklm query` недоступний в цьому циклі через помилку автентифікації, тому оновлення базуються на внутрішньому аналізі файлів.

## 2026-05-30

- Опис: Початковий запис логу.
  - Результат: продовжив роботу іншими засобами.
- Оновив секцію `NotebookLM Integration` в `SKILL.md`:
  - обмежив перелік дозволених запитів;
  - додав формалізований лог-формат для NotebookLM;
  - зафіксував правило: не перезапускати однаковий failing CLI-виклик у цикл.
- Розширив `Default UI Component Library` у `SKILL.md`:
  - додано відсутні, але стандартні компоненти: `radio`, `combobox`, `tabs`, `accordion`, `breadcrumb`, `tooltip`, `dropdown`, `step / progress indicator`, `carousel / slider`.
  - Це зменшує ризик вигадування нових компонентів “з повітря” під час лейаутів.
- Статус: локальні зміни готові до коміту і пушу.
# 2026-06-03

- Тема: make the skill interface explicit for auto-activation, step-by-step instructions, and deterministic tools.
- Змінено:
  - added a dedicated `Skill interface` section to `SKILL.md` with `Опис`, `Інструкції`, and `Інструменти`;
  - clarified that `Bash`, `Python`, `Node.js`, API calls, and reference files are the preferred deterministic layer;
  - kept the existing Golden Canon / grid guidance intact.
- Перевірка:
  - confirmed the new headings are present in `SKILL.md`.

## 2026-06-03

- Тема: audio-to-skill enrichment for Golden Canon / CSS Grid guidance.
- Знайдено: 3 long-form audio files in `assets/audio` covering myths of rigid golden-ratio grids, modern CSS Grid, and why macro proportions must remain flexible.
- Змінено:
  - transcribed all 3 `.m4a` files into `assets/audio/_transcripts/`;
  - added an `Audio-derived principles` section to `SKILL.md`;
  - added a concise explanation block to `README.md`.
- Застосовані ідеї:
  - Golden Canon as a macro guide, not a strict pixel formula;
  - use `grid` for page structure and `flex` for component internals;
  - prefer `subgrid` for inheritance of alignment lines;
  - prefer `repeat(auto-fit, minmax(...))` for fluid card layouts;
  - use `clamp()` for safe responsive type/spacing;
  - prefer `gap` over margin hacks;
  - distinguish `justify-content` from `justify-items`;
  - avoid global 16-column complexity when local nested grids are enough;
  - protect accessibility and browser performance.
- Verification:
  - audio duration checked with `ffprobe`;
  - transcription ran successfully for all 3 files;
  - updated `SKILL.md` and `README.md` in the repo.
