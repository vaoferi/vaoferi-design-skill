# SkillOpt Scaffold

Ця папка містить маленький reviewed scaffold для майбутньої SkillOpt-перевірки skill.

Комітити можна:

- `config.yaml`;
- `data/train/items.json`;
- `data/val/items.json`;
- `data/test/items.json`;
- цей `README.md`.

Не комітити:

- `.skillopt/outputs/`;
- raw trace dumps;
- `.env`;
- API keys;
- великі optimizer run folders.

Локальна перевірка:

```bash
python scripts/check_skill_structure.py
```

Встановлений пакет `skillopt` не має `python -m skillopt`. Для реального upstream запуску використовуй CLI-скрипти з clone `microsoft/SkillOpt`:

```bash
python scripts/train.py --config <config.yaml>
python scripts/eval_only.py --config <config.yaml> --skill <best_skill.md>
```
