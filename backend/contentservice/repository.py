import requests
from functools import lru_cache


LOCAL_SPECIES = [
    'Ficus elastica',
    'Cedrela odorata',
    'Tapirus terrestris',
    'Pecari tajacu',
    'Calyptura cristata'
]


@lru_cache(maxsize=128)
def find_place_id(place_query: str) -> int | None:
    r = requests.get('https://api.inaturalist.org/v1/places/autocomplete', params={'q': place_query, 'per_page': 1}, timeout=5)
    data = r.json()
    return ((data.get('results') or [{}])[0]).get('id')


def search_taxa_inat(params: dict) -> list[dict]:
    r = requests.get('https://api.inaturalist.org/v1/taxa', params=params, timeout=5)
    return (r.json().get('results') or [])


def search_species_gbif(params: dict) -> dict:
    r = requests.get('https://api.gbif.org/v1/species/search', params=params, timeout=5)
    return r.json()


def gbif_match(name: str) -> dict:
    return requests.get('https://api.gbif.org/v1/species/match', params={'name': name}, timeout=5).json()


def wiki_summary_es(title: str) -> str:
    try:
        r = requests.get(f'https://es.wikipedia.org/api/rest_v1/page/summary/{title}', timeout=5)
        return r.json().get('extract') or ''
    except Exception:
        return ''


def wikidata_description_es(name: str) -> str:
    try:
        r = requests.get('https://www.wikidata.org/w/api.php', params={'action': 'wbsearchentities', 'search': name, 'language': 'es', 'format': 'json', 'limit': 1}, timeout=5)
        return ((r.json().get('search') or [{}])[0]).get('description') or ''
    except Exception:
        return ''


def eol_search_title(name: str) -> str:
    try:
        r = requests.get('https://eol.org/api/search/1.0.json', params={'q': name}, timeout=5)
        items = r.json().get('results') or []
        return (items[0].get('title') if items else '') or ''
    except Exception:
        return ''


def autocomplete_species(q: str, limit: int = 10) -> list[str]:
    res = []
    ql = q.lower()
    for s in LOCAL_SPECIES:
        if ql in s.lower():
            res.append(s)
        if len(res) >= limit:
            return res
    try:
        gb = search_species_gbif({'limit': limit, 'q': q})
        for r in gb.get('results', [])[:limit]:
            name = r.get('scientificName') or r.get('canonicalName')
            if name and name not in res:
                res.append(name)
                if len(res) >= limit:
                    break
    except Exception:
        pass
    return res