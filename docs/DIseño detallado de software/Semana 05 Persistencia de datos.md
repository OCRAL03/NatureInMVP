La **persistencia de datos** se refiere a la capacidad de una aplicación para **almacenar de manera permanente** la información generada o utilizada durante su funcionamiento. Esto asegura que los datos no se pierdan al cerrar la aplicación o reiniciar el sistema, permitiendo su recuperación y reutilización posterior.

Se implementa a través de **bases de datos**, **archivos**, **sistemas de almacenamiento en la nube** u otros mecanismos de guardado, y está directamente vinculada con la **integridad, disponibilidad y seguridad de la información**.

---

## Ciclo de Vida de los Datos

1. **Creación**
    
    - Generación inicial de la información.
        
    - Puede provenir de:
        
        - Entrada manual del usuario.
            
        - Procesos automáticos (logs, cálculos, sensores).
            
        - Integraciones con fuentes externas (APIs, sistemas de terceros).
            
2. **Almacenamiento**
    
    - Registro en un medio persistente.
        
    - Ejemplos: bases de datos relacionales (PostgreSQL, MySQL), bases NoSQL (MongoDB), archivos estructurados (JSON, XML), almacenamiento en la nube.
        
3. **Uso y Procesamiento**
    
    - Consulta, edición, transformación o combinación de los datos para dar soporte a las funcionalidades de la aplicación.
        
    - Ejemplo: mostrar perfiles de usuarios, generar reportes, estadísticas o dashboards.
        
4. **Transmisión**
    
    - Intercambio de datos entre sistemas, módulos o aplicaciones externas.
        
    - Ejemplo: exportar datos a un servicio de analítica o recibir datos de un sistema financiero.
        
5. **Mantenimiento**
    
    - Incluye actualización, depuración, migración y respaldo de los datos.
        
    - Se aplican políticas de calidad y normalización.
        
6. **Archivado o Eliminación**
    
    - Definición del tiempo de retención.
        
    - Aplicación de normativas (por ejemplo, RGPD en Europa, Ley de Protección de Datos en cada país).
        
    - Eliminación segura para prevenir fugas de información.
        

---

## Políticas Legales

La persistencia de datos debe cumplir con **marcos regulatorios y normativos** que aseguren la protección y correcto tratamiento de la información. Entre las más comunes:

- **Protección de Datos Personales**:
    
    - Consentimiento del usuario para el tratamiento de sus datos.
        
    - Derecho al acceso, rectificación y eliminación.
        
    - Minimización de datos (solo almacenar lo necesario).
        
- **Políticas de Seguridad**:
    
    - Cifrado en tránsito y en reposo.
        
    - Control de accesos basado en roles (RBAC).
        
    - Respaldos seguros y recuperación ante desastres.
        
- **Auditoría y Trazabilidad**:
    
    - Registro de operaciones realizadas sobre los datos.
        
    - Transparencia en el uso de la información.
        

---

## Escenario: Sistema de Gestión de Usuarios

En una aplicación de gestión de usuarios, la persistencia de datos se refleja en:

- **Creación**: Registro de un nuevo usuario con datos personales (nombre, correo, contraseña cifrada).
    
- **Almacenamiento**: Guardado en una base de datos relacional con tablas normalizadas.
    
- **Uso**: Autenticación en el login, validación de roles y permisos.
    
- **Mantenimiento**: Actualización de datos personales, recuperación de contraseña.
    
- **Archivado/Eliminación**: Baja de un usuario y eliminación segura de sus datos cumpliendo normativa legal.
    

---

## Ciclo de Datos en una Aplicación

1. Entrada → El usuario introduce o genera datos.
    
2. Validación → Se verifica la integridad, formato y consistencia.
    
3. Procesamiento → La aplicación transforma o usa los datos según la lógica del negocio.
    
4. Almacenamiento → Se guardan en un medio persistente (base de datos, archivo, nube).
    
5. Recuperación → Los datos se consultan y se presentan al usuario o sistema.
    
6. Mantenimiento → Actualización, respaldo y depuración de datos.
    
7. Eliminación/Archivado → Aplicación de políticas de retención y cumplimiento legal.

### Opciones de persistencia

- Relacional