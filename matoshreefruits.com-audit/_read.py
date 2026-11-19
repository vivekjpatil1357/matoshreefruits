import json, sys, io, os

def load(path):
    raw = open(path, "rb").read()
    if raw[:2] in (b"\xff\xfe", b"\xfe\xff"):
        text = raw.decode("utf-16")
    else:
        text = raw.decode("utf-8", errors="replace")
    return json.loads(text)

path = sys.argv[1]
mode = sys.argv[2] if len(sys.argv) > 2 else "summary"
d = load(path)

if mode == "summary":
    print("KEYS:", list(d.keys()))
    print(json.dumps({k: v for k, v in d.items() if k not in ("checks", "pages")}, ensure_ascii=False, indent=1)[:3000])

elif mode == "psi":
    le = d.get("loadingExperience") or {}
    print("== FIELD (CrUX) overall:", le.get("overall_category"))
    for mk, mv in (le.get("metrics") or {}).items():
        print("   ", mk, "|", mv.get("category"), "| p75 =", mv.get("percentile"))
    ol = d.get("originLoadingExperience") or {}
    print("== ORIGIN overall:", ol.get("overall_category"))
    for mk, mv in (ol.get("metrics") or {}).items():
        print("   ", mk, "|", mv.get("category"), "| p75 =", mv.get("percentile"))

    lhr = d.get("lighthouseResult") or {}
    print("== LAB categories:")
    for ck, cv in (lhr.get("categories") or {}).items():
        print("   ", ck, "=", cv.get("score"))
    au = lhr.get("audits") or {}
    want = ["first-contentful-paint", "largest-contentful-paint", "cumulative-layout-shift",
            "total-blocking-time", "interactive", "speed-index", "server-response-time",
            "render-blocking-resources", "uses-responsive-images", "unused-javascript",
            "modern-image-formats", "uses-optimized-images", "font-display", "proper-size-image",
            "total-byte-weight", "redirects", "network-server-latency", "mainthread-work-breakdown",
            "bootup-time", "dom-size", "priority-hints", "unsized-images", "meta-viewport",
            "document-title", "image-alt", "crawlable-anchors", "hreflang", "canonical",
            "is-crawlable", "robots-txt-status", "structured-data"]
    print("== LAB audits:")
    for ak in want:
        a = au.get(ak)
        if a:
            print("   %-30s score=%-6s %s" % (ak, a.get("score"), (a.get("displayValue") or "")))
    fs = lhr.get("finalDisplayedUrl") or lhr.get("finalUrl")
    print("URL:", fs)
