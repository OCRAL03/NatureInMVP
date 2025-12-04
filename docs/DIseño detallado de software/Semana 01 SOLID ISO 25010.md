# SOLID

## Introducción a SOLID

SOLID es un acrónimo que representa cinco principios fundamentales de la programación orientada a objetos (POO) y el diseño de software. Estos principios ayudan a crear sistemas más mantenibles, flexibles y escalables.

## Los Principios SOLID

1. Principio de Responsabilidad Única (SRP - Single Responsibility Principle):
    

- Una clase debe tener una sola razón para cambiar.
    
- Cada clase debe estar enfocada en una única tarea o función.
    
- Facilita el mantenimiento y las pruebas.
    
- Ejemplo (PHP):
    
- Mal: Una clase Reporte genera PDF y envía correos.
    
- Bien: Una clase GeneradorDePDF genera PDF y otra clase EnviadorDeEmail envía correos.
    

1. Principio de Abierto/Cerrado (OCP - Open/Closed Principle):
    

- El software debe estar abierto a la extensión, pero cerrado a la modificación.
    
- Se deben añadir nuevas funcionalidades extendiendo el código existente, sin modificar el código que ya funciona.
    
- Evita introducir errores al modificar código probado.
    
- Ejemplo (Java):
    
- Mal: Una clase Descuento con condicionales para cada tipo de producto.
    
- Bien: Una clase abstracta Descuento y clases derivadas (DescuentoRopa, DescuentoElectronica) para cada tipo de descuento.
    

1. Principio de Sustitución de Liskov (LSP - Liskov Substitution Principle):
    

- Las clases derivadas deben ser sustituibles por sus clases base sin alterar el comportamiento esperado.
    
- Objetos de una clase derivada deben poder reemplazar a objetos de la clase base sin afectar la funcionalidad del sistema.
    
- Ejemplo (Python):
    
- Mal: Una clase Cuadrado que hereda de Rectangulo y modifica la lógica de ancho y alto.
    
- Bien: Una clase Cuadrado independiente con su propia lógica para el lado.
    

1. Principio de Segregación de Interfaces (ISP - Interface Segregation Principle):
    

- Ningún cliente debe verse obligado a depender de interfaces que no utiliza.
    
- Es mejor tener varias interfaces específicas y pequeñas que una única interfaz grande y genérica.
    
- Reduce el acoplamiento y hace el código más modular.
    
- Ejemplo (PHP):
    
- Mal: Una interfaz Trabajador con métodos trabajar() y administrar(), donde Obrero solo necesita trabajar().
    
- Bien: Interfaces Trabajador (con trabajar()) y Administrador (con administrar()), donde Jefe implementa ambas.
    

1. Principio de Inversión de Dependencias (DIP - Dependency Inversion Principle):
    

- Los módulos de alto nivel no deben depender de los módulos de bajo nivel. Ambos deben depender de abstracciones.
    
- Las abstracciones no deben depender de los detalles. Los detalles deben depender de las abstracciones.
    
- Facilita la flexibilidad y el cambio de las implementaciones.
    
- Ejemplo (Java):
    
- Mal: La clase Usuario depende directamente de la clase MySQLDatabase.
    
- Bien: La clase Usuario depende de una interfaz Database, y MySQLDatabase implementa esa interfaz.
    

## Beneficios de Aplicar SOLID

- Mayor Mantenibilidad: El código es más fácil de entender y modificar debido a la claridad de responsabilidades.
    
- Mayor Flexibilidad: Es más fácil agregar nuevas funcionalidades o cambiar las implementaciones sin afectar el resto del sistema.
    
- Mayor Escalabilidad: El sistema puede crecer de manera más organizada y controlada.
    
- Menor Acoplamiento: Las clases son más independientes, lo que facilita las pruebas unitarias y la reutilización.

Capas base de diseño
Software sist. imformatico, aplicacion,(web, desktop, mobile, ferm), sistema
- Backend: arquitectura del sw. SOLID
- Frontend: Interfaces/vistas al usuario
- Base de datos: estándares, buenas practicas. Relacionales / No relacionales.

