"""Lee el listado de artículos de la tienda (Excel) y guarda, para cada artículo de la web, la marca según su código de barras.

  python3 tools/catalogo/excel.py LISTADO.xlsx

Solo se leen las columnas Código de barras, Descripción y Pvp. Los precios de compra del Excel no se leen ni se guardan.
El resultado (marcas-ean.json: «nombre|sección|precio» → [marca, seguro]) es lo único que se guarda en el repositorio;
el Excel no se sube.
"""
import collections, json, os, re, sys, unicodedata, zipfile
import xml.etree.ElementTree as ET
sys.path.insert(0, os.path.dirname(__file__))
from marcas_ean import marca_ean

HERE = os.path.dirname(__file__)
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
NS = {'m': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}

def leer(path):
    """Filas del Excel como {ean, desc, pvp}. Lee el XML directamente (el archivo trae estilos que openpyxl no acepta)."""
    z = zipfile.ZipFile(path)
    ss = [''.join(t.text or '' for t in si.iter('{%s}t' % NS['m'])) for si in ET.fromstring(z.read('xl/sharedStrings.xml')).findall('m:si', NS)]
    rows = ET.fromstring(z.read('xl/worksheets/sheet1.xml')).findall('.//m:sheetData/m:row', NS)
    head = None; out = []
    for r in rows:
        d = {}
        for c in r.findall('m:c', NS):
            v = c.find('m:v', NS)
            val = v.text if v is not None else ''.join(x.text or '' for x in c.iter('{%s}t' % NS['m']))
            if c.get('t') == 's': val = ss[int(val)]
            d[re.sub(r'\d', '', c.get('r'))] = (val or '').strip()
        if head is None:
            head = {v.lower(): k for k, v in d.items()}; continue
        col = lambda name: d.get(head.get(name, ''), '')
        try: pvp = float(col('pvp tarifa general') or 0)
        except ValueError: pvp = 0
        out.append({'ean': col('codigo de barras'), 'desc': col('descripción'), 'pvp': pvp})
    return out

def norm(s):
    return ' '.join(unicodedata.normalize('NFD', s.lower()).encode('ascii', 'ignore').decode().split())
UNIT = r'(?:cm|mm|m|l|ml|cl|lt|tz|tzs|tazas?|w|v|bar|bares|kg|g|gr|pz|pzs|pzas|piezas|uds?|x\d+)'
def key(s):
    s = norm(s).replace(',', '.')
    s = re.sub(r'\b\d+(?:\.\d+)?\s*(?:/|-|\+|x|y)?\s*\d*(?:\.\d+)?\s*' + UNIT + r'\b', '', s)
    s = re.sub(r'\b\d+(?:\.\d+)?x\d+(?:\.\d+)?(?:x\d+)?\s*(?:cm)?\b', '', s)
    s = re.sub(r'[^a-z0-9 ]', ' ', s)
    return ' '.join(s.split())
ABBR = {'jgo': 'juego', 'pzas': 'piezas', 'pzs': 'piezas', 'pz': 'piezas', 'ind': 'induccion', 'antiadh': 'antiadherente',
        'antiadherenteerente': 'antiadherente', 'caf': 'cafetera', 'aut': 'automatica', 'c': 'con', 't': 'tapa', 'inf': 'infusor', 'rect': 'rectangular'}
def toks(x): return [ABBR.get(w, w) for w in key(x).split() if w not in ('y', 'de')]
def same(a, b): return a == b or (len(b) >= 3 and a.startswith(b)) or (len(a) >= 3 and b.startswith(a))

def emparejar(cat, rows):
    """Para cada artículo de la web, las filas del Excel de las que sale (mismo nombre, sin medidas; o abreviado con el mismo precio)."""
    by_name, by_key, by_price = collections.defaultdict(list), collections.defaultdict(list), collections.defaultdict(list)
    for i, r in enumerate(rows):
        by_name[norm(r['desc'])].append(i); by_key[key(r['desc'])].append(i); by_price[round(r['pvp'], 2)].append(i)
    out = []
    for name, sec, sizes, price, multi in cat:
        cand = by_name.get(norm(name)) or by_key.get(key(name)) or []
        if not cand:
            ct = toks(name)
            cand = [i for i in by_price.get(round(price, 2), []) if ct
                    and all(any(same(a, b) for b in toks(rows[i]['desc'])) for a in ct)
                    and all(any(same(a, b) for a in ct) or b.isdigit() or b in ('con', 'tapa') for b in toks(rows[i]['desc']))][:1]
        out.append(cand)
    return out

def main():
    rows = leer(sys.argv[1])
    cat = json.load(open(os.path.join(ROOT, 'assets/data/catalogo.json'), encoding='utf-8'))
    pairs = emparejar(cat, rows)
    res = {}; c = collections.Counter()
    for (name, sec, sizes, price, multi), m in zip(cat, pairs):
        # the web groups sizes under one name at the lowest price; a generic name («Abrebotellas») can exist for several brands
        # at different prices, so the rows at exactly this price decide the brand
        exact = [i for i in m if abs(rows[i]['pvp'] - price) < 0.011]
        b, sure = marca_ean([rows[i]['ean'] for i in (exact or m)], norm(name))
        c['emparejado' if m else 'sin pareja en el Excel'] += 1
        if b: res[f'{name}|{sec}|{price}'] = [b, sure]; c['con marca por código'] += 1
    json.dump(res, open(os.path.join(HERE, 'marcas-ean.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=0, sort_keys=True)
    print(dict(c))

if __name__ == '__main__':
    main()
