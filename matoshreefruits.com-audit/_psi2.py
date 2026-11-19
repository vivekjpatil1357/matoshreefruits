import json, sys

raw = open(sys.argv[1], "rb").read()
if raw[:2] in (b"\xff\xfe", b"\xfe\xff"):
    text = raw.decode("utf-16")
else:
    text = raw.decode("utf-8", errors="replace")
d = json.loads(text)

for strat in ("mobile", "desktop"):
    p = (d.get("psi") or {}).get(strat) or {}
    print("\n===== PSI %s =====" % strat)
    print(" error:", p.get("error"))
    print(" lh version:", p.get("lighthouse_version"), "| analyzed:", p.get("analysis_timestamp"))
    print(" SCORES:", json.dumps(p.get("lighthouse_scores"), ensure_ascii=False))
    print(" LAB METRICS:")
    for k, v in (p.get("lab_metrics") or {}).items():
        print("   %-32s %s" % (k, json.dumps(v, ensure_ascii=False) if isinstance(v, dict) else v))
    print(" FIELD METRICS:", json.dumps(p.get("field_metrics"), ensure_ascii=False))
    print(" SEO AUDITS:")
    for a in (p.get("seo_audits") or []):
        print("   ", json.dumps(a, ensure_ascii=False)[:300])
    print(" A11Y AUDITS:")
    for a in (p.get("accessibility_audits") or []):
        print("   ", json.dumps(a, ensure_ascii=False)[:300])
    print(" FAILED AUDITS:")
    for a in (p.get("failed_audits") or []):
        print("   ", json.dumps(a, ensure_ascii=False)[:400])
    print(" OPPORTUNITIES:")
    for a in (p.get("opportunities") or []):
        print("   ", json.dumps(a, ensure_ascii=False)[:400])
    print(" DIAGNOSTICS:")
    for a in (p.get("diagnostics") or []):
        print("   ", json.dumps(a, ensure_ascii=False)[:300])
    print(" passed_audits_count:", p.get("passed_audits_count"))