Los principios SOLID son un conjunto de cinco principios de diseño orientado a objetos que buscan mejorar la mantenibilidad, escalabilidad y flexibilidad del software. Fueron propuestos por Robert C. Martin (Uncle Bob). El acrónimo SOLID se forma con las iniciales de cada principio: Single Responsibility Principle (SRP), Open/Closed Principle (OCP), Liskov Substitution Principle (LSP), Interface Segregation Principle (ISP) y Dependency Inversion Principle (DIP).

Estos principios son fundamentales en la programación orientada a objetos (POO) porque ayudan a crear código más limpio, modular y fácil de mantener. Se aplican para evitar problemas comunes como el acoplamiento alto, la cohesión baja y la rigidez en el diseño de software. Entender SOLID es esencial para desarrollar sistemas robustos que puedan evolucionar con el tiempo sin requerir refactorizaciones masivas.

1. Principio de Responsabilidad Única (SRP)
2. Principio Abierto/Cerrado (OCP)
3. Principio de Sustitución de Liskov (LSP)
4. Principio de Segregación de Interfaces (ISP)
5. Principio de Inversión de Dependencia (DIP)
### 1. Principio de Responsabilidad Única (SRP)
"Una clase debe tener una, y solo una, razón para cambiar".

Cada clase debe encargarse de una sola responsabilidad o funcionalidad dentro del sistema. Evitar que una clase haga demasiadas cosas, ya que esto dificulta su mantenimiento y aumenta la probabilidad de errores al modificarla. Además de crear vulnerabilidades para agentes externos.

**Ejemplo**: Una clase Factura debería encargarse de representar la información de la factura, pero no de imprimirla o guardarla en una base de datos. Estas responsabilidades deben delegarse a otras clases como ImpresoraFactura y RepositorioFactura.

**Beneficio**: Facilita la legibilidad del código y evita efectos colaterales al modificarlo.

**Fundamentos**:
- El SRP se basa en el concepto de alta cohesión, donde todos los elementos de una clase están relacionados con una única funcionalidad. Esto reduce el acoplamiento entre clases y mejora la reutilización del código.
- Para evaluar si se viola SRP, pregúntate: "¿Cuántas razones hay para cambiar esta clase?". Si son más de una (por ejemplo, cambios en lógica de negocio y en persistencia de datos), divide la clase.
- En la práctica, aplica SRP usando patrones como el Command o separando capas (por ejemplo, MVC: Model-View-Controller).
- Importancia para exámenes: Entiende que SRP previene el "God Object" (clases que lo hacen todo), lo que facilita las pruebas unitarias y el mantenimiento a largo plazo.

### 2. Principio Abierto/Cerrado (OCP)
"Las entidades de software deben estar abiertas a extensión, pero cerradas a modificación".

Se debe poder agregar nuevas funcionalidades al sistema sin modificar el código existente. Esto se logra mediante el uso de herencia, interfaces o composición. No debe modificarse la clase base.

**Ejemplo Teórico**: Un sistema de pagos que soporta tarjeta y PayPal. En lugar de modificar la clase ProcesadorPagos cada vez que se añade un nuevo método de pago, se define una interfaz MetodoPago y se crean nuevas clases (PagoTarjeta, PagoPayPal, PagoYape) que implementan dicha interfaz.

**Beneficio**: Evita romper funcionalidades existentes al introducir cambios.

**Fundamentos**:
- OCP promueve el polimorfismo y la abstracción, permitiendo extender el comportamiento a través de subclases o implementaciones sin alterar el código base.
- Fundamento clave: Usa interfaces o clases abstractas para definir contratos estables. Por ejemplo, en Java o C#, implementa interfaces para plugins o extensiones.
- Violación común: Usar condicionales (if-else) para manejar nuevos casos; en su lugar, usa Strategy Pattern o Factory Pattern.
- Para exámenes: Recuerda que OCP facilita la escalabilidad en sistemas grandes, como frameworks (ej. Spring), donde se extienden componentes sin modificar el núcleo.

### 3. Principio de Sustitución de Liskov (LSP)
"Los objetos de una clase derivada deben poder sustituir a los de su clase base sin alterar el comportamiento esperado".

