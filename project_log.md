# Project Log

## 2026-06-03
- NotebookLM CLI недоступний через локальну помилку середовища Python: `AssertionError: SRE module mismatch`.
  - Дія: повторних запитів CLI не робив.
  - Результат: продовжив роботу іншими засобами.
- Оновив секцію `NotebookLM Integration` в `SKILL.md`:
  - обмежив перелік дозволених запитів;
  - додав формалізований лог-формат для NotebookLM;
  - зафіксував правило: не перезапускати однаковий failing CLI-виклик у цикл.
- Розширив `Default UI Component Library` у `SKILL.md`:
  - додано відсутні, але стандартні компоненти: `radio`, `combobox`, `tabs`, `accordion`, `breadcrumb`, `tooltip`, `dropdown`, `step / progress indicator`, `carousel / slider`.
  - Це зменшує ризик вигадування нових компонентів “з повітря” під час лейаутів.
- Статус: локальні зміни готові до коміту і пушу.
