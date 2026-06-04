# Good Answer

Prompt:
"Ось реальний скрін форми редагування кампанії. Зроби так, щоб інтерфейс перестав розвалюватися."

Good response:

1. Спочатку перевірю `DESIGN.md`, tokens і primitive library, якщо вони є.
2. Якщо дизайн-контракту немає, запропоную мінімальний `DESIGN.md` і перші примітиви: `Button`, `TextField`, `Card`, `Grid`, `Container`, стани.
3. Знайду, який компонент, селектор і токен керують кожним полем на цій сторінці.
4. Перевірю існуючий CSS, перш ніж писати новий.
5. Якщо проблема вирішується через наявний стиль, зміню лише його або додам мінімальний варіант.
6. Використаю flat, traceable class naming, щоб ownership стилів був очевидний.
7. `!important` не використаю.
8. Якщо джерело стилю неочевидне, спершу трасую його до правила, а не приклею новий клас поверх.
9. Якщо компоненту треба адаптуватися в іншому контейнері, використаю `@container`, а не хаки на весь viewport.
10. Перевірю результат на desktop, tablet і mobile та покажу visual QA.

Expected behavior:

- root cause first;
- DESIGN.md / primitives before page-specific CSS;
- reuse existing CSS;
- keep class ownership obvious;
- no new visual language;
- no one-off hacks.
