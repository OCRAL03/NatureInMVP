from django.db import models

class Categoria(models.Model):
    categoria = models.CharField(max_length=20)

class EstadoDeConservacion(models.Model):
    estado_conservacion = models.CharField(max_length=20)

class Habitat(models.Model):
    habitat = models.CharField(max_length=50)

class Locacion(models.Model):
    locacion = models.CharField(max_length=200)

class PeligroHumano(models.Model):
    nivel_peligro = models.CharField(max_length=50)

class TipoEspecie(models.Model):
    especie = models.CharField(max_length=50)

class TipoPlanta(models.Model):
    tipo = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=200)

class TipoAnimal(models.Model):
    tipo_animal = models.CharField(max_length=50)

class TipoAlimentacion(models.Model):
    alimentacion = models.CharField(max_length=20)

class TipoReproduccion(models.Model):
    reproduccion = models.CharField(max_length=20)

class EpocaFloracion(models.Model):
    epoca_floracion = models.CharField(max_length=20)

class TipoFlor(models.Model):
    tipo_flor = models.CharField(max_length=50)

class TipoSuelo(models.Model):
    suelo = models.CharField(max_length=10)

class UsosAlimenticios(models.Model):
    usos_alimenticios = models.CharField(max_length=10, null=True, blank=True)

class UsosMedicinales(models.Model):
    usos_medicinales = models.CharField(max_length=10, null=True, blank=True)

class Usos(models.Model):
    usos_alimenticios = models.ForeignKey(UsosAlimenticios, null=True, blank=True, on_delete=models.CASCADE)
    usos_medicinales = models.ForeignKey(UsosMedicinales, null=True, blank=True, on_delete=models.CASCADE)
    descripcion = models.CharField(max_length=200, null=True, blank=True)

class Especies(models.Model):
    categoria = models.ForeignKey(Categoria, on_delete=models.CASCADE)
    tipo_especie = models.ForeignKey(TipoEspecie, on_delete=models.CASCADE)
    nombre_comun = models.CharField(max_length=100)
    nombre_cientifico = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=500)
    habitat = models.ForeignKey(Habitat, on_delete=models.CASCADE)
    locacion = models.ForeignKey(Locacion, on_delete=models.CASCADE)
    tipo_reproduccion = models.ForeignKey(TipoReproduccion, on_delete=models.CASCADE)
    estado_conservacion = models.ForeignKey(EstadoDeConservacion, on_delete=models.CASCADE)
    peligro = models.ForeignKey(PeligroHumano, on_delete=models.CASCADE)

class Floracion(models.Model):
    epoca_floracion = models.ForeignKey(EpocaFloracion, null=True, blank=True, on_delete=models.CASCADE)
    tipo_flor = models.ForeignKey(TipoFlor, null=True, blank=True, on_delete=models.CASCADE)
    descripcion = models.CharField(max_length=200, null=True, blank=True)

class Flora(models.Model):
    especie = models.OneToOneField(Especies, on_delete=models.CASCADE, primary_key=True)
    tipo_planta = models.ForeignKey(TipoPlanta, on_delete=models.CASCADE)
    altura_maxima = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    floracion = models.ForeignKey(Floracion, null=True, blank=True, on_delete=models.CASCADE)
    tipo_suelo = models.ForeignKey(TipoSuelo, on_delete=models.CASCADE)
    usos = models.ForeignKey(Usos, null=True, blank=True, on_delete=models.CASCADE)

class ModoDeReproduccion(models.Model):
    modo_de_reproduccion = models.CharField(max_length=50)

class Fauna(models.Model):
    especie = models.OneToOneField(Especies, on_delete=models.CASCADE, primary_key=True)
    tipo_animal = models.ForeignKey(TipoAnimal, on_delete=models.CASCADE)
    tipo_alimentacion = models.ForeignKey(TipoAlimentacion, on_delete=models.CASCADE)
    modo_reproduccion = models.ForeignKey(ModoDeReproduccion, null=True, blank=True, on_delete=models.CASCADE)
    tiempo_gestacion = models.CharField(max_length=50, null=True, blank=True)
    numero_crias = models.CharField(max_length=50, null=True, blank=True)
    tamano_min_cm = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    tamano_max_cm = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    peso_min_kg = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    peso_max_kg = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

class Especie(models.Model):
    nombre_cientifico = models.CharField(max_length=200)
    nombre_comun = models.CharField(max_length=200, blank=True)
    categoria = models.CharField(max_length=100, blank=True)  # p.ej. Ave, Planta
    habitat = models.CharField(max_length=200, blank=True)
    iucn_estado = models.CharField(max_length=50, blank=True)
    descripcion = models.TextField(blank=True)
    # multimedia se guarda en MediaAsset o campos directos
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.nombre_comun or self.nombre_cientifico

class MediaAsset(models.Model):
    especie = models.ForeignKey(Especie, related_name='media', on_delete=models.CASCADE)
    tipo = models.CharField(max_length=20, choices=(('image','image'),('audio','audio'),('video','video')))
    archivo = models.FileField(upload_to='especies/')
    titulo = models.CharField(max_length=150, blank=True)