Una subclase debe ser totalmente compatible con la clase padre. Si una clase hija rompe las expectativas del padre, se viola este principio. Separar las implementaciones de las clases derivadas, deben ser sustituibles sin alterar la función principal.

**Ejemplo**: Si la clase Ave tiene un método volar(), pero creamos una subclase Pinguino que no vuela, estamos violando LSP. Una mejor solución sería tener una jerarquía distinta: AveVoladora y AveNoVoladora.

**Beneficio**: Garantiza la consistencia y la reutilización correcta de la herencia.

**Fundamentos**:
- LSP se deriva del concepto de subtipado comportamental: una subclase debe respetar las precondiciones (más débiles o iguales), postcondiciones (más fuertes o iguales) y invariantes de la superclase.    
- Fundamento matemático: Basado en el trabajo de Barbara Liskov sobre tipos de datos abstractos. Asegura que el polimorfismo funcione correctamente.    
- En práctica: Evita lanzar excepciones inesperadas en subclases o debilitar contratos. Usa Composition over Inheritance si la herencia no encaja perfectamente.    
- Para exámenes: Identifica violaciones en jerarquías de clases; por ejemplo, un Rectángulo como subclase de Cuadrado viola LSP porque cambiar el ancho no debería afectar la altura.
    

### 4. Principio de Segregación de Interfaces (ISP)
"Los clientes no deben verse obligados a depender de interfaces que no usan".

Es preferible crear interfaces pequeñas y específicas en lugar de interfaces grandes y genéricas. Esto evita que las clases implementen métodos innecesarios. Agrupados por clase o categoría, en función a la información de divide el modulo, cada modulo, qué tipo de información recibe o ingresa de otros módulos. 

**Ejemplo**: En lugar de una interfaz Trabajador con métodos programar(), diseñar(), testear(), es mejor tener interfaces separadas como Programador, Diseñador y Tester. Un Programador no debería estar obligado a implementar diseñar() si no lo necesita. Otro ejemplo es Word, esta dividido por clases/grupos de información

**Beneficio**: Reduce el acoplamiento y hace el sistema más flexible.

