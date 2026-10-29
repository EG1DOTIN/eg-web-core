#!/usr/bin/env python3
"""
audit_token_integrity.py
------------------------
Validates that CSS design tokens declared in src/tokens/tokens.css
have balanced braces, proper syntax, and defines essential palettes.
"""

import sys
import re
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
TOKENS_FILE = ROOT_DIR / "src" / "tokens" / "tokens.css"


def audit_tokens() -> int:
    if not TOKENS_FILE.exists():
        print(f"❌ Missing tokens file: {TOKENS_FILE}")
        return 1

    content = TOKENS_FILE.read_text(encoding="utf-8")
    errors = []

    # 1. Brace balancing check
    open_braces = content.count("{")
    close_braces = content.count("}")
    if open_braces != close_braces:
        errors.append(f"Unbalanced braces in tokens.css: {open_braces} open vs {close_braces} close")

    # 2. Extract defined CSS variables
    var_pattern = re.compile(r'(--eg-[\w-]+)\s*:')
    defined_vars = set(var_pattern.findall(content))

    # Essential tokens required by components
    essential_tokens = [
        "--eg-font-sans",
        "--eg-color-primary",
        "--eg-bg-canvas",
        "--eg-bg-surface",
        "--eg-bg-subtle",
        "--eg-text-primary",
        "--eg-text-secondary",
        "--eg-border-subtle",
        "--eg-radius-md",
        "--eg-transition-fast",
    ]

    for tok in essential_tokens:
        if tok not in defined_vars:
            errors.append(f"Missing essential design token: '{tok}'")

    if errors:
        print(f"❌ Token integrity audit failed with {len(errors)} error(s):")
        for err in errors:
            print(f"   • {err}")
        return 1

    print(f"✅ Design token integrity audit passed ({len(defined_vars)} variables defined).")
    return 0


if __name__ == "__main__":
    sys.exit(audit_tokens())
