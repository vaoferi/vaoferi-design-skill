# Bad Answer

Prompt:
"Ось реальний скрін форми редагування кампанії. Зроби його нормально."

Bad response:

- "DESIGN.md потім зробимо, зараз швидше намалюю сторінку як вийде."
- "Кнопку, карточку й input зроблю прямо тут, бо на цій сторінці так зручніше."
- "Зараз додам новий `.campaign-form` і кілька `!important`, щоб швидко підправити відступи."
- "Ще навішаю глибокі селектори, щоб не розбиратись, який стиль чому належить."
- "Якщо щось вилізе за межі, сховаю `overflow-x: hidden`."
- "Для цього блоку поставлю фіксовану висоту, щоб усе вмістилось."
- "Ще один окремий клас під кожне поле, щоб не чіпати існуючий CSS."
- "Коли компонент стане вузьким, просто додам ще один viewport `@media` замість локального `@container`."
- "На мобільному просто зменшу все, а якщо буде тісно, нехай користувач скролить по горизонталі."
- "Кнопки можна залишити дрібними, бо це ж тільки телефон."
- "У проєкті вже є spacing tokens, але я зверху додам і `4x`, і `Fibonacci`, щоб було більше варіантів."
- "Контраст, навігацію, performance і різні пристрої не перевірятиму, бо layout уже виглядає нормально."

Why this is bad:

- it skips the design contract and primitive library;
- it creates page-specific components before shared primitives;
- it does not trace existing selectors or components;
- it multiplies new CSS instead of fixing the source;
- it uses `!important` as a habit;
- it hides ownership behind deep selectors;
- it treats the symptom, not the cause;
- it turns each element into an isolated island.
- it ignores mobile-first defaults and usable touch targets;
- it treats cramped mobile layout as acceptable instead of intentionally simplifying it.
- it silently mixes spacing systems and ignores existing project settings;
- it skips required principles instead of recording evidence.
