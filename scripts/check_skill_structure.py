#!/usr/bin/env python3
"""Deterministic checks for the vaoferi design skill repository."""

from __future__ import annotations

import importlib.util
import subprocess
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "SKILL.md"
REQUIRED_REFERENCES = [
    ROOT / "references" / "action-contract.md",
    ROOT / "references" / "component-sources.md",
    ROOT / "references" / "quality-gates.md",
    ROOT / "references" / "skillopt-and-architecture.md",
]
PRINCIPLES = [
    "Відступи",
    "Сітка",
    "Візуальна ієрархія",
    "Типографіка",
    "Контраст",
    "Баланс елементів",
    "Масштабованість",
    "Акценти",
    "Вирівнювання",
    "Цілісність кольорової палітри",
    "Читаємість тексту",
    "Послідовність стилів",
    "Вільний простір",
    "Зрозуміла навігація",
    "Швидкість завантаження",
    "Фокус на користувачі",
    "Інтуїтивність взаємодії",
    "Контекст у деталях",
    "Візуальна ритміка",
    "Тестування на різних пристроях",
]
MOJIBAKE = [
    "\u0420\u045f",
    "\u0420\u0405",
    "\u0420\u00b0",
    "\u0421\u0453",
    "\u0421\u201a",
    "\ufffd",
]


def read_utf8(path: Path) -> str:
    data = path.read_bytes()
    if data.startswith(b"\xef\xbb\xbf"):
        raise AssertionError(f"{path.relative_to(ROOT)} has UTF-8 BOM")
    return data.decode("utf-8")


def assert_no_mojibake(path: Path, text: str) -> None:
    for pattern in MOJIBAKE:
        if pattern in text:
            raise AssertionError(f"{path.relative_to(ROOT)} contains mojibake pattern {pattern!r}")


def check_skill_entrypoint() -> None:
    text = read_utf8(SKILL)
    assert_no_mojibake(SKILL, text)
    lines = text.splitlines()
    if len(lines) > 250:
        raise AssertionError(f"SKILL.md is too long for an entrypoint: {len(lines)} lines")
    for ref in REQUIRED_REFERENCES:
        rel = ref.relative_to(ROOT).as_posix()
        if rel not in text:
            raise AssertionError(f"SKILL.md does not route to {rel}")


def check_references() -> None:
    quality_text = ""
    for path in REQUIRED_REFERENCES:
        if not path.exists():
            raise AssertionError(f"Missing reference: {path.relative_to(ROOT)}")
        text = read_utf8(path)
        assert_no_mojibake(path, text)
        if path.name == "quality-gates.md":
            quality_text = text
    missing = [principle for principle in PRINCIPLES if principle not in quality_text]
    if missing:
        raise AssertionError("Missing principles in quality-gates.md: " + ", ".join(missing))


def check_snippets_config() -> None:
    script = ROOT / "scripts" / "validate_snippets_source.py"
    result = subprocess.run(
        [sys.executable, str(script), "--json"],
        cwd=ROOT,
        check=False,
        text=True,
        capture_output=True,
    )
    if result.returncode != 0:
        raise AssertionError(result.stderr.strip() or result.stdout.strip())
    generator = ROOT / "scripts" / "get_component_snippet.py"
    result = subprocess.run(
        [sys.executable, str(generator), "button", "--label", "Далі", "--json"],
        cwd=ROOT,
        check=False,
        text=True,
        capture_output=True,
    )
    if result.returncode != 0:
        raise AssertionError(result.stderr.strip() or result.stdout.strip())


def check_skillopt_scaffold() -> None:
    config = ROOT / ".skillopt" / "config.yaml"
    data_dir = ROOT / ".skillopt" / "data"
    if not config.exists():
        raise AssertionError("Missing .skillopt/config.yaml")
    for split in ("train", "val", "test"):
        path = data_dir / split / "items.json"
        if not path.exists():
            raise AssertionError(f"Missing SkillOpt split: {path.relative_to(ROOT)}")
        read_utf8(path)
    if importlib.util.find_spec("skillopt") is None:
        raise AssertionError("Python package 'skillopt' is not installed")


def main() -> int:
    checks = [
        check_skill_entrypoint,
        check_references,
        check_snippets_config,
        check_skillopt_scaffold,
    ]
    for check in checks:
        check()
        print(f"OK {check.__name__}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
