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

def foto(it, brand):
    for b, rx, f, e in _RULES:
        if (b == '*' or b == (brand or '')) and rx.search(it['k']):
            return f, e
    return None
