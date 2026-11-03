"""Split 03-winter_4.svg into layered SVGs for Remotion compositing.

Each output keeps the original <defs> (styles + clipPaths) and the
original viewBox, so stacking the outputs at the same size/position
reproduces the original cabin exactly, layer by layer.
"""
import copy
import os
import xml.etree.ElementTree as ET

SRC = os.path.expanduser("~/workspace/user/files/03-winter_4.svg")
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
assert defs is not None, "no defs found"


def find_by_id(elem, target):
    if elem.get("id") == target:
        return elem
    for child in elem:
        found = find_by_id(child, target)
        if found is not None:
            return found
    return None


def remove_by_ids(elem, targets):
    for child in list(elem):
        if child.get("id") in targets:
            elem.remove(child)
        else:
            remove_by_ids(child, targets)


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


# Base: everything except smoke, windows, trees (they get their own layers)
base_root = copy.deepcopy(root)
remove_by_ids(base_root, {"smoke-origin", "windows", "tree-left", "tree-right"})
base_children = [c for c in base_root if c.tag != q("defs")]
write_svg("cabin-base.svg", base_children)

# Individual animated layers
for layer_id, filename in [
    ("window-top", "cabin-window-top.svg"),
    ("window-left", "cabin-window-left.svg"),
    ("window-right", "cabin-window-right.svg"),
    ("tree-left", "cabin-tree-left.svg"),
    ("tree-right", "cabin-tree-right.svg"),
    ("smoke-origin", "cabin-smoke.svg"),
]:
    el = find_by_id(root, layer_id)
    assert el is not None, f"missing {layer_id}"
    write_svg(filename, [el])

print("done")
