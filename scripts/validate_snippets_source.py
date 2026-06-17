#!/usr/bin/env python3
"""Validate the local NLM snippets config used by the design skill."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from typing import Any


DEFAULT_CONFIG = Path(
    r"\\NAS\homes\vaoferi\Work\nlm\public_html\config\config\mcp-snippets.config.json"
)


def load_config(path: Path) -> dict[str, Any]:
    if not path.exists():
        raise SystemExit(f"Missing snippets config: {path}")

    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except UnicodeDecodeError as exc:
        raise SystemExit(f"Config is not valid UTF-8: {path}: {exc}") from exc
    except json.JSONDecodeError as exc:
        raise SystemExit(f"Config is not valid JSON: {path}: {exc}") from exc

    if not isinstance(data, dict):
        raise SystemExit("Config root must be a JSON object")
    return data


def validate_libraries(data: dict[str, Any]) -> dict[str, dict[str, Any]]:
    libraries = data.get("libraries")
    if not isinstance(libraries, dict) or not libraries:
        raise SystemExit("Config must contain a non-empty 'libraries' object")

    enabled: dict[str, dict[str, Any]] = {}
    for name, raw in libraries.items():
        if not isinstance(raw, dict):
            raise SystemExit(f"Library '{name}' must be an object")
        if not raw.get("enabled"):
            continue
        npm = raw.get("npm")
        if not isinstance(npm, str) or not npm.strip():
            raise SystemExit(f"Enabled library '{name}' must define a non-empty npm package")
        enabled[name] = raw

    if not enabled:
        raise SystemExit("Config has no enabled libraries")
    return enabled


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    parser.add_argument("--json", action="store_true", dest="as_json")
    args = parser.parse_args()

    config_path = args.config
    data = load_config(config_path)
    enabled = validate_libraries(data)

    result = {
        "config_path": str(config_path),
        "enabled_libraries": sorted(enabled),
        "packages": {name: meta["npm"] for name, meta in sorted(enabled.items())},
    }

    if args.as_json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print(f"OK snippets config: {config_path}")
        print("Enabled libraries: " + ", ".join(result["enabled_libraries"]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
