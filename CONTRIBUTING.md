# Guía de Contribución - Pomodoro 🍅

¡Gracias por tu interés en contribuir a **Pomodoro - Obsidian Glass**! Este proyecto utiliza una arquitectura rigurosa para mantener el código limpio, testable y escalable. Por favor, sigue estas pautas para que tus contribuciones sean aceptadas rápidamente.

---

## 🏗️ Nuestra Arquitectura (Hexagonal / Clean)

El proyecto se divide en capas con responsabilidades muy específicas. **No rompas la regla de dependencia**: las capas internas nunca deben depender de las externas.

```text
src/
 ├── domain/          (Interior) Reglas de negocio puras. Sin dependencias externas.
 ├── application/     (Interior) Casos de uso y estado global (Zustand).
 ├── infrastructure/  (Exterior) Implementación nativa, bases de datos y servicios.
 └── presentation/    (Exterior) UI, Navegación y Sistema de Diseño.
```

- **¿Quieres añadir una función al cronómetro?** Ve a `src/domain/timer/logic.ts`.
- **¿Quieres añadir un nuevo color o fuente?** Ve a `src/presentation/theme/`.
- **¿Quieres añadir un servicio nativo de Android?** Ve a `src/infrastructure/adapters/` y define su puerto (interfaz) en `domain`.

---

## 🛠️ Entorno de Desarrollo

1.  **Instalación**: `npm install`.
2.  **Linting**: `npm run lint`. Por favor, resuelve todos los warnings antes de enviar un PR.
3.  **Tipado**: `npm run type-check`. No aceptamos archivos `.ts` con errores de compilación o uso excesivo de `any`.
4.  **Tests**: `npm test`. Mantener la cobertura es una prioridad absoluta (actualmente **99%+**).

---

## 📨 Proceso de Pull Request

1.  **Crea una rama descriptiva**: `feature/nueva-funcionalidad`, `fix/error-notificacion` o `refactor/mejorar-capa-app`.
2.  **Escribe tests**: Si añades lógica de negocio o un nuevo adaptador, debe venir acompañado de sus tests en Jest.
3.  **Verificación Pre-vuelo**: Antes de subir tus cambios, asegúrate de que todo pase ejecutando localmente:
    ```bash
    npm run lint && npm run type-check && npm test
    ```
4.  **Abre el PR**: Describe claramente los cambios y proporciona capturas de pantalla si hay cambios en la UI.

---

## 🎨 Sistema de Diseño

Usamos una estética **Obsidian Glass**. Si añades nuevos componentes:
- Utiliza el hook `useTheme()` de `@theme`.
- Asegúrate de que soporten tanto **Dark Mode** como **Light Mode**.
- Mantén el uso de `GlassCard` para la consistencia visual.

---

¡Feliz codificación! Juntos haremos de Pomodoro la herramienta de productividad más sólida del ecosistema.
