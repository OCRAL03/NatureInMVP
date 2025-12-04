from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import requests


@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Endpoint de diagnóstico para verificar que el servicio está activo.
    """
    return Response({'status': 'ok', 'service': 'contentservice'})


@api_view(['POST'])
def generate_ficha(request):
    query = request.data.get('query') or ''
    filters = request.data.get('filters') or {}
    family = (filters.get('family') or '').strip()
    location = (filters.get('location') or '').strip()
    category = (filters.get('category') or '').strip()
    items = []
    estado = (filters.get('estado') or '').strip().upper()
    alimentacion = (filters.get('alimentacion') or '').strip().lower()
    reproduccion = (filters.get('reproduccion') or '').strip().lower()
    try:
        place_query = location or ''
        if not place_query:
            for candidate in ['Tingo María', 'Leoncio Prado', 'Huánuco']:
                place_query = candidate
                break
        inat_place = requests.get(
            'https://api.inaturalist.org/v1/places/autocomplete',
            params={'q': place_query, 'per_page': 1}, timeout=5
        ).json()
        place_id = ((inat_place.get('results') or [{}])[0]).get('id')

        desired = 5
        kingdom_map = {'Plantae': 47126, 'Animalia': 1}
        cats = [category] if category in kingdom_map else ['Plantae', 'Animalia']
        for cat in cats:
            if len(items) >= desired:
                break
            kid = kingdom_map.get(cat)
            inat_params = {
                'per_page': desired - len(items),
                'rank': 'species',
                'is_active': True,
                'taxon_id': kid,
            }
            if place_id:
                inat_params['place_id'] = place_id
            if query:
                inat_params['q'] = query
            inat = requests.get('https://api.inaturalist.org/v1/taxa', params=inat_params, timeout=5).json()
            for t in (inat.get('results') or []):
                name = t.get('name') or 'Desconocida'
                photo = t.get('default_photo') or {}
                image = photo.get('medium_url') or photo.get('square_url')
                description = t.get('wikipedia_summary') or ''
                status_code = None
                cs = t.get('conservation_status') or {}
                if cs:
                    status_code = (cs.get('status') or '').upper()
                if not status_code:
                    for cs2 in (t.get('conservation_statuses') or []):
                        sc = (cs2.get('status') or '').upper()
                        if sc:
                            status_code = sc
                            break
                if estado and status_code and estado != status_code:
                    continue
                wp = t.get('wikipedia_url') or ''
                wp_summary = ''
                if wp:
                    try:
                        title = wp.split('/')[-1]
                        wpr = requests.get(
                            f'https://es.wikipedia.org/api/rest_v1/page/summary/{title}', timeout=5
                        ).json()
                        wp_summary = wpr.get('extract') or ''
                    except Exception:
                        wp_summary = ''
                text = (wp_summary or description or '').lower()
                if alimentacion:
                    if alimentacion.startswith('herb') and ('herbív' not in text and 'herbiv' not in text):
                        continue
                    if alimentacion.startswith('carn') and ('carnív' not in text and 'carniv' not in text):
                        continue
                    if alimentacion.startswith('omní') or alimentacion.startswith('omni'):
                        if ('omnív' not in text and 'omniv' not in text):
                            continue
                if reproduccion:
                    if reproduccion.startswith('sexu') and ('sexual' not in text and 'sexuada' not in text):
                        continue
                    if reproduccion.startswith('asex') and ('asexual' not in text and 'apomix' not in text and 'bipartición' not in text and 'espor' not in text):
                        continue
                if wp_summary:
                    description = wp_summary
                items.append({
                    'id': str(t.get('id')),
                    'scientificName': name,
                    'imageUrl': image,
                    'description': description
                })
                if len(items) >= desired:
                    break
    except Exception:
        pass

    # Try GBIF species search, add iNaturalist image, fallback to stub
    try:
        params = {'limit': 5, 'rank': 'SPECIES'}
        if query:
            params['q'] = query
        # Filtrar por familia usando higherTaxonKey
        if family:
            try:
                match = requests.get('https://api.gbif.org/v1/species/match', params={'name': family}, timeout=5).json()
                fam_key = match.get('usageKey')
                if fam_key:
                    params['higherTaxonKey'] = fam_key
            except Exception:
                pass
        gbif = requests.get('https://api.gbif.org/v1/species/search', params=params, timeout=5).json()
        for r in gbif.get('results', [])[:5]:
            name = r.get('scientificName') or r.get('canonicalName') or 'Desconocida'
            image = None
            # Filtrar por categoría (reino) si se indicó
            if category and (r.get('kingdom') or '').lower() != category.lower():
                continue
            try:
                inat_params = {'q': name, 'per_page': 1}
                if location:
                    try:
                        place = requests.get(
                            'https://api.inaturalist.org/v1/places/autocomplete',
                            params={'q': location, 'per_page': 1}, timeout=5
                        ).json()
                        place_id = ((place.get('results') or [{}])[0]).get('id')
                        if place_id:
                            inat_params['place_id'] = place_id
                    except Exception:
                        pass
                inat = requests.get('https://api.inaturalist.org/v1/taxa', params=inat_params, timeout=5).json()
                taxon = (inat.get('results') or [{}])[0]
                photo = taxon.get('default_photo') or {}
                image = photo.get('medium_url') or photo.get('square_url')
            except Exception:
                image = None

            # Enriquecer descripción con Wikidata/EOL
            description = r.get('kingdom') and f"Reino: {r.get('kingdom')}"
            try:
                wd = requests.get(
                    'https://www.wikidata.org/w/api.php',
                    params={
                        'action': 'wbsearchentities',
                        'search': name,
                        'language': 'es',
                        'format': 'json',
                        'limit': 1,
                    },
                    timeout=5,
                ).json()
                desc = (wd.get('search') or [{}])[0].get('description')
                if desc:
                    description = desc
            except Exception:
                pass
            try:
                eol = requests.get(
                    'https://eol.org/api/search/1.0.json', params={'q': name}, timeout=5
                ).json()
                eol_items = eol.get('results') or []
                if eol_items:
                    description = eol_items[0].get('title') or description
            except Exception:
                pass
            wp_summary = ''
            try:
                wpr = requests.get(
                    f'https://es.wikipedia.org/api/rest_v1/page/summary/{name}', timeout=5
                ).json()
                wp_summary = wpr.get('extract') or ''
            except Exception:
                wp_summary = ''
            text = (wp_summary or description or '').lower()
            if alimentacion:
                if alimentacion.startswith('herb') and ('herbív' not in text and 'herbiv' not in text):
                    continue
                if alimentacion.startswith('carn') and ('carnív' not in text and 'carniv' not in text):
                    continue
                if alimentacion.startswith('omní') or alimentacion.startswith('omni'):
                    if ('omnív' not in text and 'omniv' not in text):
                        continue
            if reproduccion:
                if reproduccion.startswith('sexu') and ('sexual' not in text and 'sexuada' not in text):
                    continue
                if reproduccion.startswith('asex') and ('asexual' not in text and 'apomix' not in text and 'bipartición' not in text and 'espor' not in text):
                    continue
            if wp_summary:
                description = wp_summary

            # Si no se indicó categoría, limitar a flora/fauna en fallback GBIF
            if not category and (r.get('kingdom') not in ['Plantae', 'Animalia']):
                continue
            items.append({
                'id': str(r.get('key')),
                'scientificName': name,
                'imageUrl': image,
                'description': description
            })
    except Exception:
        pass

    if not items:
        items = [{
            'id': 'stub-1',
            'scientificName': 'Ficus elastica',
            'description': 'Ejemplo de ficha generada'
        }]
    return Response({'items': items})
