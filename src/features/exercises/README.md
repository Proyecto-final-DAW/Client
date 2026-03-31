# ExerciseDB

## Flujo completo paso a paso

```
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND (React)                                               │
│                                                                 │
│  ┌──────────────────────────────────────────────────┐           │
│  │  ExerciseSearch.tsx                               │           │
│  │  ┌─────────────────────┐ ┌────────────────────┐  │           │
│  │  │ Input: "press"      │ │ Select: Pectorals ▼│  │           │
│  │  └─────────────────────┘ └────────────────────┘  │           │
│  │                                                   │           │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐    │           │
│  │  │ GIF    │ │ GIF    │ │ GIF    │ │ GIF    │    │           │
│  │  │ nombre │ │ nombre │ │ nombre │ │ nombre │    │           │
│  │  │ badges │ │ badges │ │ badges │ │ badges │    │           │
│  │  └────────┘ └────────┘ └────────┘ └────────┘    │           │
│  │                                                   │           │
│  │              [ Ver mas ]                          │           │
│  └──────────────────────────────────────────────────┘           │
│                        │                                        │
│  1. Usuario escribe o selecciona musculo                        │
│  2. useExerciseSearch espera 400ms (debounce)                   │
│  3. Cancela peticion anterior si existe (AbortController)       │
│  4. Llama a exerciseRepository.searchExercises()                │
│  5. APIExerciseRepository envia la peticion al servidor         │
└────────────────────────────┬────────────────────────────────────┘
                             │
           GET /exercises?search=press&muscle=pectorals&page=1&limit=10
           Authorization: Bearer <jwt>  (si esta logueado)
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND (Express)                                              │
│                                                                 │
│  routes/exercises.ts                                            │
│    GET /            → ExercisesController.search                │
│    GET /image/:id   → ExercisesController.image                 │
│                                                                 │
│  ExercisesController.search:                                    │
│    1. Lee query params: search, muscle, page, limit             │
│    2. Llama a exerciseService.searchExercises()                 │
│    3. Devuelve Exercise[] como JSON                             │
│                                                                 │
│  exercise.service.ts:                                           │
│    1. Comprueba cache (5 min TTL)                               │
│    2. Si no hay cache, llama a ExerciseDB API ──────────────┐   │
│    3. Mapea la respuesta a { id, name, target,              │   │
│       equipment, difficulty, imageUrl }                     │   │
│    4. imageUrl = "/exercises/image/{id}" (ruta local)        │   │
│    5. Aplica paginacion (page/limit) y devuelve              │   │
└──────────────────────────────────────────────────────────────┤───┘
                                                               │
            ┌──────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│  EXERCISEDB API (RapidAPI)                                      │
│                                                                 │
│  Headers requeridos:                                            │
│    x-rapidapi-key: <API_KEY>                                    │
│    x-rapidapi-host: exercisedb.p.rapidapi.com                   │
│                                                                 │
│  Endpoints que usa el servidor:                                 │
│                                                                 │
│  Solo search:                                                   │
│    GET /exercises/name/{search}?limit=N                         │
│                                                                 │
│  Solo muscle:                                                   │
│    GET /exercises/target/{muscle}?limit=N                       │
│                                                                 │
│  Ambos (search + muscle):                                       │
│    GET /exercises/name/{search}?limit=N    ┐                    │
│    GET /exercises/target/{muscle}?limit=N  ├ Promise.all        │
│    Interseccion por id                     ┘                    │
│                                                                 │
│  Imagenes:                                                      │
│    GET /image?exerciseId={id}&resolution=180&rapidapi-key=...   │
│    Devuelve GIF binario (image/gif)                             │
└─────────────────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────────────────┐
│  FLUJO DE IMAGENES                                              │
│                                                                 │
│  El servidor devuelve imageUrl: "/exercises/image/0025"         │
│  El cliente lo usa como:                                        │
│    <img src="http://localhost:3000/exercises/image/0025" />     │
│                                                                 │
│  Cuando el navegador pide esa imagen:                           │
│    1. ExercisesController.image recibe el id                    │
│    2. Comprueba cache de imagenes (30 min TTL)                  │
│    3. Si no hay cache, pide el GIF a ExerciseDB                 │
│    4. Devuelve el GIF al navegador (Content-Type: image/gif)    │
│    5. La API key nunca se expone al cliente                     │
└─────────────────────────────────────────────────────────────────┘
```

## Endpoints del servidor

### `GET /exercises` — Buscar ejercicios

| Param    | Tipo   | Default | Descripcion                    |
|----------|--------|---------|--------------------------------|
| `search` | string | -       | Nombre del ejercicio           |
| `muscle` | string | -       | Grupo muscular (ver abajo)     |
| `page`   | number | 1       | Pagina                         |
| `limit`  | number | 4       | Resultados por pagina (max 50) |

**Musculos:** `pectorals` `lats` `delts` `biceps` `triceps` `abs` `quads` `hamstrings` `glutes` `calves` `traps`

**Ejemplos:**

```
GET /exercises?muscle=pectorals&page=1&limit=4
GET /exercises?search=press&muscle=pectorals&page=2&limit=4
```

**Respuesta:**

```json
{
  "data": [
    {
      "id": "0025",
      "name": "barbell bench press",
      "target": "pectorals",
      "equipment": "barbell",
      "difficulty": "intermediate",
      "imageUrl": "/exercises/image/0025"
    }
  ],
  "total": 28
}
```

### `GET /exercises/image/:id` — Imagen del ejercicio (GIF)

Proxy a ExerciseDB. Se usa directamente como `src` de un `<img>`.

- Plan gratuito: resolucion 180px.
- Los GIFs se cachean **30 min** en memoria del servidor.

## Paginacion

- El `limit` es una variable dinamica (por defecto **4** resultados por pagina).
- El servidor devuelve `{ data: Exercise[], total: number }` para que el cliente
  calcule el numero total de paginas.
- El cliente muestra botones de pagina: `Anterior [1] [2] [3] Siguiente`.
- Al cambiar filtros (search o muscle) se resetea a pagina 1.
- Si solo hay 1 pagina de resultados, los botones no aparecen.

## Cache

- **Busquedas**: cacheadas **5 min** en memoria. Misma busqueda = 0 llamadas extra a RapidAPI.
- **Imagenes**: cacheadas **30 min** en memoria. El navegador tambien cachea con `Cache-Control: max-age=1800`.

## Limitaciones del plan gratuito

- **500 peticiones/mes** a RapidAPI (la cache del servidor ayuda a reducir el consumo).
- **Resolucion de imagenes**: solo 180px.
- **Dataset reducido**: algunos musculos tienen pocos ejercicios (ej: biceps ~10).

## Env del Server

```env
EXERCISEDB_API_KEY=<api_key_de_rapidapi>
```

### Como conseguir la API key

1. Crear cuenta en https://rapidapi.com
2. Ir a https://rapidapi.com/justin-WFnsXH_t6/api/exercisedb
3. Darle a "Subscribe" (el plan gratuito da 500 peticiones/mes)
4. En la seccion "Header Parameters" copiar el valor de `X-RapidAPI-Key`
5. Pegar en el `.env` del Server como `EXERCISEDB_API_KEY`
