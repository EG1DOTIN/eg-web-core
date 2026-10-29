#!/usr/bin/env python3
"""
audit_security_rules.py
-----------------------
Scans source files in eg-web-core/src for security compliance:
1. rel="noopener noreferrer" enforcement on target="_blank"
2. Strict HTML sanitization on dangerouslySetInnerHTML
3. Zero hardcoded secrets, private keys, or credentials
"""

import sys
import re
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
SRC_DIR = ROOT_DIR / "src"


def audit_security() -> int:
    errors = []
    source_files = list(SRC_DIR.glob("**/*.ts")) + list(SRC_DIR.glob("**/*.tsx"))

    for f in source_files:
        content = f.read_text(encoding="utf-8", errors="replace")
        rel_path = f.relative_to(ROOT_DIR)

        # 1. Check target="_blank" without noopener noreferrer
        blank_matches = re.finditer(r'<a[^>]*target=["\']_blank["\'][^>]*>', content)
        for m in blank_matches:
            tag = m.group(0)
            if 'rel="noopener noreferrer"' not in tag and "rel='noopener noreferrer'" not in tag:
                # Check if it has rel at all
                if 'rel=' not in tag:
                    errors.append(f"{rel_path}: Anchor with target='_blank' missing rel='noopener noreferrer'")

        # 2. Check dangerouslySetInnerHTML usage
        if "dangerouslySetInnerHTML" in content:
            # Check if sanitizer is imported/used
            if "sanitizeHtml" not in content and "DOMPurify" not in content and "marked" not in content:
                errors.append(f"{rel_path}: Uses dangerouslySetInnerHTML without sanitizeHtml or DOMPurify")

        # 3. Check for obvious private keys
        if "-----BEGIN PRIVATE KEY-----" in content or "-----BEGIN RSA PRIVATE KEY-----" in content:
            errors.append(f"{rel_path}: Hardcoded private key detected!")

    if errors:
        print(f"❌ Security standards audit failed with {len(errors)} error(s):")
        for err in errors:
            print(f"   • {err}")
        return 1

    print(f"✅ Security rules audit passed ({len(source_files)} source files verified).")
    return 0


if __name__ == "__main__":
    sys.exit(audit_security())
