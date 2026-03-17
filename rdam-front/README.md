# 🚀 RDAM Frontend - Sistema de Gestión de Trámites

Este es el frontend del sistema **RDAM**, desarrollado con **React + Vite**. La aplicación permite a los ciudadanos solicitar certificados mediante validación por correo electrónico y a los operadores gestionar dichas solicitudes.

## 🛠️ Tecnologías Utilizadas

* **React 20** (Hooks, Context, Router)
* **Vite** (Build tool ultra rápido)
* **Axios** (Peticiones HTTP)
* **Google ReCAPTCHA** (Seguridad en formularios)
* **Docker** (Containerización)

---

## 📦 Instalación y Setup

### Requisitos Previos
* [Docker](https://www.docker.com/) y Docker Desktop instalado.
* El backend de RDAM corriendo (por defecto en el puerto `8000`).

### Corriendo con Docker (Recomendado)

Para levantar el entorno de desarrollo con **Hot Reload** (refresco automático) activado:

1.  Asegúrate de estar en la raíz del proyecto.
2.  Ejecuta el siguiente comando:
    ```bash
    docker compose up --build
    ```
3.  La aplicación estará disponible en: `http://localhost:5173`

---

## 🎨 Características Principales

### 👤 Flujo del Ciudadano (`/citizen`)
* **Validación de Identidad:** Ingreso de email + ReCAPTCHA.
* **Código de Seguridad:** Validación por código de 6 dígitos.
* **Sesión Temporizada:** El formulario expira a los **15 minutos** por seguridad, redirigiendo al inicio.
* **Formulario de Trámite:** Carga de datos personales y creación de solicitud.

### 👷 Panel del Operador (`/operador`)
* **Gestión en Tiempo Real:** Visualización de trámites con estados dinámicos.
* **Filtros Avanzados:** Búsqueda por CUIL, Estado (Pendiente, Pagada, Rechazada, Emitida) y Fecha.
* **Acciones Rápidas:**
    * `Rechazar`: Cambia el estado a RECHAZADA.
    * `Emitir Certificado`: Genera el documento final para trámites pagados.
* **Optimistic UI:** Los cambios se reflejan en la tabla instantáneamente antes de confirmar con el servidor.

---

## 📂 Estructura del Proyecto

```text
src/
 ├── components/   
 ├── App.jsx         # Enrutamiento principal
 └── main.jsx        # Punto de entrada