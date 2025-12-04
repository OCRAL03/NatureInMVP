# Diseño de Software: Abstracción, Acoplamiento, Cohesión, Descomposición, Modularidad y Encapsulamiento

## Abstracción

La abstracción es el proceso de ocultar los detalles complejos de la implementación y mostrar solo lo esencial. Se trata de identificar los aspectos clave de un objeto o función, dejando de lado los detalles irrelevantes para el contexto actual.

En POO: Se implementa mediante interfaces o clases abstractas que definen un contrato sin especificar completamente la implementación.

Ejemplo (Python):

from abc import ABC, abstractmethod

# Clase abstracta (interfaz)
class Vehicle (ABC):
    @abstractmethod
    def move(self):
        pass

# Clases concretas
class Car (Vehicle):
    def move(self):
        print("El coche se mueve por carretera")

class Boat (Vehicle):
    def move(self):
        print("El barco navega en el agua")

# Uso
vehicles = [Car(), Boat()]
for v in vehicles:
    v.move()

Beneficio: El usuario solo sabe que un Vehicle puede moverse, sin importar cómo lo hace cada clase.

## Acoplamiento

El acoplamiento se refiere al grado de dependencia entre diferentes módulos o componentes de un sistema.

Alto Acoplamiento: Módulos que dependen mucho unos de otros, dificultando el mantenimiento y la evolución.

Bajo Acoplamiento: Módulos lo más independientes posible, facilitando cambios en un módulo sin afectar a los demás.

Ejemplo de Alto Acoplamiento (Python):

class MySQLDatabase:
    def connect(self):
        print("Conectado a MySQL")

class App:
    def __init__(self):
        self.db = MySQLDatabase() # App depende directamente de MySQL

Ejemplo de Bajo Acoplamiento (Python):

from abc import ABC, abstractmethod

class Database(ABC):
    @abstractmethod
    def connect(self):
        pass

class MySQLDatabase(Database):
    def connect(self):
        print("Conectado a MySQL")

class PostgreSQLDatabase(Database):
    def connect(self):
        print("Conectado a PostgreSQL")

class App:
    def __init__(self, db: Database):
        self.db = db

    def run(self):
        self.db.connect()

# Uso
app = App(PostgreSQLDatabase())
app.run()


Beneficio: App no depende de un motor específico; podemos cambiar MySQL por PostgreSQL sin modificar la clase App.

## Cohesión

La cohesión mide cuán estrechamente relacionadas están las responsabilidades dentro de un módulo o clase.


Alta Cohesión: Un módulo se enfoca en realizar una única tarea o un conjunto estrechamente relacionado de tareas. Deseable para reutilización y mantenimiento.

-   
    

Baja Cohesión: Un módulo realiza múltiples tareas no relacionadas, dificultando su entendimiento y mantenimiento.

-   
    

Ejemplo de Baja Cohesión (PHP):

class Utility {
    public function sendEmail($message) {
        // Código para enviar un email
    }

    public function logToFile($message) {
        // Código para registrar en un archivo
    }

    public function calculateSum($a, $b) {
        return $a+$b;
    }
}

-   
    

Ejemplo de Alta Cohesión (PHP):

class EmailService {
    public function sendEmail($message) {
        // Código para enviar un email
    }
}

class LogService {
    public function logToFile($message) {
        // Código para registrar en un archivo
    }
}

class MathService {
    public function calculateSum($a, $b) {
        return $a+ $b;
    }
}

-   
    

Ejemplo de Baja Cohesión (Python):

class Order:
    def add_item(self, item): pass
    def calculate_total(self): pass
    def connect_db(self): pass
    def send_email(self): pass

-   
    

Ejemplo de Alta Cohesión (Python):

class Order:
    def __init__(self):
        self.items = []
    def add_item(self, item, price):
        self.items.append((item, price))
    def total(self):
        return sum(price for item, price in self.items)

class OrderRepository:
    def save(self, order: Order):
        print("Guardando pedido en la base de datos")

