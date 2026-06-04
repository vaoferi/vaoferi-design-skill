# Project Log

## 2026-06-04
- Завдання: захистити `vaoferi-design-skill` від CSS-хаосу та розсипаного operational UI.
- Знайдено: у `SKILL.md` уже були правила про grid, tokens і visual QA, але не було жорсткої вимоги трасувати існуючий CSS перед новою правкою, а також не було явної заборони `!important`.
- Змінено: додано `CSS Guardrails`, посилено trigger description для operational UI/admin forms, оновлено `README.md` і `rubric.md`, створено позитивний і негативний приклади.
- Перевірка: переглянуто diff, звірено markdown-структуру, додано приклади та журнал змін.
- Ризики: це документаційне посилення, тому live browser QA ще не виконувалась; наступні UI-правки мають пройти preview/DevTools перевірку.
