"""Split NewYear01 SVGs into layered SVGs for Remotion hero loops.

Same pattern as split-cabin-svg.py / split-halloween-house.py:
each output keeps the original <defs> (styles + clipPaths) and the
original viewBox (0 0 1080 1080), so stacking the outputs at the same
size/position reproduces the original layout exactly.

Layers per icon (hero = one icon large in frame):
  Gift:      gift-base (body-kado), gift-lid (tutup + tali), gift-bow (simpul + bulatan)
  Hourglass: hourglass-frame (tutup-bawah/atas + body), hourglass-sand (pasir-jam),
             hourglass-sparkle (percikan-atas/bawah)
  Cap:       cap-body (body-topi), cap-fur (bulu-topi), cap-pom (cepol + highlight)
  Drink:     drink-glass (body + aksen + bawah + leher), drink-liquid (isi-gelas),
             drink-sparkle (sparkle-kanan/kiri)
"""
import copy
import os
import xml.etree.ElementTree as ET

BASE = os.path.expanduser("~/workspace/remotion-winter-cabin/public/NewYear01")
OUT = os.path.expanduser("~/workspace/remotion-winter-cabin/public")
os.makedirs(OUT, exist_ok=True)

NS = "http://www.w3.org/2000/svg"
XLINK = "http://www.w3.org/1999/xlink"
ET.register_namespace("", NS)
ET.register_namespace("xlink", XLINK)


def q(tag):
    return f"{{{NS}}}{tag}"


def find_by_id(elem, target):
    if elem.get("id") == target:
        return elem
    for child in elem:
        found = find_by_id(child, target)
        if found is not None:
            return found
    return None


def write_svg(name, src_root, elements):
    defs = None
    for child in src_root:
        if child.tag == q("defs"):
            defs = child
            break
    assert defs is not None, name
    svg = ET.Element(q("svg"))
    svg.set("xmlns", NS)
    svg.set("xmlns:xlink", XLINK)
    svg.set("viewBox", src_root.get("viewBox"))
    svg.append(copy.deepcopy(defs))
    for el in elements:
        svg.append(copy.deepcopy(el))
    path = os.path.join(OUT, name)
    ET.ElementTree(svg).write(path, encoding="utf-8", xml_declaration=True)
    print(name, os.path.getsize(path), "bytes")


def split(src_file, layers):
    tree = ET.parse(os.path.join(BASE, src_file))
    root = tree.getroot()
    print(src_file, "viewBox:", root.get("viewBox"))
    for out_name, ids in layers:
        els = []
        for i in ids:
            el = find_by_id(root, i)
            assert el is not None, f"{src_file}:{i}"
            els.append(el)
        write_svg(out_name, root, els)


split("NewYearGift.svg", [
    ("gift-base.svg", ["body-kado"]),
    ("gift-lid.svg", ["tutup-kado", "tali-kanan", "tali-kiri"]),
    ("gift-bow.svg", ["simpul_kanan", "simpul-kiri", "bulatan-simpul"]),
])
split("Hourglass.svg", [
    ("hourglass-frame.svg", ["tutup-bawah", "body-jam", "tutup-atas"]),
    ("hourglass-sand.svg", ["pasir-jam"]),
    ("hourglass-sparkle.svg", ["percikan-atas", "percikan-bawah"]),
])
split("NewYearCap.svg", [
    ("cap-body.svg", ["body-topi"]),
    ("cap-fur.svg", ["bulu-topi"]),
    ("cap-pom.svg", ["cepol-topi", "highlight-topi"]),
])
split("NewYearDrink.svg", [
    ("drink-glass.svg", ["body-gelas", "aksen-gelas-kiri", "aksen-gelas-kanan", "bawah-gelas", "leher-gelas"]),
    ("drink-liquid.svg", ["isi-gelas"]),
    ("drink-sparkle.svg", ["sparkle-kanan", "sparkle-kiri"]),
])
print("done")
