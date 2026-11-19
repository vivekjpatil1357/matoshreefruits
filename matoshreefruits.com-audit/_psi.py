import json, sys

raw = open(sys.argv[1], "rb").read()
if raw[:2] in (b"\xff\xfe", b"\xfe\xff"):
    text = raw.decode("utf-16")
else:
    text = raw.decode("utf-8", errors="replace")
d = json.loads(text)

crux = d.get("crux") or {}
print("== CrUX field data ==")
print("  target:", crux.get("target"), "| error:", crux.get("error"), "| form factor:", crux.get("form_factor"))
for mk, mv in (crux.get("metrics") or {}).items():
    if isinstance(mv, dict):
        print("   %-34s %s  p75=%s" % (mk, mv.get("category"), mv.get("percentile")))

for strat in ("mobile", "desktop"):
    p = (d.get("psi") or {}).get(strat) or {}
    lhr = p.get("lighthouseResult") or p
    print("\n== PSI %s ==" % strat)
    print("   url:", lhr.get("finalDisplayedUrl") or lhr.get("finalUrl"))
    for ck, cv in (lhr.get("categories") or {}).items():
        print("   cat %-14s %s" % (ck, cv.get("score")))
    au = lhr.get("audits") or {}
    if not au:
        print("   (no lighthouseResult; keys=%s)" % list(p.keys()))
        continue
    print("   -- METRICS --")
    for ak in ["first-contentful-paint", "largest-contentful-paint", "cumulative-layout-shift",
               "total-blocking-time", "interactive", "speed-index", "server-response-time",
               "network-server-latency", "total-byte-weight", "dom-size", "redirects",
               "mainthread-work-breakdown", "bootup-time"]:
        a = au.get(ak)
        if a:
            print("     %-30s score=%-6s %s" % (ak, a.get("score"), (a.get("displayValue") or "")))
    print("   -- LOW-SCORE AUDITS --")
    for ak, a in sorted(au.items()):
        if not isinstance(a, dict):
            continue
        s = a.get("score")
        sdm = a.get("scoreDisplayMode")
        if s is None or s >= 0.9:
            continue
        if sdm in ("notApplicable", "manual", "notProvided", "error"):
            continue
        print("     [%.2f] %-32s %s | %s" % (s, ak, a.get("title"), (a.get("displayValue") or "")))
