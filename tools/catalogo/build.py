"""Genera assets/data/tienda.json (el catálogo que usa la web) a partir de assets/data/catalogo.json.

  python3 tools/catalogo/build.py [--revision salida.csv]

tienda.json:
  b: marcas   [[nombre, logo o ""], ...]   (la última es «Otras marcas»)
  g: fotos    [[archivo, exacta (1) u orientativa (0)], ...]
  i: artículos [[nombre, sección, medidas, precio, varios precios (0/1), marca, foto (-1 = ilustración)], ...]
"""
import csv, json, os, sys, unicodedata
sys.path.insert(0, os.path.dirname(__file__))
from marcas import marca
from fotos import foto, LOGOS

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
SECC = ['Sartenes', 'Ollas', 'Café y té', 'Electro', 'Cuchillos', 'Utensilios', 'Repostería', 'Vajilla',
        'Cubertería', 'Cristalería', 'Termos', 'Hogar', 'Cuidado personal', 'Infantil', 'Otros']

import re
# the old export doubled a suffix when it expanded «antiadh.»
FIXES = [(re.compile(r'antiadherenteerente', re.I), lambda m: 'Antiadherente' if m.group(0)[0].isupper() else 'antiadherente')]
def fix(name):
    for rx, f in FIXES: name = rx.sub(f, name)
    return name

def norm(s):
    return ' '.join(unicodedata.normalize('NFD', s.lower()).encode('ascii', 'ignore').decode().split())

def main():
    src = json.load(open(os.path.join(ROOT, 'assets/data/catalogo.json'), encoding='utf-8'))
    rows, brands, imgs, img_ix = [], {}, [], {}
    for n, c, s, p, m in src:
        it = {'n': n, 'c': c, 's': s, 'p': p, 'k': norm(n)}
        b, why = marca(it)
        f = foto(it, b)
        rows.append((it, b, why, f))
        if b: brands[b] = brands.get(b, 0) + 1
    order = sorted(brands, key=lambda b: (-brands[b], b))
    bix = {b: i for i, b in enumerate(order)}
    other = len(order)
    out_items = []
    for (it, b, why, f), (_, _, _, _, m) in zip(rows, src):
        gi = -1
        if f:
            key = (f[0], f[1])
            if key not in img_ix:
                img_ix[key] = len(imgs); imgs.append([f[0], f[1]])
            gi = img_ix[key]
        out_items.append([fix(it['n']), it['c'], it['s'], it['p'], m, bix.get(b, other), gi])
    data = {'b': [[b, LOGOS.get(b, '')] for b in order] + [['', '']], 'g': imgs, 'i': out_items}
    missing = [g[0] for g in imgs if not os.path.exists(os.path.join(ROOT, 'assets/fotos', g[0]))]
    if missing:
        sys.exit('Faltan fotos en assets/fotos: ' + ', '.join(missing[:20]))
    with open(os.path.join(ROOT, 'assets/data/tienda.json'), 'w', encoding='utf-8') as fh:
        json.dump(data, fh, ensure_ascii=False, separators=(',', ':'))
    with_img = sum(1 for o in out_items if o[6] >= 0)
    exact = sum(1 for o in out_items if o[6] >= 0 and imgs[o[6]][1])
    print(f'{len(out_items)} artículos · {len(order)} marcas · {sum(brands.values())} con marca · '
          f'{with_img} con foto ({exact} exactas) · {len(imgs)} fotos distintas')
    if '--revision' in sys.argv:
        path = sys.argv[sys.argv.index('--revision') + 1]
        with open(path, 'w', newline='', encoding='utf-8-sig') as fh:
            w = csv.writer(fh, delimiter=';')
            w.writerow(['Artículo', 'Sección', 'Precio', 'Marca asignada', 'Por qué', 'Foto', 'Tipo de foto'])
            for it, b, why, f in rows:
                w.writerow([it['n'], SECC[it['c']], str(it['p']).replace('.', ','), b or 'Otras marcas', why,
                            f[0] if f else '', ('exacta' if f[1] else 'orientativa') if f else 'ilustración'])
        print('revisión:', path)

if __name__ == '__main__':
    main()