**Fundamentos**:
- ISP promueve interfaces cohesivas y con bajo acoplamiento, alineándose con el principio YAGNI (You Aren't Gonna Need It) para evitar código innecesario.    
- Fundamento: En lenguajes como Java, implementar interfaces grandes fuerza métodos vacíos (anti-patrón). Divide en interfaces role-based.    
- Aplicación: Usa en microservicios o APIs donde clientes solo necesitan partes específicas (ej. REST endpoints segregados).    
- Para exámenes: Contrasta con "fat interfaces"; ISP facilita el mocking en pruebas y reduce el impacto de cambios en interfaces.    

### 5. Principio de Inversión de Dependencia (DIP)
"Los módulos de alto nivel no deben depender de los de bajo nivel; ambos deben depender de abstracciones".

En lugar de depender de clases concretas, se debe depender de interfaces o abstracciones. De esta manera, se puede cambiar la implementación sin afectar a quien la usa. Facilita la flexibilidad y el cambio en la implementaciones futuras; si hay dependencia hay complicaciones en entornos de escalabilidad.

**Ejemplo**: Un ControladorNotificaciones no debería depender directamente de NotificacionEmail. Es mejor que dependa de una interfaz Notificacion. De esta manera, se puede usar NotificacionEmail, NotificacionSMS o NotificacionPush sin cambiar el controlador.

**Beneficio**: Facilita las pruebas (mocking) y hace el sistema más extensible.

**Fundamentos**:
- DIP invierte la dependencia tradicional: alto nivel define abstracciones, bajo nivel las implementa. Usa Inyección de Dependencias (DI) para resolver dependencias en runtime.    
- Fundamento: Basado en el Hollywood Principle ("Don't call us, we'll call you"). Herramientas como Spring DI o Dagger lo implementan.    
- En práctica: Evita new en código de alto nivel; usa factories o contenedores DI.    
- Para exámenes: Entiende que DIP decoupling permite cambiar proveedores (ej. base de datos) sin recompilar, mejorando la modularidad.    

## Resumen

- **SRP**: Una clase = una responsabilidad.    
- **OCP**: Abierto a extensión, cerrado a modificación.    
- **LSP**: Una subclase debe sustituir sin alterar comportamiento.    
- **ISP**: Interfaces pequeñas, no obligar a implementar lo innecesario.    
- **DIP**: Depender de abstracciones, no de implementaciones.


El modelo de calidad ISO/IEC 25010 es un estándar internacional que proporciona un marco para evaluar la calidad de un producto de software. Este modelo define características y subcaracterísticas de calidad que permiten medir y asegurar que un producto de software cumpla con los requisitos de los usuarios, aportando valor y satisfaciendo necesidades específicas en términos de funcionalidad, rendimiento, seguridad, mantenibilidad, entre otros. Es ampliamente utilizado en la industria para garantizar que los productos de software sean robustos, eficientes y adecuados para su propósito.

El modelo categoriza la calidad del software en nueve características principales, cada una con subcaracterísticas que detallan aspectos específicos de la calidad. Este estándar es esencial para desarrolladores, evaluadores y partes interesadas en el ciclo de vida del software, ya que proporciona una guía clara para evaluar y mejorar la calidad del producto.

El modelo ISO/IEC 25010 identifica nueve características principales de calidad para un producto de software:

1. Adecuación Funcional
2. Eficiencia de Desempeño
3. Compatibilidad
4. Capacidad de Interacción
5. Fiabilidad
6. Seguridad
7. Mantenibilidad
8. Flexibilidad
9. Protección

### 1. Adecuación Funcional
Representa la capacidad del producto de software para proporcionar funciones que satisfacen las necesidades declaradas e implícitas de los usuarios bajo condiciones específicas.

**Importancia**: Es crucial porque asegura que el software cumple con los objetivos para los cuales fue diseñado, cubriendo todas las tareas requeridas por los usuarios de manera precisa y relevante.

**Subcaracterísticas**:
- **Completitud funcional**: Mide si el software cubre todas las funcionalidades necesarias para cumplir con las tareas y objetivos del usuario. Por ejemplo, una aplicación de contabilidad debe incluir todas las funciones necesarias para gestionar facturas, balances e informes financieros.
- **Corrección funcional**: Evalúa si el software proporciona resultados exactos y precisos. Por ejemplo, en una calculadora, los cálculos matemáticos deben ser correctos en todo momento.
- **Pertinencia funcional**: Determina si las funciones del software son adecuadas y relevantes para las tareas del usuario, evitando funcionalidades innecesarias que puedan complicar el uso.

**Fundamentos**:
- La adecuación funcional es la base para garantizar que el software es útil y relevante. Un software con alta completitud, corrección y pertinencia funcional reduce la necesidad de soluciones adicionales y mejora la satisfacción del usuario.
- Para evaluar esta característica, se pueden usar casos de prueba basados en requisitos funcionales y análisis de cobertura de requisitos.

### 2. Eficiencia de Desempeño
Se refiere al desempeño del software en términos de tiempo y uso eficiente de recursos (CPU, memoria, almacenamiento, energía) bajo condiciones específicas.

**Importancia**: Un software eficiente garantiza una experiencia de usuario fluida y un uso óptimo de los recursos del sistema, lo que es crítico en aplicaciones que manejan grandes volúmenes de datos o requieren alta velocidad.

**Subcaracterísticas**:
- **Comportamiento temporal**: Evalúa el tiempo de respuesta y el rendimiento del software. Por ejemplo, una aplicación web debe cargar páginas en un tiempo aceptable para el usuario.
- **Utilización de recursos**: Mide si el software utiliza los recursos (como memoria o CPU) dentro de los límites establecidos. Por ejemplo, una aplicación móvil debe minimizar el consumo de batería.
- **Capacidad**: Verifica si el software puede manejar los límites máximos especificados, como el número de usuarios concurrentes o el volumen de datos procesados.

**Fundamentos**:
- La eficiencia de desempeño es especialmente importante en sistemas con alta demanda, como servidores web o aplicaciones en tiempo real. Métricas como el tiempo de respuesta, el uso de CPU y la escalabilidad son clave para evaluar esta característica.
- Se pueden realizar pruebas de carga y estrés para medir el comportamiento del software bajo diferentes condiciones.

### 3. Compatibilidad
Es la capacidad del software para intercambiar información con otros sistemas y operar en un entorno compartido sin conflictos.

**Importancia**: La compatibilidad permite que el software funcione en ecosistemas tecnológicos complejos, asegurando la interoperabilidad con otros sistemas y la coexistencia con otras aplicaciones.

**Subcaracterísticas**:
- **Coexistencia**: Capacidad del software para operar junto a otros programas en un entorno común sin interferencias. Por ejemplo, un editor de texto debe funcionar sin conflictos con un navegador web en el mismo sistema.
- **Interoperabilidad**: Capacidad de intercambiar datos con otros sistemas y utilizarlos correctamente. Por ejemplo, un sistema de gestión de bases de datos debe ser compatible con formatos estándar como SQL.

**Fundamentos**:
- La compatibilidad es esencial en entornos heterogéneos donde múltiples sistemas deben trabajar juntos. Estándares como JSON, XML o protocolos como REST facilitan la interoperabilidad.
- Las pruebas de compatibilidad incluyen la verificación del software en diferentes sistemas operativos, dispositivos y configuraciones.

### 4. Capacidad de Interacción
Representa la capacidad del software para permitir al usuario interactuar de manera efectiva y eficiente a través de su interfaz.

**Importancia**: Una buena capacidad de interacción mejora la experiencia del usuario, facilita el aprendizaje y asegura que el software sea accesible para una amplia variedad de usuarios.

**Subcaracterísticas**:
- **Reconocibilidad de la adecuación**: Permite al usuario determinar rápidamente si el software es adecuado para sus necesidades.
- **Aprendizabilidad**: Facilita que los usuarios aprendan a usar el software en un tiempo razonable.
- **Operabilidad**: Permite al usuario controlar el software con facilidad.
- **Protección contra errores de usuario**: Previene errores causados por el usuario, como la validación de entradas incorrectas.
- **Involucración del usuario**: Hace que la interacción con el software sea atractiva y motivadora.
- **Inclusividad**: Asegura que el software sea accesible para usuarios con diferentes características (edad, habilidades, cultura, etc.).
- **Asistencia al usuario**: Proporciona soporte claro, como guías o mensajes de ayuda.
- **Auto-descriptividad**: Presenta información clara para que el uso del software sea intuitivo sin necesidad de documentación externa.

**Fundamentos**:
- La capacidad de interacción está directamente relacionada con la usabilidad del software. Un diseño de interfaz centrado en el usuario, pruebas de usabilidad y el cumplimiento de estándares de accesibilidad (como WCAG) son fundamentales para evaluar esta característica.
- Ejemplo: Un software inclusivo debe incluir opciones como subtítulos para usuarios con discapacidades auditivas o modos de alto contraste para usuarios con discapacidades visuales.

### 5. Fiabilidad
Es la capacidad del software para realizar sus funciones sin fallos bajo condiciones específicas durante un período determinado.

**Importancia**: La fiabilidad es crítica en sistemas donde los fallos pueden tener consecuencias graves, como en aplicaciones médicas o sistemas de control de tráfico.

**Subcaracterísticas**:
- **Ausencia de fallos**: Capacidad de operar sin errores en condiciones normales.
- **Disponibilidad**: Garantiza que el software esté operativo cuando se necesita.
- **Tolerancia a fallos**: Permite que el software continúe funcionando correctamente incluso si ocurre un fallo.
- **Capacidad de recuperación**: Permite al software restaurar datos y volver a un estado operativo tras una interrupción.

**Fundamentos**:
- La fiabilidad se mide mediante métricas como el tiempo medio entre fallos (MTBF) y el tiempo medio para recuperación (MTTR). Pruebas como las de estrés y recuperación son esenciales para evaluar esta característica.
- Ejemplo: Un sistema bancario debe garantizar alta disponibilidad y capacidad de recuperación para evitar pérdidas de datos durante transacciones.

### 6. Seguridad
Es la capacidad del software para proteger la información y los datos, garantizando acceso solo a usuarios autorizados y protegiendo contra ataques maliciosos.

**Importancia**: La seguridad es fundamental en un mundo donde las amenazas cibernéticas son comunes, especialmente en aplicaciones que manejan datos sensibles.

**Subcaracterísticas**:
- **Confidencialidad**: Asegura que los datos solo sean accesibles para usuarios autorizados.
- **Integridad**: Protege los datos contra modificaciones o eliminaciones no autorizadas.
- **No repudio**: Garantiza que las acciones realizadas no puedan ser negadas.
- **Responsabilidad**: Permite rastrear las acciones de los usuarios de manera inequívoca.
- **Autenticidad**: Verifica la identidad de los usuarios o recursos.
- **Resistencia**: Mantiene la operación bajo ataques maliciosos.

**Fundamentos**:
- La seguridad se basa en principios como el cifrado, la autenticación multifactor y el control de acceso. Normas como ISO/IEC 27001 complementan este aspecto del estándar.
- Ejemplo: Un sistema de comercio electrónico debe implementar HTTPS y autenticación robusta para proteger los datos de los usuarios.

### 7. Mantenibilidad
Representa la capacidad del software para ser modificado de manera efectiva y eficiente para corregir defectos, mejorar el rendimiento o adaptarse a nuevos requisitos.

**Importancia**: Un software mantenible reduce los costos y el tiempo necesario para actualizaciones o correcciones, prolongando su ciclo de vida.

**Subcaracterísticas**:
- **Modularidad**: Minimiza el impacto de los cambios en un componente sobre otros.
- **Reusabilidad**: Permite que componentes del software sean utilizados en otros sistemas.
- **Analizabilidad**: Facilita el diagnóstico de problemas y la evaluación de cambios.
- **Capacidad para ser modificado**: Permite realizar cambios sin introducir defectos.
- **Capacidad para ser probado**: Facilita la creación y ejecución de pruebas.

**Fundamentos**:
- La mantenibilidad depende de un diseño modular y bien documentado. Técnicas como el diseño orientado a objetos y las pruebas unitarias mejoran esta característica.
- Ejemplo: Un software con alta modularidad permite actualizar un módulo de autenticación sin afectar el resto del sistema.

### 8. Flexibilidad
Es la capacidad del software para adaptarse a cambios en los requisitos, entornos o contextos de uso.

**Importancia**: La flexibilidad asegura que el software pueda evolucionar con los cambios tecnológicos o las necesidades del usuario, prolongando su utilidad.

**Subcaracterísticas**:

- **Adaptabilidad**: Permite al software operar en diferentes entornos (hardware, software, etc.).
- **Escalabilidad**: Gestiona cargas de trabajo variables, como un aumento en el número de usuarios.
- **Instalabilidad**: Facilita la instalación o desinstalación del software.
- **Reemplazabilidad**: Permite que el software sustituya a otro en el mismo entorno.

**Fundamentos**:

- La flexibilidad es clave en entornos dinámicos, como aplicaciones en la nube. Técnicas como la virtualización y el diseño basado en microservicios mejoran esta característica.
- Ejemplo: Un software escalable puede manejar un aumento repentino de usuarios durante un evento en línea.

### 9. Protección
Es la capacidad del software para evitar riesgos que pongan en peligro la vida humana, la salud, la propiedad o el medio ambiente.

**Importancia**: Esta característica es crucial en sistemas críticos, como los utilizados en la industria médica, automotriz o aeroespacial, donde los fallos pueden tener consecuencias graves.

**Subcaracterísticas**:

- **Restricción operativa**: Limita el funcionamiento del software a estados seguros.
- **Identificación de riesgos**: Detecta situaciones que puedan generar riesgos inaceptables.
- **Protección ante fallos**: Permite al software entrar en un modo seguro tras un fallo.
- **Advertencia de peligro**: Alerta a los usuarios sobre riesgos para que puedan reaccionar a tiempo.
- **Integración segura**: Mantiene la seguridad durante la integración con otros componentes.

**Fundamentos**:

- La protección se evalúa mediante análisis de riesgos y pruebas de seguridad funcional. Estándares como ISO 26262 (para sistemas automotrices) son relevantes para esta característica.
- Ejemplo: Un sistema de control de tráfico aéreo debe identificar riesgos y alertar a los operadores para evitar colisiones.



![[Pasted image 20250824205253.png]]