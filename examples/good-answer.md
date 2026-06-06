# Good Answer

Prompt:
"Ось реальний скрін форми редагування кампанії. Зроби так, щоб інтерфейс перестав розвалюватися."

Good response:

1. Спочатку перевірю `DESIGN.md`, tokens і primitive library, якщо вони є.
2. Якщо дизайн-контракту немає, запропоную мінімальний `DESIGN.md` і перші примітиви: `Button`, `TextField`, `Card`, `Grid`, `Container`, стани.
3. Перевірю чинні spacing tokens. Якщо вони є, збережу їх. Якщо це нова система, запропоную вибір `4x` або `Fibonacci` і зафіксую approved mode в `DESIGN.md`.
4. Знайду, який компонент, селектор і токен керують кожним полем на цій сторінці.
5. Перевірю існуючий CSS, перш ніж писати новий.
6. Якщо проблема вирішується через наявний стиль, зміню лише його або додам мінімальний варіант.
7. Використаю flat, traceable class naming, щоб ownership стилів був очевидний.
8. `!important` не використаю.
9. Якщо джерело стилю неочевидне, спершу трасую його до правила, а не приклею новий клас поверх.
10. Якщо компоненту треба адаптуватися в іншому контейнері, використаю `@container`, а не хаки на весь viewport.
11. Почну з mobile-first бази на вузькому екрані, перевірю `box-sizing`, `rem` і зрозумілий touch target для ключових дій.
12. Пройду всі 20 принципів із `Pass / Fail / N/A` та доказами. Жоден не пропущу.
13. Перевірю результат на desktop, tablet і mobile та покажу visual QA.

Expected behavior:

- root cause first;
- DESIGN.md / primitives before page-specific CSS;
- preserve existing spacing or explicitly choose `4x` / `Fibonacci`;
- reuse existing CSS;
- keep class ownership obvious;
- start mobile-first and keep narrow screens calm;
- pass all 20 principles with evidence;
- no new visual language;
- no one-off hacks.
