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

## 🌍 Entornos y Configuración

Si es necesario conectar la app a un propio backend o cambiar la URL del servidor, solo tienes que modificar el archivo `src/environments/environment.ts`:

```typescript
export const environment = {
  BASE_URL: '/api', // Pon aquí la URL de tu API (ej. 'http://localhost:3000/api')
  production: false,
};
```

### 🔀 Un pequeño secreto sobre `/api` (Proxy y CORS)

Si te preguntas por qué por defecto usamos `/api` en lugar de una URL completa, la respuesta es simple: **¡Evitar sufrir con los CORS!**.

Para evitar bloqueos de seguridad en tu navegador mientras desarrollas en local, la app tiene un proxy (`proxy.conf.json`). Básicamente, Angular hace la magia de interceptar todo lo que vaya a `/api` y lo envía por debajo a `http://localhost:3002/bp`. 

Para subir esto a producción o usar una API externa directa sin proxy, solo cambia la variable `BASE_URL` por tu ruta absoluta y listo.

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
