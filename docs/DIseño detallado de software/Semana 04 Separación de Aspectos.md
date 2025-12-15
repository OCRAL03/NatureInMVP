# 

Separación de Aspectos

## 

Introducción

La "separación de aspectos" es un principio fundamental en el diseño de software que busca organizar el código de manera que las diferentes responsabilidades o preocupaciones del sistema estén aisladas. Esto facilita el mantenimiento, la extensibilidad y la reutilización del código.

## 

Técnicas Comunes para la Separación de Aspectos

-   
    

Modularidad: Dividir el código en módulos independientes que encapsulan funciones relacionadas. Cada módulo tiene una única responsabilidad y se comunica con otros a través de interfaces bien definidas.

- Patrones de Diseño:
    
- MVC (Model-View-Controller): Divide una aplicación en tres componentes principales:
    
- Modelo: Gestiona los datos y la lógica relacionada con los datos.
    
- Vista: Se encarga de la interfaz de usuario y la presentación de los datos.
    
- Controlador: Actúa como intermediario entre el Modelo y la Vista, manejando la lógica de negocio y las interacciones del usuario.
    
-   
    

Inyección de Dependencias: Permite que las dependencias de una clase sean gestionadas externamente en lugar de que la clase las cree directamente. Esto promueve la separación de la lógica de control de dependencias de la lógica de negocio.

-   
    

Programación Orientada a Aspectos (AOP): Permite separar comportamientos transversales (como logging, seguridad, gestión de transacciones) del código principal de la aplicación. Se crean "aspectos" que interceptan o decoran comportamientos específicos.

-   
    

Capas: Separar el software en capas (ej. capa de presentación, capa de negocio, capa de datos). Cada capa tiene una función específica y no debe conocer los detalles de las demás, facilitando el desacoplamiento.

## 

Ejemplos de Separación de Aspectos

### 

MVC en PHP

// Modelo - User.php
class User {
    public $name;
    public $email;

    public function __construct($name, $email) {
        $this->name = $name;
        $this->email = $email;
    }

    public static function getAllUsers() {
        return [
            new User("John Doe", "john@example.com"),
            new User("Jane Smith", "jane@example.com")
        ];
    }
}

// Vista - usersView.php
function renderUsers($users) {
    foreach ($users as $user) {
        echo "<p>{$user->name} - {$user->email}</p>";
    }
}

// Controlador - UsersController.php
require 'User.php';
require 'usersView.php';

class UsersController {
    public function showUsers() {
        $users = User::getAllUsers();
        renderUsers($users);
    }
}

// Uso
$controller = new UsersController();
$controller->showUsers();

### 

Inyección de Dependencias en Java

// Servicio de email
public class EmailService {
    public void sendEmail(String message, String receiver) {
        System.out.println("Sending email to " + receiver + " with message: " + message);
    }
}

// Cliente que usa el servicio de email
public class MyApplication {
    private EmailService emailService;

    // Inyectamos la dependencia a través del constructor
    public MyApplication(EmailService emailService) {
        this.emailService = emailService;
    }

    public void processMessage(String message, String receiver) {
        this.emailService.sendEmail(message, receiver);
    }
}

// Main
public class Main {
    public static void main(String[] args) {
        // Creamos la dependencia externamente
        EmailService emailService = new EmailService();
        // Inyectamos la dependencia al cliente
        MyApplication app = new MyApplication(emailService);
        app.processMessage("Hello World!", "john@example.com");
    }
}

### 

Programación Orientada a Aspectos (AOP) en Spring (Java)

// Aspecto de logging
@Aspect
public class LoggingAspect {
    @Before("execution(* com.example.service.*.*(..))")
    public void logBefore(JoinPoint joinPoint) {
        System.out.println("Before method: " + joinPoint.getSignature().getName());
    }

    @After("execution(* com.example.service.*.*(..))")
    public void logAfter(JoinPoint joinPoint) {
        System.out.println("After method: " + joinPoint.getSignature().getName());
    }
}

// Servicio de ejemplo
@Service
public class UserService {
    public void createUser(String name) {
        System.out.println("Creating user: " + name);
    }
}

