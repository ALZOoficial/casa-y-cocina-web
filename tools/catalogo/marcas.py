"""Reglas para asignar la marca a cada artículo del catálogo.

Cada regla es (marca, patrón, condición opcional, motivo). Se aplica la primera que encaja.
Los patrones se comparan con el nombre en minúsculas y sin tildes.
Lo que no encaja con ninguna regla queda en «Otras marcas».
"""
import re

LC_COLORES = r'(cereza|volcanico|volvanico|volc|azure|merengue|meringue|shell pink|chiffon pink|caribe|nectar|soleil|marseille|marsella|deep teal|flint|rhone|bamboo|sea salt|thyme|thym|garnet|cassis|mist grey|azul ink|riviera|denim)'

# secciones: 0 sartenes, 1 ollas, 2 café, 3 electro, 4 cuchillos, 5 utensilios, 6 repostería, 7 vajilla,
# 8 cubertería, 9 cristalería, 10 termos, 11 hogar, 12 cuidado personal, 13 infantil, 14 otros
REGLAS = [
    # el nombre dice la marca
    ('Le Creuset', r'\ble creuset\b', None, 'nombre'),
    ('Oral-B', r'\boral[ -]?b\b|\boralb\b', None, 'nombre'),
    ('Braun', r'\bbraun\b', None, 'nombre'),
    ('Tefal', r'\btefal\b', None, 'nombre'),
    ('Rowenta', r'\browenta\b', None, 'nombre'),
    ('Moulinex', r'\bmoulinex\b', None, 'nombre'),
    ('Krups', r'\bkrups\b', None, 'nombre'),
    ('Nespresso', r'\bnespresso\b', None, 'nombre'),
    ('Dolce Gusto', r'\bdolce gusto\b', None, 'nombre'),
    ("De'Longhi", r'\bdelonghi\b|\bde ?longhi\b', None, 'nombre'),
    ('Kenwood', r'\bkenwood\b', None, 'nombre'),
    ('Bosch', r'\bbosch\b', None, 'nombre'),
    ('Silit', r'\bsilit\b', None, 'nombre'),
    ('WMF', r'\bwmf\b', None, 'nombre'),
    ('Zwilling', r'\bzwilling\b', None, 'nombre'),
    ('Emsa', r'\bemsa\b', None, 'nombre'),
    ('Valira', r'\bvalira\b', None, 'nombre'),
    ('Thermos', r'\bthermos\b', None, 'nombre'),
    ('Ufesa', r'\bufesa\b', None, 'nombre'),
    ('Ibili', r'\bibili\b', None, 'nombre'),
    ('Monix', r'\bmonix\b', None, 'nombre'),
    ('BRA', r'\bbra\b', None, 'nombre'),
    ('Bialetti', r'\bbialetti\b', None, 'nombre'),
    ('Kuhn Rikon', r'\bkuhn\b', None, 'nombre'),
    ('Lékué', r'\blekue\b', None, 'nombre'),
    ('Brita', r'\bbrita\b', None, 'nombre'),
    ('Playmarket', r'\bplaymarket\b', None, 'nombre'),
    ('Gillette', r'\bgillette\b', None, 'nombre'),
    # líneas de producto que solo hace una marca
    # artículos que la web anterior ya mostraba con su marca (mismo nombre y precio)
    ('Lékué', r'^(omelette rojo|kit kefir y yogurt|veggie burger verde|kit veggie burger)$', None, 'web anterior'),
    ('Lékué', r'^molde tortilla$', lambda it: it['p'] == 15.5, 'web anterior'),
    ('Tefal', r'^(sarten|grill|plancha|wok|paellera) aroma$', lambda it: it['c'] == 0, 'web anterior'),
    ('Rowenta', r'^xforce\b', None, 'línea de producto'),
    ('Braun', r'\bsilk[ -]?epil\b|\bsilk[ -]?expert\b|\bsatin[ -]?hair\b|\bcruzer\b|\bminipimer\b|\bmultiquick\b|\bmultigroom\b|\bmgk ?\d', None, 'línea de producto'),
    ('Braun', r'\bseries? ?[3-9]\b|\bs[579] pro\b', lambda it: it['c'] == 12, 'línea de producto (afeitado)'),
    ('Braun', r'\bpulsonic\b', lambda it: re.search(r'afeitadora|cassette|cabezal', it['k']) is not None, 'línea de producto'),
    ('Oral-B', r'\bpulsonic\b|\bvitality\b|\btrizone\b|\boxyjet\b|\bgenius\b|\bio[ -]?\d|\bio series\b|\bio[ -]?(cb|sw|cw)', lambda it: it['c'] == 12, 'línea de producto'),
    ('Tefal', r'\bactifry\b|\boptigrill\b|\bingenio\b|\baquaspeed\b', None, 'línea de producto'),
    ('Moulinex', r'\bcookeo\b|\baccessimo\b|\beasy fry\b', None, 'línea de producto'),
    ('Rowenta', r'\bair force\b|\bx-?force\b|\bsilence force\b|\bperfect line\b', None, 'línea de producto'),
    ('Rowenta', r'\bplancha (focus|effective)\b', None, 'línea de producto'),
    ('Bosch', r'\bsensixx\b', None, 'línea de producto'),
    ('Nespresso', r'\bcitiz\b|\binissia\b', None, 'línea de producto'),
    ('Kuhn Rikon', r'\bduromatic\b', None, 'línea de producto'),
    ('Bialetti', r'\bbrikka\b|\bmoka (express|exc)', None, 'línea de producto'),
    ('BRA', r'\b(prior|efficient)\b', lambda it: it['c'] in (0, 1, 5), 'línea de producto'),
    ('Brita', r'\bmaxtra\b|\bmarella\b', None, 'línea de producto'),
    ('Joseph Joseph', r'^index\b', None, 'línea de producto'),
    ('Le Creuset', r'\bkone\b|\bcalab\b', None, 'línea de producto'),
    # colores exclusivos de Le Creuset, solo en los tipos de producto que fabrica
    ('Le Creuset', LC_COLORES, lambda it: it['c'] in (0, 1, 2, 5, 6, 7, 9, 10, 11), 'color de Le Creuset'),
    ('Le Creuset', r'^cocotte\b', lambda it: it['p'] >= 150, 'cocotte de hierro fundido (precio)'),
]
_COMP = [(b, re.compile(p), f, why) for b, p, f, why in REGLAS]

def marca(it):
    for b, rx, f, why in _COMP:
        if rx.search(it['k']) and (f is None or f(it)):
            return b, why
    return None, ''
