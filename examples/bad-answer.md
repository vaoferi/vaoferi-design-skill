# Bad Answer

Prompt:
"Ось реальний скрін форми редагування кампанії. Зроби його нормально."

Bad response:

- "Зараз додам новий `.campaign-form` і кілька `!important`, щоб швидко підправити відступи."
- "Ще навішаю глибокі селектори, щоб не розбиратись, який стиль чому належить."
- "Якщо щось вилізе за межі, сховаю `overflow-x: hidden`."
- "Для цього блоку поставлю фіксовану висоту, щоб усе вмістилось."
- "Ще один окремий клас під кожне поле, щоб не чіпати існуючий CSS."
- "Коли компонент стане вузьким, просто додам ще один viewport `@media` замість локального `@container`."

Why this is bad:

- it does not trace existing selectors or components;
- it multiplies new CSS instead of fixing the source;
- it uses `!important` as a habit;
- it hides ownership behind deep selectors;
- it treats the symptom, not the cause;
- it turns each element into an isolated island.