// Main
public class MainApp {
    public static void main(String[] args) {
        ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
        UserService userService = context.getBean(UserService.class);
        userService.createUser("John Doe");
    }
}

### 

Capas en Node.js

// Capa de datos (userRepository.js)
class UserRepository {
    constructor() {
        this.users = [{id: 1, name: 'John Doe'}];
    }

    getAllUsers() {
        return this.users;
    }
}

// Capa de servicio (userService.js)
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    getUsers() {
        return this.userRepository.getAllUsers();
    }
}

// Capa de controladores (userController.js)
class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    getUsers(req, res) {
        const users = this.userService.getUsers();
        res.json(users);
    }
}

// Uso en una aplicación Express (app.js)
const express = require('express');
const app = express();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

app.get('/users', (req, res) => userController.getUsers(req, res));

app.listen(3000, () => console.log('Server running on port 3000'));

### 

MVC en Python con Flask

# Modelo - models.py
class User:
    def __init__(self, name, email):
        self.name = name
        self.email = email

    @staticmethod
    def get_all_users():
        return [
            User("John Doe", "john@example.com"),
            User("Jane Smith", "jane@example.com")
        ]

# Vista - views.py
def render_users(users):
    users_list = ""
    for user in users:
        users_list += f"<p>{user.name} - {user.email}</p>"
    return users_list

# Controlador - controllers.py
from flask import Flask
from models import User
from views import render_users

app = Flask(__name__)

@app.route('/users')
def show_users():
    users = User.get_all_users()
    return render_users(users)

if __name__ == '__main__':
    app.run(debug=True)

### 

Inyección de Dependencias en Python

# Servicio de notificaciones - email_service.py
class EmailService:
    def send_email(self, message, receiver):
        print(f"Sending email to {receiver}: {message}")

# Aplicación principal - my_application.py
class MyApplication:
    def __init__(self, email_service):
        self.email_service = email_service

    def process_message(self, message, receiver):
        self.email_service.send_email(message, receiver)

# Main
if __name__ == '__main__':
    email_service = EmailService()
    app = MyApplication(email_service)
    app.process_message("Hello World!", "john@example.com")

### 

Organización en capas en Python

# Capa de datos - user_repository.py
class UserRepository:
    def __init__(self):
        self.users = [{'id': 1, 'name': 'John Doe'}]

    def get_all_users(self):
        return self.users

# Capa de servicio - user_service.py
class UserService:
    def __init__(self, user_repository):
        self.user_repository = user_repository

    def get_users(self):
        return self.user_repository.get_all_users()

# Capa de presentación - user_controller.py
class UserController:
    def __init__(self, user_service):
        self.user_service = user_service

    def show_users(self):
        users = self.user_service.get_users()
        for user in users:
            print(f"User: {user['name']}")

# Main
if __name__ == '__main__':
    user_repository = UserRepository()
    user_service = UserService(user_repository)
    user_controller = UserController(user_service)
    user_controller.show_users()

### 

Separación de funcionalidades transversales (Logging) con Decoradores en Python

# Decorador de logging - logging_decorator.py
def log_decorator(func):
    def wrapper(*args, **kwargs):
        print(f"Llamando a {func.__name__} con {args} y {kwargs}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} terminó con el resultado: {result}")
        return result
    return wrapper

# Servicio de negocio - business_service.py
@log_decorator
def add_numbers(a, b):
    return a + b

# Main
if __name__ == '__main__':
    result = add_numbers(5, 7)
    print(f"Resultado: {result}")

### 

Separación de tareas con Django (Framework Web de Python)

-   
    

Modelo (models.py)

from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()

    def __str__(self):
        return self.name

-   
    

Vista (views.py)

from django.shortcuts import render
from .models import User

def show_users(request):
    users = User.objects.all()
    return render(request, 'users.html', {'users': users})

-   
    

Plantilla (users.html)

<!DOCTYPE html>
<html>
<head>
    <title>Users</title>
</head>
<body>
    <h1>List of Users</h1>
    <ul>
        {% for user in users %}
            <li>{{ user.name }} - {{ user.email }}</li>
        {% endfor %}
    </ul>
</body>
</html>