"""Qué foto lleva cada artículo. Se rellena a medida que se descargan fotos (ver fotos.json)."""
import json, os, re
HERE = os.path.dirname(__file__)
# logos de marca en assets/logos/
LOGOS = {}
_RULES = []
_p = os.path.join(HERE, 'fotos.json')
if os.path.exists(_p):
    cfg = json.load(open(_p, encoding='utf-8'))
    LOGOS = cfg.get('logos', {})
    # [marca o "*", patrón, archivo, exacta]
    _RULES = [(b, re.compile(p), f, e) for b, p, f, e in cfg.get('reglas', [])]

# fotos emparejadas una a una con el producto oficial más parecido: «nombre|sección|precio» → [archivo, exacta, producto oficial]
_ITEMS = {}
_q = os.path.join(HERE, 'fotos-articulos.json')
if os.path.exists(_q):
    _ITEMS = json.load(open(_q, encoding='utf-8'))

def foto(it, brand):
    # an exact photo of this very item always wins; then the closest official product; then the rules by kind of product
    for b, rx, f, e in _RULES:
        if e and (b == '*' or b == (brand or '')) and rx.search(it['k']):
            return f, e
    m = _ITEMS.get(f"{it['n']}|{it['c']}|{it['p']}")
    if m:
        return m[0], m[1]
    for b, rx, f, e in _RULES:
        if (b == '*' or b == (brand or '')) and rx.search(it['k']):
            return f, e
    return None
