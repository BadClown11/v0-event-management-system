# Sistema de Gestion de Eventos - Version HTML/CSS/JS

Esta es la version en HTML, CSS y JavaScript puro del sistema de gestion de eventos, lista para usar con .NET.

## Archivos

- `index.html` - Pagina principal
- `styles.css` - Estilos personalizados
- `app.js` - Logica JavaScript

## Librerias CDN Utilizadas

- **Tailwind CSS** - Framework CSS utility-first
- **Lucide Icons** - Iconos SVG
- **date-fns** - Formato de fechas (incluye locale espanol)
- **Inter Font** - Tipografia (Google Fonts)

## Uso con .NET

### Opcion 1: Archivos Estaticos
Coloca los archivos en la carpeta `wwwroot` de tu proyecto .NET:

```
wwwroot/
  ├── index.html
  ├── styles.css
  └── app.js
```

### Opcion 2: Razor Pages / MVC
Puedes integrar el contenido HTML en tus vistas Razor:

1. Copia el contenido del `<head>` a tu `_Layout.cshtml`
2. Usa el HTML del `<body>` en tus vistas
3. Incluye `styles.css` y `app.js` como archivos estaticos

### Ejemplo con ASP.NET Core

```csharp
// Program.cs
app.UseStaticFiles();
app.MapFallbackToFile("index.html");
```

## Personalizacion

### Colores
Los colores se definen en el script de configuracion de Tailwind en `index.html`. 
Puedes modificarlos segun tu paleta de colores.

### Datos
Los datos de ejemplo estan en el archivo `app.js` en el array `mockEvents`. 
Para conectar con tu backend .NET:

1. Reemplaza `mockEvents` con llamadas fetch a tu API
2. Modifica las funciones de guardar/eliminar para hacer POST/DELETE a tu API

### Ejemplo de integracion con API .NET

```javascript
// Obtener eventos desde API
async function fetchEvents() {
  const response = await fetch('/api/events');
  const events = await response.json();
  return events;
}

// Guardar rifa
async function saveRaffleToAPI(raffle) {
  const response = await fetch('/api/raffles', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(raffle)
  });
  return response.json();
}
```

## Funcionalidades

- Listado de eventos abiertos y cerrados
- Busqueda por nombre
- Filtro por fecha
- Modal de detalle de evento
- Gestion de rifas (CRUD)
- Formulario wizard de 4 pasos
- Edicion inline en tabla
- Copiar/pegar filas (compatible con Excel)
- Notificaciones toast

## Compatibilidad

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+
