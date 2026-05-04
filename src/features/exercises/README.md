# Exercises

## Origen del catalogo

El servidor sirve un catalogo de ~870 ejercicios desde un dataset estatico
bundleado en el repo (`Server/src/data/exercises.json`, copia vendoreada de
`yuhonas/free-exercise-db`, MIT). No hay llamadas a APIs de pago, no hay
API keys, no hay rate limits.

El JSON se importa directamente en `Server/src/services/exercise.service.ts`
con `resolveJsonModule`, asi que tsc lo copia a `dist/data/` y esbuild
(Netlify Functions) lo inlinea en el bundle de la function. Si el fichero
desaparece, falla el build — nunca el runtime.

## Flujo

```
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND (React)                                               │
│                                                                 │
│  ExerciseSearch.tsx                                             │
│    Input "press" + Select "Pectorals" -> useExerciseSearch      │
│    Debounce 400ms, AbortController para cancelar pendientes     │
│    Llama exerciseRepository.searchExercises()                   │
│    Renderiza grid 3x3 de ExerciseCard                           │
│                                                                 │
│  ExerciseCard.tsx                                               │
│    Header: nombre del grupo muscular (PECHO/HOMBROS/...) en     │
│    Press_Start_2P sobre rejilla pixel + scanlines               │
│    Body: nombre + chips (equipamiento, dificultad)              │
│    Sin <img>: la card es 100% pixel-art para encajar con la UI  │
└────────────────────────────┬────────────────────────────────────┘
                             │
       GET /exercises?search=press&muscle=pectorals&page=1&limit=9
       Authorization: Bearer <jwt>
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  BACKEND (Express)                                              │
│                                                                 │
│  routes/exercises.ts                                            │
│    GET /  -> ExercisesController.search                         │
│                                                                 │
│  ExercisesController.search                                     │
│    Lee search, muscle, page, limit (clamps page>=1, limit<=50)  │
│    Llama exerciseService.searchExercises (sincrono)             │
│    Devuelve { data: Exercise[], total }                         │
│                                                                 │
│  exercise.service.ts                                            │
│    Modulo carga el JSON al import (resolveJsonModule)           │
│    Mapea a { id, name, target, equipment, difficulty, imageUrl }│
│    target = primaryMuscles[0]  (mapeado al vocabulario que el   │
│              cliente envia: pectorals/delts/abs/quads...)       │
│    imageUrl = URL absoluta al CDN de github (raw.github)        │
│    Filtra y pagina en memoria                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Endpoints del servidor

### `GET /exercises` — Buscar ejercicios

| Param    | Tipo   | Default | Descripcion                    |
| -------- | ------ | ------- | ------------------------------ |
| `search` | string | -       | Nombre del ejercicio           |
| `muscle` | string | -       | Grupo muscular (ver abajo)     |
| `page`   | number | 1       | Pagina                         |
| `limit`  | number | 9       | Resultados por pagina (max 50) |

**Musculos** (vocabulario del cliente): `pectorals` `lats` `delts` `biceps`
`triceps` `abs` `quads` `hamstrings` `glutes` `calves` `traps`. El servidor
los traduce a la vocabulario de free-exercise-db internamente.

**Ejemplos:**

```
GET /exercises?muscle=pectorals&page=1&limit=9
GET /exercises?search=press&muscle=pectorals&page=2&limit=9
```

**Respuesta:**

```json
{
  "data": [
    {
      "id": "Barbell_Bench_Press",
      "name": "Barbell Bench Press",
      "target": "chest",
      "equipment": "barbell",
      "difficulty": "intermediate",
      "imageUrl": "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press/0.jpg"
    }
  ],
  "total": 12
}
```

## Localizacion (cliente)

`core/domain/labels.ts` traduce los valores brutos del API
(English, lowercase) a etiquetas en castellano para los chips:

- `TARGET_LABEL`: `chest -> PECHO`, `shoulders -> HOMBROS`, etc.
- `EQUIPMENT_LABEL`: `barbell -> BARRA`, `body only -> PESO CORPORAL`, etc.
- `DIFFICULTY_LABEL`: `intermediate -> INTERMEDIO`, etc.

Cualquier vista que renderice un Exercise (la card, el header del workout
en curso) reutiliza el mismo modulo para evitar divergencias.

## Paginacion

- `limit` por defecto = **9** (grid 3x3).
- El cliente calcula numero de paginas con `total / limit`.
- Cambiar filtro (`search` o `muscle`) resetea a pagina 1.

## Imagenes

`imageUrl` siempre es absoluta (CDN raw.githubusercontent.com). El cliente
muestra la imagen solo en el header del workout en curso; en la card del
buscador la imagen se omite a proposito porque rompia el estilo pixel-art.
