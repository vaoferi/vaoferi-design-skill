#!/usr/bin/env python3
"""Private upstream cache; check freshness or checkout an explicitly reviewed SHA."""
import argparse
import json
import os
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = json.loads((ROOT / "config/design-upstreams.json").read_text(encoding="utf-8"))
TOOLS = {d["id"]: d for d in REGISTRY["dependencies"]}
CACHE = Path(os.environ.get("VAOFERI_DESIGN_CACHE", str(Path.home() / ".cache" / "vaoferi-design" / "upstreams"))).expanduser().resolve()

def git(*args, cwd=None):
    return subprocess.run(["git", *args], cwd=cwd, check=True, capture_output=True, text=True, timeout=120).stdout.strip()

def remote(d):
    ref = "refs/heads/" + d["ref"]
    lines = git("ls-remote", "--exit-code", d["url"], ref).splitlines()
    if len(lines) != 1 or lines[0].split()[1] != ref:
        raise ValueError("Unexpected remote ref")
    sha = lines[0].split()[0]
    if not re.fullmatch(r"[0-9a-f]{40}", sha):
        raise ValueError("Invalid remote SHA")
    return sha

def installed(d):
    p = CACHE / d["id"]
    if not p.exists():
        return None
    if p.is_symlink() or not (p / ".git").is_dir():
        raise ValueError("Cache path is not a managed clone")
    if git("remote", "get-url", "origin", cwd=p) != d["url"]:
        raise ValueError("Unexpected origin")
    if git("status", "--porcelain", "--untracked-files=all", cwd=p):
        raise ValueError("Dirty cache; do not overwrite")
    if not (p / d["entry"]).is_file():
        raise ValueError("Missing entry")
    return git("rev-parse", "HEAD", cwd=p)

def check(ids):
    results = []
    for key in ids:
        d = TOOLS[key]
        try:
            head = remote(d)
            current = installed(d)
            status = "CURRENT" if current == head else ("UPDATE_REQUIRED" if current else "INSTALL_REQUIRED")
            results.append(dict(id=key, status=status, remote=head, installed=current))
        except (OSError, ValueError, subprocess.SubprocessError) as e:
            results.append(dict(id=key, status="BLOCKED", reason=str(e)))
    print(json.dumps(results, indent=2))
    return 0 if all(r["status"] == "CURRENT" for r in results) else 1

def checkout(key, sha):
    d = TOOLS[key]
    if not re.fullmatch(r"[0-9a-f]{40}", sha):
        raise ValueError("Require full reviewed SHA")
    if remote(d) != sha:
        raise ValueError("Remote moved or SHA is stale; review current head")
    CACHE.mkdir(parents=True, exist_ok=True)
    p = CACHE / key
    old = installed(d)
    if old is None:
        git("clone", "--no-checkout", "--", d["url"], str(p))
    git("fetch", "--no-tags", "origin", "refs/heads/" + d["ref"], cwd=p)
    if git("rev-parse", "FETCH_HEAD", cwd=p) != sha:
        raise ValueError("Remote changed during fetch")
    # Check target entry in Git object before changing working tree.
    git("cat-file", "-e", sha + ":" + d["entry"], cwd=p)
    git("-c", "core.hooksPath=/dev/null", "checkout", "--detach", sha, cwd=p)
    if installed(d) != sha:
        raise ValueError("Checkout verification failed")
    print(json.dumps(dict(id=key, status="CHECKED_OUT", previous=old, sha=sha, entry=str(p / d["entry"]))))
    return 0

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    c = sub.add_parser("check")
    c.add_argument("ids", nargs="*", choices=list(TOOLS))
    u = sub.add_parser("checkout", help="Only after explicit review/approval; no upstream scripts executed")
    u.add_argument("id", choices=list(TOOLS))
    u.add_argument("sha")
    a = parser.parse_args()
    try:
        return check(a.ids or list(TOOLS)) if a.command == "check" else checkout(a.id, a.sha)
    except (OSError, ValueError, subprocess.SubprocessError) as e:
        print(json.dumps(dict(status="BLOCKED", reason=str(e))), file=sys.stderr)
        return 1

if __name__ == "__main__":
    sys.exit(main())
