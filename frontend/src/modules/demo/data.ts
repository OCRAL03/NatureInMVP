import gallitoImg from '../../assets/images/especies/gallito_de_las_rocas.jpg'
import orquideaImg from '../../assets/images/especies/orquidea.jpg'
import tigrilloImg from '../../assets/images/especies/tigrillo.jpg'
import bellaDurmienteImg from '../../assets/images/explorar/bella durmiente01.webp'
import catarataQuinceImg from '../../assets/images/explorar/catarata_quinceañera.jpg'
import cuevaLechuzasImg from '../../assets/images/explorar/cueva_de_las_lechuzas.jpeg'

export const usuarios = [
  { username: 'ana_est', nombre: 'Ana Pérez', rol: 'Estudiante' },
  { username: 'luis_doc', nombre: 'Luis Gómez', rol: 'Docente' },
  { username: 'carla_exp', nombre: 'Carla Ríos', rol: 'Experto' },
  { username: 'mario_est', nombre: 'Mario Díaz', rol: 'Estudiante' },
  { username: 'sofia_doc', nombre: 'Sofía Torres', rol: 'Docente' },
]

export const actividades = [
  { titulo: 'Explora la biodiversidad local', descripcion: 'Busca y aprende sobre especies de Tingo María.' },
  { titulo: 'Misión: Identifica 3 especies', descripcion: 'Completa la misión y gana puntos.' },
  { titulo: 'Juego LTI: Clasifica especies', descripcion: 'Mini-juego embebido para reforzar el aprendizaje.' },
]

export const fichas = [
  { nombre: 'Rupicola peruvianus', comun: 'Gallito de las rocas', imagen: gallitoImg, descripcion: 'Ave emblemática de los Andes peruanos, conocida por su colorido plumaje naranja.' },
  { nombre: 'Oncidium sp.', comun: 'Orquídea', imagen: orquideaImg, descripcion: 'Planta epífita con flores vistosas, frecuente en bosques húmedos.' },
  { nombre: 'Leopardus tigrinus', comun: 'Tigrillo', imagen: tigrilloImg, descripcion: 'Pequeño felino silvestre de hábitos nocturnos.' },
]

export const lugares = [
  { nombre: 'Bella Durmiente', imagen: bellaDurmienteImg, descripcion: 'Formación montañosa icónica visible desde Tingo María.' },
  { nombre: 'Catarata La Quinceañera', imagen: catarataQuinceImg, descripcion: 'Hermosa caída de agua rodeada de vegetación.' },
  { nombre: 'Cueva de las Lechuzas', imagen: cuevaLechuzasImg, descripcion: 'Santuario natural con gran biodiversidad.' },
]

export const minijuegos = [
  { titulo: 'Clasificación de especies', tipo: 'Educaplay/LTI', link: '#', descripcion: 'Asocia imágenes con sus nombres científicos.' },
  { titulo: 'Memoria ecológica', tipo: 'LTI', link: '#', descripcion: 'Encuentra pares de especies y sus hábitats.' },
]

