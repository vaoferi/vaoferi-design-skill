#!/usr/bin/env python3
"""Return small component snippets from the configured component libraries."""

from __future__ import annotations

import argparse
import html
import json
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_CONFIG = ROOT / "config" / "component-libraries.json"


def load_enabled_libraries(path: Path) -> dict[str, dict[str, Any]]:
    data = json.loads(path.read_text(encoding="utf-8"))
    libraries = data.get("libraries")
    if not isinstance(libraries, dict):
        raise SystemExit("Config must contain a 'libraries' object")
    enabled = {
        name: meta
        for name, meta in libraries.items()
        if isinstance(meta, dict) and meta.get("enabled")
    }
    if not enabled:
        raise SystemExit("No enabled component libraries")
    return enabled


def button_snippet(library: str, label: str) -> str:
    safe_label = html.escape(label, quote=True)
    snippets = {
        "bootstrap": f'<button type="button" class="btn btn-primary">{safe_label}</button>',
        "bulma": f'<button type="button" class="button is-primary">{safe_label}</button>',
        "shoelace": f'<sl-button variant="primary">{safe_label}</sl-button>',
    }
    try:
        return snippets[library]
    except KeyError as exc:
        raise SystemExit(f"Unsupported component 'button' for library '{library}'") from exc


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("component", choices=["button"])
    parser.add_argument("--label", default="Next")
    parser.add_argument("--library", choices=["bootstrap", "bulma", "shoelace"])
    parser.add_argument("--config", type=Path, default=DEFAULT_CONFIG)
    parser.add_argument("--json", action="store_true", dest="as_json")
    args = parser.parse_args()

    enabled = load_enabled_libraries(args.config)
    names = [args.library] if args.library else sorted(enabled)
    missing = [name for name in names if name not in enabled]
    if missing:
        raise SystemExit("Library is not enabled: " + ", ".join(missing))

    result = [
        {
            "library": name,
            "package": enabled[name].get("npm"),
            "component": args.component,
            "snippet": button_snippet(name, args.label),
        }
        for name in names
    ]

    if args.as_json:
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        for item in result:
            print(f"[{item['library']}] {item['snippet']}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
