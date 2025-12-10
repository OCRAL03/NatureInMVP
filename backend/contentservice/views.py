from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .repository import find_place_id, search_taxa_inat, search_species_gbif, gbif_match, wiki_summary_es, wikidata_description_es, eol_search_title, autocomplete_species
from .models import SpeciesImage
from django.conf import settings
from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader


request_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'query': openapi.Schema(type=openapi.TYPE_STRING),
        'filters': openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                'category': openapi.Schema(type=openapi.TYPE_STRING),
                'family': openapi.Schema(type=openapi.TYPE_STRING),
                'location': openapi.Schema(type=openapi.TYPE_STRING),
                'estado': openapi.Schema(type=openapi.TYPE_STRING),
                'alimentacion': openapi.Schema(type=openapi.TYPE_STRING),
                'reproduccion': openapi.Schema(type=openapi.TYPE_STRING),
            },
        ),
    },
)

response_schema = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'items': openapi.Schema(
            type=openapi.TYPE_ARRAY,
            items=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'id': openapi.Schema(type=openapi.TYPE_STRING),
                    'scientificName': openapi.Schema(type=openapi.TYPE_STRING),
                    'imageUrl': openapi.Schema(type=openapi.TYPE_STRING),
                    'description': openapi.Schema(type=openapi.TYPE_STRING),
                    'kingdom': openapi.Schema(type=openapi.TYPE_STRING),
                    'status': openapi.Schema(type=openapi.TYPE_STRING),
                },
            ),
        ),
    },
)

@swagger_auto_schema(method='post', request_body=request_schema, responses={200: response_schema})
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
        place_id = find_place_id(place_query)

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
            inat = search_taxa_inat(inat_params)
            for t in inat:
                name = t.get('name') or 'Desconocida'
                slug = (t.get('name') or '').lower().replace(' ', '_')
                image = f"/static/species/{slug}.jpg"
                rec = SpeciesImage.objects.filter(scientific_name=name).first()
                if rec:
                    if getattr(rec, 'image', None):
                        image = f"/media/{rec.image.name}"
                    elif rec.filename:
                        image = f"/static/species/{rec.filename}"
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
                    title = wp.split('/')[-1]
                    wp_summary = wiki_summary_es(title)
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
                    'description': description,
                    'kingdom': cat,
                    'status': status_code,
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
            match = gbif_match(family)
            fam_key = match.get('usageKey')
            if fam_key:
                params['higherTaxonKey'] = fam_key
        gbif = search_species_gbif(params)
        for r in gbif.get('results', [])[:5]:
            name = r.get('scientificName') or r.get('canonicalName') or 'Desconocida'
            image = None
            # Filtrar por categoría (reino) si se indicó
            if category and (r.get('kingdom') or '').lower() != category.lower():
                continue
            try:
                inat_params = {'q': name, 'per_page': 1}
                if location:
                    place_id2 = find_place_id(location)
                    if place_id2:
                        inat_params['place_id'] = place_id2
                inat = search_taxa_inat(inat_params)
                taxon = (inat or [{}])[0]
                slug2 = (name or '').lower().replace(' ', '_')
                image = f"/static/species/{slug2}.jpg"
                rec2 = SpeciesImage.objects.filter(scientific_name=name).first()
                if rec2:
                    if getattr(rec2, 'image', None):
                        image = f"/media/{rec2.image.name}"
                    elif rec2.filename:
                        image = f"/static/species/{rec2.filename}"
            except Exception:
                image = None

            # Enriquecer descripción con Wikidata/EOL
            description = r.get('kingdom') and f"Reino: {r.get('kingdom')}"
            desc = wikidata_description_es(name)
            if desc:
                description = desc
            eol_title = eol_search_title(name)
            if eol_title:
                description = eol_title or description
            wp_summary = ''
            wp_summary = wiki_summary_es(name)
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
                'description': description,
                'kingdom': r.get('kingdom'),
                'status': None,
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


@api_view(['GET'])
@permission_classes([AllowAny])
def autocomplete(request):
    q = (request.GET.get('q') or '').strip()
    limit = int(request.GET.get('limit') or 10)
    if not q:
        return Response({'items': []})
    names = autocomplete_species(q, limit)
    return Response({'items': names})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def export_fichas_csv(request):
    role = getattr(getattr(request.user, 'role', None), 'role', 'student')
    if role not in ['teacher', 'expert']:
        return Response({'detail': 'no autorizado'}, status=403)
    query = request.GET.get('q') or ''
    gb = search_species_gbif({'limit': 50, 'q': query})
    rows = []
    for r in gb.get('results', [])[:50]:
        rows.append(
            [
                str(r.get('key') or ''),
                r.get('scientificName') or r.get('canonicalName') or '',
                r.get('kingdom') or ''
            ]
        )
    content = 'id,nombre,rein\n' + '\n'.join([','.join(row) for row in rows])
    return Response(content, headers={'Content-Type': 'text/csv'})