class EmailService:
    def send_confirmation(self, order: Order):
        print(f"Enviando email de confirmación por ${order.total()}")

- Beneficio:
    
- Order solo gestiona el pedido.
    
- OrderRepository se encarga de la persistencia.
    
- EmailService maneja notificaciones.
    

## 

Descomposición

La descomposición se refiere al proceso de dividir un sistema grande y complejo en partes más pequeñas y manejables. Cada parte puede ser entendida, desarrollada y modificada independientemente.

-   
    

Ejemplo (Python) Sin Descomposición:

def procesar_pedido():
    print("Validando pedido...")
    print("Calculando total...")
    print("Procesando pago...")
    print("Enviando confirmación...")

procesar_pedido()

-   
    

Ejemplo (Python) Con Descomposición:

def validar_pedido():
    print("Validando pedido...")

def calcular_total(items):
    return sum(items)

def procesar_pago(total):
    print(f"Procesando pago de ${total}")

def enviar_confirmacion():
    print("Enviando confirmación...")

def procesar_pedido(items):
    validar_pedido()
    total = calcular_total(items)
    procesar_pago(total)
    enviar_confirmacion()

procesar_pedido([100, 200, 50])

-   
    

Beneficio: Más fácil de leer, probar y reutilizar.

## 

Modularidad

La modularidad es el resultado de la descomposición, donde el sistema se organiza en módulos independientes. Estos módulos deben ser auto-contenidos, minimizando las dependencias con otros módulos.

-   
    

Ejemplo de estructura (Python):

ecommerce/
    main.py
    order.py
    payment.py
    email.py

-   
    

Contenido de order.py:

class Order:
    def __init__(self):
        self.items = []
    def add_item(self, name, price):
        self.items.append((name, price))
    def total(self):
        return sum(price for name, price in self.items)

-   
    

Contenido de payment.py:

def process_payment(amount):
    print(f"Procesando pago de ${amount}")

-   
    

Contenido de email.py:

def send_confirmation(total):
    print(f"Email enviado confirmando pago de ${total}")

-   
    

Contenido de main.py:

from order import Order
from payment import process_payment
from email import send_confirmation

order = Order()
order.add_item("Laptop", 1200)
order.add_item("Mouse", 50)
total = order.total()
process_payment(total)
send_confirmation(total)

-   
    

Beneficio: Cada módulo es independiente y fácil de mantener.

## 

Encapsulamiento

El encapsulamiento implica ocultar los detalles internos de un objeto y exponer sólo lo necesario para interactuar con él. Esto asegura que el estado interno de un objeto sólo pueda ser modificado a través de sus métodos públicos, protegiendo así la integridad del objeto.

-   
    

Ejemplo (Python):

class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner # público
        self._balance = balance # privado (name mangling)

    def deposit(self, amount):
        if amount > 0:
            self._balance += amount
            print(f"Depositado ${amount}, saldo: {self._balance}")

    def withdraw(self, amount):
        if amount <= self._balance:
            self._balance -= amount
            print(f"Retirado ${amount}, saldo: {self._balance}")
        else:
            print("Fondos insuficientes")

    def get_balance(self):
        return self._balance

# Uso
account = BankAccount("Ana", 1000)
account.deposit(500)
account.withdraw(300)
print("Saldo final: ", account.get_balance())
# Intento de acceso directo (no recomendado)
# print(account._balance) # Error

-   
    

Beneficio: Protege la integridad del objeto evitando acceso indebido.

## 

Resumen

- Abstracción: Oculta los detalles complejos y muestra solo lo esencial.
    
- Acoplamiento: Medida de dependencia entre módulos. Se busca bajo acoplamiento.
    
- Cohesión: Mide cuán relacionadas están las responsabilidades dentro de un módulo. Se busca alta cohesión.
    
- Descomposición: Dividir funciones grandes en pasos pequeños.
    
- Modularidad: Organizar el proyecto en módulos independientes.
    
- Encapsulamiento: Proteger atributos internos y exponer solo lo necesario.