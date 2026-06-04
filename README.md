# 📦 Portal de Gestión de Productos Financieros

¡Hola! 👋 Bienvenido a este proyecto. 

El proyecto es una aplicación web moderna construida con el framework **Angular**, para gestionar productos financieros de forma rápida y sencilla (CRUD).

---

## 🏗️ ¿Cómo está construido?

El código fue pensando para ser fácil de leer, mantener y escalar a futuro. 

Se implementó:

* Clean Architecture & DDD (Domain-Driven Design)
* Componentes Smart / Dumb
* Estado Reactivo con Signals
* Systema de diseño basado en SASS

### 📂 Estructura de Carpetas

```text
src/app/
├── core/         # Configuraciones globales de la app (servicios e interceptores).
├── shared/       # Todo lo que reutilizamos (botones, tablas, modales y utilidades).
└── domains/      # ¡El corazón de la app! Dividido por contextos de negocio.
    └── products/
        ├── data-access/  # Donde nos conectamos con el servidor (APIs y Mappers).
        ├── domain/       # Nuestras reglas de negocio puras y el estado reactivo (SignalStore).
        ├── feature/      # Las páginas "inteligentes" que controlan la lógica.
        └── ui/           # Los componentes "tontos" que solo se dedican a mostrarse bonitos.
```

## 🛠️ Tecnologías Principales

* **Framework:** Angular 21 (Standalone components y mucha reactividad con Signals).
* **Estilos:** CSS puro potenciado con **Sass**, usando metodología **BEM** y un sistema de diseño.
* **Testing:** Usamos **Vitest** y **Angular Testing Library** enfocándonos siempre en el usuario final.
* **Documentación UI:** **Storybook** para construir y visualizar los componentes de forma aislada.

---

## 🚀 ¡Pruébala!

Para empezar, asegúrate de tener Node.js instalado. Clona el repositorio y baja las dependencias:
```bash
npm install
```

Para encender la aplicación y verla en `http://localhost:4200/`, ejecuta:
```bash
npm run start
```

¿Quieres revisar que todo esté funcionando perfecto? Corre los tests unitarios:
```bash
npm run test
```

¿Quieres revisar la cobertura de las pruebas? Corre los tests unitarios con coverage:
```bash
npm run test:coverage
```

Si te da curiosidad ver nuestro catálogo de componentes, ejecuta:
```bash
npm run storybook
```
