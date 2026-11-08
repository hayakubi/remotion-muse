"""Split HalloweenHouse.svg into layered SVGs for Remotion compositing.

Each output keeps the original <defs> (styles + clipPaths) and the
original viewBox, so stacking the outputs at the same size/position
reproduces the original layout exactly.

Window/door clip groups (cls-7, cls-10, cls-11, cls-13, cls-14, cls-18)
are lifted out of the house groups into two flicker layers:
  windows-a: upper windows (cls-7, cls-11, cls-14)
  windows-b: lower windows + front door (cls-10, cls-13, cls-18)
Everything else in the houses stays in house-base.
"""
import copy
import os
import xml.etree.ElementTree as ET

SRC = os.path.expanduser("~/workspace/user/files/HalloweenHouse.svg")
OUT = os.path.expanduser("~/workspace/remotion-winter-cabin/public")
os.makedirs(OUT, exist_ok=True)

NS = "http://www.w3.org/2000/svg"
XLINK = "http://www.w3.org/1999/xlink"
ET.register_namespace("", NS)
ET.register_namespace("xlink", XLINK)


def q(tag):
    return f"{{{NS}}}{tag}"


tree = ET.parse(SRC)
root = tree.getroot()
print("viewBox:", root.get("viewBox"))

defs = None
for child in root:
    if child.tag == q("defs"):
        defs = child
        break
assert defs is not None

WINDOW_A = {"cls-7", "cls-11", "cls-14"}
WINDOW_B = {"cls-10", "cls-13", "cls-18"}
WINDOW_ALL = WINDOW_A | WINDOW_B


def find_by_id(elem, target):
    if elem.get("id") == target:
        return elem
    for child in elem:
        found = find_by_id(child, target)
        if found is not None:
            return found
    return None


def collect_windows(elem, target_classes, out):
    for child in list(elem):
        if child.get("class") in target_classes:
            out.append(copy.deepcopy(child))
        else:
            collect_windows(child, target_classes, out)


def remove_windows(elem):
    for child in list(elem):
        if child.get("class") in WINDOW_ALL:
            elem.remove(child)
        else:
            remove_windows(child)


def write_svg(name, elements):
    svg = ET.Element(q("svg"))
    svg.set("xmlns", NS)
    svg.set("xmlns:xlink", XLINK)
    svg.set("viewBox", root.get("viewBox"))
    svg.append(copy.deepcopy(defs))
    for el in elements:
        svg.append(copy.deepcopy(el))
    path = os.path.join(OUT, name)
    ET.ElementTree(svg).write(path, encoding="utf-8", xml_declaration=True)
    print(name, os.path.getsize(path), "bytes")


# House base: house groups with windows/door removed
house_ids = ["rumah-kiri", "rumah-kanan", "rumah-tengah", "rumah-depan"]
base_elements = []
for hid in house_ids:
    el = copy.deepcopy(find_by_id(root, hid))
    assert el is not None, hid
    remove_windows(el)
    base_elements.append(el)
write_svg("house-base.svg", base_elements)

# Windows layers
for classes, name in [(WINDOW_A, "house-windows-a.svg"), (WINDOW_B, "house-windows-b.svg")]:
    found = []
    collect_windows(root, classes, found)
    print(name, "groups:", len(found))
    assert found, name
    write_svg(name, found)

# Single layers, copied whole
for layer_id, filename in [
    ("bulan", "house-moon.svg"),
    ("kelelawar-kiri", "house-bat-left.svg"),
    ("kelelawar-kanan", "house-bat-right.svg"),
    ("pohon-kiri", "house-tree-left.svg"),
    ("pohon-kanan", "house-tree-right.svg"),
    ("tanah", "house-ground.svg"),
]:
    el = find_by_id(root, layer_id)
    assert el is not None, layer_id
    write_svg(filename, [el])

print("done")
