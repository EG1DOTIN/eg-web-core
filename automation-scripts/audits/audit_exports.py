#!/usr/bin/env python3
"""
audit_exports.py
----------------
Verifies that all primary components, hooks, services, and tokens in eg-web-core
are cleanly exported through intermediate barrel files and the root src/index.ts.
"""

import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent.parent
SRC_DIR = ROOT_DIR / "src"
INDEX_FILE = SRC_DIR / "index.ts"


def audit_exports() -> int:
    if not INDEX_FILE.exists():
        print(f"❌ Missing root index file: {INDEX_FILE}")
        return 1

    index_content = INDEX_FILE.read_text(encoding="utf-8")
    errors = []

    # Expected barrel sections
    expected_barrels = [
        ("components", SRC_DIR / "components" / "index.ts"),
        ("services", SRC_DIR / "services" / "index.ts"),
        ("hooks", SRC_DIR / "hooks" / "index.ts"),
        ("theme", SRC_DIR / "theme" / "index.ts"),
    ]

    combined_barrel_content = index_content + "\n"

    for name, barrel_path in expected_barrels:
        if not barrel_path.exists():
            errors.append(f"Missing barrel file: {barrel_path.relative_to(ROOT_DIR)}")
            continue

        barrel_content = barrel_path.read_text(encoding="utf-8")
        combined_barrel_content += barrel_content + "\n"

        # Check that index.ts exports from this barrel
        export_pattern = f"from './{name}'"
        if export_pattern not in index_content:
            errors.append(f"Root index.ts does not export from './{name}'")

        # Check components barrel specifically
        if name == "components":
            admin_barrel = SRC_DIR / "components" / "admin" / "index.ts"
            if not admin_barrel.exists():
                errors.append("Missing admin barrel: src/components/admin/index.ts")
            else:
                combined_barrel_content += admin_barrel.read_text(encoding="utf-8") + "\n"
                if "from './admin'" not in barrel_content:
                    errors.append("src/components/index.ts does not export from './admin'")

        # Check theme barrel specifically
        if name == "theme":
            for f in (SRC_DIR / "theme").glob("*.tsx"):
                combined_barrel_content += f.read_text(encoding="utf-8") + "\n"

    # Essential symbols that MUST be exported across barrels
    essential_symbols = [
        "Header", "Footer", "ImageSlider", "Container",
        "Modal", "Button", "Badge", "Logo", "SmartScrollButton", "ConsentBanner",
        "BlogList", "MarkdownViewer", "ContactForm", "ProductGrid", "DocsViewer",
        "AdminAuthGuard", "AdminLayout", "DataGrid", "StatCard",
        "AdminAnalyticsView", "AdminMessagesView", "AdminBlogEditor",
        "DataCache", "visitorTracker", "useVisitorTracker", "useAdminAuth",
        "ThemeProvider", "useTheme"
    ]

    for symbol in essential_symbols:
        if symbol not in combined_barrel_content:
            errors.append(f"Essential symbol '{symbol}' not found in barrel exports")

    if errors:
        print(f"❌ Found {len(errors)} export integrity issue(s):")
        for err in errors:
            print(f"   • {err}")
        return 1

    print(f"✅ Export integrity audit passed ({len(essential_symbols)} essential symbols verified).")
    return 0


if __name__ == "__main__":
    sys.exit(audit_exports())