guide_request = openapi.Schema(
    type=openapi.TYPE_OBJECT,
    properties={
        'species': openapi.Schema(type=openapi.TYPE_ARRAY, items=openapi.Items(type=openapi.TYPE_STRING)),
        'title': openapi.Schema(type=openapi.TYPE_STRING),
    }
)


@swagger_auto_schema(method='post', request_body=guide_request)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def teaching_guides(request):
    role = getattr(getattr(request.user, 'role', None), 'role', 'student')
    if role not in ['teacher', 'expert']:
        return Response({'detail': 'no autorizado'}, status=403)
    species = request.data.get('species') or []
    if not species:
        species = ['Tapirus terrestris', 'Pecari tajacu', 'Rupicola peruvianus', 'Cedrela odorata', 'Ficus elastica']
    title = (request.data.get('title') or 'Guía pedagógica NatureIn').strip()

    buf = BytesIO()
    c = canvas.Canvas(buf, pagesize=A4)
    width, height = A4
    c.setTitle(title)
    c.setFont("Helvetica-Bold", 16)
    c.drawString(40, height - 60, title)
    c.setFont("Helvetica", 10)
    c.drawString(40, height - 80, "Selección de especies para actividades y trivia")
    y = height - 110

    for name in species:
        if y < 120:
            c.showPage()
            y = height - 60
        c.setFont("Helvetica-Bold", 12)
        c.drawString(40, y, name)
        y -= 16
        # Descripción (Wikidata/EOL/Wikipedia)
        desc = wikidata_description_es(name) or eol_search_title(name) or wiki_summary_es(name)
        c.setFont("Helvetica", 10)
        for line in (desc or "Sin descripción disponible").split('\n'):
            c.drawString(40, y, (line[:110] + ('…' if len(line) > 110 else '')))
            y -= 14
            if y < 120:
                c.showPage(); y = height - 60
        # Imagen estática si existe
        rec = SpeciesImage.objects.filter(scientific_name=name).first()
        img_path = None
        if rec and getattr(rec, 'image', None):
            img_path = Path(settings.MEDIA_ROOT) / rec.image.name
        else:
            filename = (rec.filename if rec and rec.filename else (name.lower().replace(' ', '_') + '.jpg'))
            img_path = settings.BASE_DIR / 'static' / 'species' / filename
        if img_path and img_path.exists():
            try:
                img = ImageReader(str(img_path))
                c.drawImage(img, 40, y - 140, width=200, height=140, preserveAspectRatio=True, mask='auto')
                y -= 160
            except Exception:
                pass
        # Separador
        c.line(40, y, width - 40, y)
        y -= 20

    c.showPage()
    c.save()
    pdf = buf.getvalue()
    buf.close()
    headers = {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="guia_pedagogica.pdf"'
    }
    return Response(pdf, headers=headers)


@api_view(['POST'])
@permission_classes([AllowAny])
def llm_chat(request):
    message = (request.data.get('message') or '').strip()
    history = request.data.get('history') or []
    if not message:
        return Response({'error': 'message requerido'}, status=400)
    system_prompt = 'Eres un asistente virtual llamado Ángela que responde preguntas con respuestas simples y amigables.'
    msgs = [{'role': 'system', 'content': system_prompt}]
    for h in history:
        role = h.get('role')
        text = h.get('text') or h.get('content') or ''
        if role in ['user', 'assistant'] and text:
            msgs.append({'role': role, 'content': text})
    msgs.append({'role': 'user', 'content': message})

    groq_key = os.environ.get('GROQ_API_KEY')
    if groq_key:
        try:
            model = os.environ.get('GROQ_MODEL', 'llama-3.1-8b-instant')
            r = requests.post(
                'https://api.groq.com/openai/v1/chat/completions',
                headers={'Authorization': f'Bearer {groq_key}', 'Content-Type': 'application/json'},
                json={'model': model, 'messages': msgs},
                timeout=60
            )
            j = r.json()
            reply = (((j.get('choices') or [{}])[0].get('message') or {}).get('content')) or ''
            return Response({'reply': reply})
        except Exception:
            pass

    try:
        base = os.environ.get('LLM_BASE_URL', 'http://localhost:11434')
        model = os.environ.get('LLM_MODEL', 'llama3:latest')
        r = requests.post(
            f"{base}/api/chat",
            json={'model': model, 'messages': msgs, 'stream': False, 'options': {'num_predict': 128}},
            timeout=60
        )
        data = r.json()
        content = ((data.get('message') or {}).get('content')) or ''
        return Response({'reply': content})
    except Exception:
        return Response({'reply': 'No pude conectarme con la IA. Verifica GROQ_API_KEY o que Ollama (llama3) esté ejecutándose.'})


@api_view(['GET'])
@permission_classes([AllowAny])
def llm_health(request):
    base = os.environ.get('LLM_BASE_URL', 'http://localhost:11434')
    model = os.environ.get('LLM_MODEL', 'llama3:latest')
    try:
        tags = requests.get(f"{base}/api/tags", timeout=5).json()
        models = [t.get('name') for t in (tags.get('models') or [])]
        return Response({'available': True, 'models': models, 'modelConfigured': model})
    except Exception:
        return Response({'available': False, 'models': [], 'modelConfigured': model})
