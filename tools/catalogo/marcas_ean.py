"""Marca a partir del código de barras (los primeros dígitos identifican al fabricante).

PREFIJOS: prefijo de 7 dígitos (EAN-13; los UPC de 12 dígitos se completan con un 0 delante) → (marca, seguro).
  seguro = 1: fabricante conocido y confirmado por los nombres de sus artículos.
  seguro = 0: muy probable, pero conviene que la tienda lo revise (sale en amarillo en el Excel de revisión).
COMPARTIDOS: prefijos que usa un grupo con varias marcas; la marca sale del nombre del artículo.
"""
import re

PREFIJOS = {
    '4000530': ('WMF', 1), '4211129': ('WMF', 1),
    '0630870': ('Le Creuset', 1), '0024147': ('Le Creuset', 1), '0843251': ('Le Creuset', 1), '0840457': ('Le Creuset', 1),
    '7610154': ('Kuhn Rikon', 1), '0705475': ('Kuhn Rikon', 1),
    '8420460': ('Lékué', 1),
    '8006363': ('Bialetti', 1),
    '4006387': ('Brita', 1),
    '5011423': ('Kenwood', 1),
    '4210101': ('Rowenta', 1), '3221610': ('Rowenta', 1), '3221613': ('Rowenta', 1), '3221614': ('Rowenta', 1), '3221616': ('Rowenta', 1),
    '4242002': ('Bosch', 1), '4242003': ('Bosch', 1), '4242005': ('Bosch', 1),
    '0010942': ('Krups', 1),
    '8004399': ("De'Longhi", 1),
    '4004633': ('Silit', 1),
    '8435092': ('Monix', 1),
    '8411796': ('BRA', 1),
    '8595028': ('Tescoma', 1),
    '5028420': ('Joseph Joseph', 1),
    '8711269': ('Mepal', 1),
    '3168430': ('Tefal', 1), '3168433': ('Tefal', 1), '3168437': ('Tefal', 1),
    '8021098': ('Braun', 1),
    '4211125': ('Beurer', 1),
    '3030050': ('BaByliss', 1),
    '8007403': ('Imetec', 1),
    '4008146': ('Severin', 1),
    '8713016': ('Princess', 1), '8712836': ('Princess', 1),
    '8425858': ('Playmarket', 1),
    '8414234': ('Taurus', 1),
    '0098399': ('Microplane', 1),
    '8051085': ('Silikomart', 1),
    # muy probables: revisar
    '8411922': ('Ibili', 0),
    '8414271': ('Lacor', 0),
    '4009839': ('Zwilling', 0),
    '4009049': ('Emsa', 0),
    '8020178': ('24Bottles', 0),
    '4006932': ('Kaiser', 0),
    '3289310': ('Emile Henry', 0), '3289311': ('Emile Henry', 0), '3289313': ('Emile Henry', 0),
    '3289317': ('Emile Henry', 0), '3289318': ('Emile Henry', 0), '3289319': ('Emile Henry', 0),
    '8411401': ('Valira', 0),
}
# grupos con varias marcas: la marca se decide por el nombre
COMPARTIDOS = {
    '4210201': 'pg', '8700216': 'pg', '7500435': 'pg', '8006540': 'pg',          # Braun / Oral-B
    '3121040': 'seb', '3121042': 'seb', '3121044': 'seb', '3121047': 'seb',      # Tefal / Rowenta / Moulinex / Krups
    '3016660': 'seb', '3016661': 'seb', '3016667': 'seb',
    '3045380': 'seb', '3045384': 'seb', '3045385': 'seb', '3045386': 'seb', '3045387': 'seb', '3045388': 'seb',
}
_ORALB = re.compile(r'\b(oral[ -]?b|oralb|ob|cepillos?|irrigador|ducha bucal|centro dental|vitality|trizone|io|genius|pulsonic slim)\b')

def prefijo(ean):
    e = (ean or '').strip()
    if not e.isdigit():
        return None
    if len(e) == 12:
        e = '0' + e
    return e[:7] if len(e) == 13 else None

def marca_ean(eans, nombre):
    """(marca, seguro, grupo) para un artículo, por mayoría de sus códigos de barras."""
    votos = {}
    for e in eans:
        p = prefijo(e)
        if p in PREFIJOS:
            m, s = PREFIJOS[p]
        elif p in COMPARTIDOS:
            g = COMPARTIDOS[p]
            if g == 'pg':
                m, s = ('Oral-B' if _ORALB.search(nombre) else 'Braun'), 1
            else:
                m, s = 'seb', 1          # resolved by the name rules
        else:
            continue
        votos[(m, s)] = votos.get((m, s), 0) + 1
    if not votos:
        return None, 0
    (m, s), _ = max(votos.items(), key=lambda kv: kv[1])
    return m, s
