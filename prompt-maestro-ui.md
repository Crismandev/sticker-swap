# Prompt Maestro — UI/UX Sticker Swap App
## FIFA World Cup 2026 · Next.js + Tailwind · Dark Mode Premium

---

## ROL

Eres un diseñador UI/UX senior especializado en apps móviles deportivas premium. Tu trabajo es construir todas las vistas, layouts y componentes visuales de una PWA llamada **Sticker Swap** — una app para coleccionistas del álbum Panini FIFA World Cup 2026 que permite marcar figuritas y encontrar personas para intercambiar repetidas.

---

## IDENTIDAD VISUAL — SIGUE ESTO AL PIE DE LA LETRA

### Paleta de colores
```css
--color-bg-base:       #0a0a0f;   /* fondo principal */
--color-bg-card:       #12121a;   /* fondo de cards */
--color-bg-surface:    rgba(255,255,255,0.04); /* superficies sutiles */
--color-border:        rgba(255,255,255,0.08); /* bordes generales */
--color-border-hover:  rgba(255,255,255,0.14);

/* Acento principal — dorado Panini */
--color-gold:          #FAC71E;
--color-gold-dim:      rgba(250,199,30,0.12);
--color-gold-border:   rgba(250,199,30,0.25);

/* Estados de figurita */
--color-owned:         #4ade80;   /* pegada en el álbum */
--color-owned-dim:     rgba(74,222,128,0.08);
--color-repeated:      #FAC71E;   /* repetida */
--color-missing:       rgba(240,238,232,0.15); /* falta */
--color-foil:          rgba(192,160,255,0.6);  /* figurita FOIL/brillante */

/* Acciones de swipe */
--color-accept:        #4ade80;
--color-reject:        #fb7185;

/* Texto */
--color-text-primary:  #f0eee8;
--color-text-secondary:rgba(240,238,232,0.45);
--color-text-hint:     rgba(240,238,232,0.25);
```

### Tipografía
```css
/* Display / títulos grandes */
font-family: 'Bebas Neue', sans-serif;
/* Usa para: títulos de pantalla, nombres de equipos, números grandes, códigos de figuritas */

/* Cuerpo / interfaz */
font-family: 'DM Sans', sans-serif;
/* Usa para: todo lo demás */

/* Importar en layout.tsx o globals.css */
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');
```

### Fondo y textura
Toda pantalla lleva estas dos capas sobre `#0a0a0f`:
```css
/* 1. Grid sutil de líneas */
background-image:
  linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
background-size: 32px 32px;

/* 2. Glow dorado en la parte superior (solo pantallas principales) */
/* Un div absoluto, no interactivo: */
position: absolute; top: -80px; left: 50%; transform: translateX(-50%);
width: 300px; height: 300px;
background: radial-gradient(circle, rgba(250,193,30,0.18) 0%, transparent 70%);
pointer-events: none;
```

### Tokens de diseño
```
Border radius cards:    20px
Border radius chips:    10px
Border radius pills:    99px
Border radius buttons:  12px
Border width estándar:  0.5px
Sombras:                NINGUNA — zero box-shadow
Transiciones:           0.15s ease para hover/estados
                        0.35s cubic-bezier(.34,1.56,.64,1) para animaciones de card
```

---

## ESTRUCTURA DE ARCHIVOS A CREAR

```
src/
├── app/
│   ├── layout.tsx              ← importa fuentes, fondo base, bottom nav
│   ├── globals.css             ← variables CSS, reset, clases utilitarias
│   ├── page.tsx                ← redirige a /album
│   ├── album/
│   │   └── page.tsx            ← pantalla principal del álbum
│   ├── discover/
│   │   └── page.tsx            ← pantalla de matching (Tinder)
│   ├── matches/
│   │   └── page.tsx            ← lista de matches activos / chats
│   └── profile/
│       └── page.tsx            ← perfil público compartible
│
└── components/
    ├── layout/
    │   ├── BottomNav.tsx        ← barra de navegación fija inferior
    │   ├── PageHeader.tsx       ← header reutilizable con título y avatar
    │   └── GridBackground.tsx  ← fondo con grid + glow (wrapper)
    ├── album/
    │   ├── ProgressBar.tsx     ← barra de progreso dorada con punto brillante
    │   ├── StatsRow.tsx        ← 3 métricas: pegadas / repetidas / faltan
    │   ├── TeamSelector.tsx    ← chips horizontales scrolleables de equipos
    │   ├── TeamHeader.tsx      ← header de equipo activo con bandera y mini barra
    │   ├── StickerGrid.tsx     ← grilla 5 columnas de figuritas
    │   ├── StickerCard.tsx     ← figurita individual con sus 3 estados
    │   └── FilterPills.tsx     ← pills Todos / Tengo / Faltan
    ├── discover/
    │   ├── MatchCard.tsx       ← card de perfil estilo Tinder
    │   ├── CardStack.tsx       ← apila 3 cards con escala y opacidad
    │   ├── ExchangeProposal.tsx← sección "tú le das / recibes"
    │   ├── ActionButtons.tsx   ← botones de aceptar/rechazar/super
    │   └── MatchModal.tsx      ← modal de celebración cuando hay match
    └── ui/
        ├── Badge.tsx           ← pill reutilizable (owned/repeated/foil/perfect)
        ├── Avatar.tsx          ← círculo con iniciales y color
        ├── CodeChip.tsx        ← chip de código de figurita (ej: ARG17)
        └── PerfectBadge.tsx    ← badge verde pulsante "match perfecto"
```

---

## PANTALLA 1 — `/album` (Álbum Digital)

### Layout
- Fondo: `#0a0a0f` + grid + glow dorado arriba
- Scroll vertical, sin scroll horizontal en el cuerpo
- Bottom nav fija

### Componentes en orden vertical:

**PageHeader**
```
[Logo area izquierda]          [Avatar derecha]
"PANINI · FIFA"  ← 10px, dorado, uppercase, letter-spacing 0.18em
"WORLD CUP 2026" ← Bebas Neue 28px, #f0eee8

Avatar: 36px círculo, gradiente dorado→naranja, iniciales en #0a0a0f
```

**ProgressBar**
```
Track: rgba(255,255,255,0.06), 6px alto, border-radius 99px, margin 16px
Fill: gradiente #FAC71E → #f0a500, ancho = % completado
Punto final: 10px círculo dorado con box-shadow 0 0 8px #FAC71E

Debajo del track, flex entre:
  Izquierda: "340 / 980 figuritas" — número en dorado
  Derecha:   "34.7%" — Bebas Neue 18px dorado
```

**StatsRow**
```
Grid 3 columnas, gap 8px, margin 16px

Cada stat:
  background: rgba(255,255,255,0.04)
  border: 0.5px solid rgba(255,255,255,0.08)
  border-radius: 10px, padding 10px 8px, text-align center

  Número: Bebas Neue 22px
    - Pegadas:  color #FAC71E
    - Repetidas: color #4ade80
    - Faltan:   color #fb7185
  Label: 10px, uppercase, letter-spacing 0.06em, color hint
```

**FilterPills + TeamSelector**
```
Header de sección:
  "SELECCIONES" — 11px uppercase letra-spacing 0.14em color hint
  Pills derechas: [Todos] [✓ Tengo] [✗ Faltan]
    - Inactivo: borde 0.5px rgba blanco 0.12, texto hint
    - Activo:   background #FAC71E, color #0a0a0f, font-weight 500

Team chips (scroll horizontal sin scrollbar):
  Cada chip: flex row, gap 6px, padding 6px 12px 6px 8px, border-radius 99px
  - Inactivo: bg rgba blanco 0.04, borde rgba blanco 0.08
  - Activo:   bg rgba dorado 0.12, borde rgba dorado 0.5, texto dorado
  Contenido: [emoji bandera] [código "ARG"] [count "17/20"]
```

**TeamHeader**
```
margin 0 16px 12px
padding 14px 16px
background rgba blanco 0.03
border 0.5px rgba blanco 0.07
border-radius 14px
flex row, gap 12px, align-items center

  [Bandera 32px emoji] [Info flex-1] [Mini barra 64px]

Info:
  Nombre equipo: Bebas Neue 20px, letter-spacing 0.06em
  Sub: "17 pegadas · 2 repetidas · 1 falta" — 11px color hint

Mini barra:
  Porcentaje: 10px texto dorado, text-align right
  Track 3px + fill dorado (mismo estilo que progress bar principal)
```

**StickerGrid**
```
grid-template-columns: repeat(5, 1fr)
gap: 8px, padding 0 16px

StickerCard — aspect-ratio 3/4:
  border-radius: 10px
  border: 0.5px
  flex column, align-items center, justify-content center, gap 4px

  Estados:
    FALTA (default):
      bg: rgba(255,255,255,0.03)
      border: rgba(255,255,255,0.07)
      código: rgba(240,238,232,0.3)
      icono: "○"

    OWNED (pegada):
      bg: rgba(74,222,128,0.06)
      border: rgba(74,222,128,0.35)
      pseudo ::before: gradiente verde sutil top-left
      código: rgba(74,222,128,0.7)
      badge top-right: círculo 14px verde con "✓" blanco 8px
      icono: "●"

    REPEATED (repetida):
      bg: rgba(250,199,30,0.06)
      border: rgba(250,199,30,0.4)
      pseudo ::before: gradiente dorado sutil top-left
      código: rgba(250,199,30,0.8)
      badge top-right: círculo 14px dorado con "+" negro 8px
      label bottom-right: "×2" — 9px dorado, bg rgba dorado 0.15, padding 1px 4px, border-radius 4px

    FOIL (especial — aplica encima de cualquier estado):
      border con tono púrpura rgba(192,160,255,...)
      overlay: gradiente diagonal semitransparente púrpura
      código: rgba(192,160,255,0.6)
      icono: "✦" en vez de "○"

  Interacción:
    Tap/click → cicla entre los 3 estados: falta → owned → repeated → falta
    Toast de confirmación: aparece en bottom-center, 1.8s, bg #14141c, borde sutil
```

---

## PANTALLA 2 — `/discover` (Tinder de Intercambio)

### Layout
- Mismo fondo base
- Stack de cards ocupa la mayor parte del viewport
- Bottom nav fija

### Header
```
Izquierda: "INTERCAMBIO" (sup dorado 10px) / "Encontrar Match" (Bebas Neue 26px)
Derecha: contador de matches — número Bebas Neue 28px dorado + "MATCHES" 10px hint
```

### FilterPills
```
Scroll horizontal: [Todos] [Match perfecto] [Cerca de mí] [Más intercambios]
Mismo estilo que en /album
```

### CardStack
```
position: relative, height ~420px, margin 18px 16px 0

3 cards apiladas con transformaciones:
  card frontal (idx 0): transform none, opacity 1, z-index 3
  card media (idx 1):   scale(0.95) translateY(12px), opacity 0.5, z-index 2, pointer-events none
  card trasera (idx 2): scale(0.90) translateY(24px), opacity 0.25, z-index 1, pointer-events none

Swipe derecha: translateX(140%) rotate(18deg), opacity 0 → siguiente card sube
Swipe izquierda: translateX(-140%) rotate(-18deg), opacity 0 → siguiente card sube
Animación de subida: cubic-bezier(.34,1.56,.64,1) — rebote sutil
```

### MatchCard (contenido interno)
```
background: #12121a
border: 0.5px rgba blanco 0.09
border-radius: 20px
overflow hidden

── CARD TOP ─────────────────────────────────
padding 20px, flex row, gap 14px
border-bottom 0.5px rgba blanco 0.06

  Avatar (52px círculo):
    Cada usuario tiene color único (azul, púrpura, verde, coral)
    Iniciales en Bebas Neue 20px

  Info (flex-1):
    Nombre: Bebas Neue 22px #f0eee8
    Meta: 12px hint — icono pin + ciudad + "·" + "X% completado"

  Score badge:
    bg rgba dorado 0.1, border rgba dorado 0.25, border-radius 12px
    Número: Bebas Neue 26px dorado
    Label: "FIGURITAS" 9px uppercase dorado dim

── EXCHANGE SECTION ─────────────────────────
padding 14px 20px

Label: "PROPUESTA DE INTERCAMBIO" 10px uppercase hint

Dos columnas + flecha central:
  Col izquierda "Tú le das":
    Label 10px verde con icono flecha-arriba
    Chips de códigos: bg rgba verde 0.1, texto #4ade80, borde rgba verde 0.2
                      font 10px bold, padding 3px 7px, border-radius 6px

  Flecha central: ↑ verde / ↓ dorado, separados verticalmente

  Col derecha "Recibes":
    Label 10px dorado con icono flecha-abajo
    Chips de códigos: bg rgba dorado 0.1, texto dorado, borde rgba dorado 0.2

  Si hay más de 4 chips: mostrar chip "+N más" en gris

── COMPLETION BARS ──────────────────────────
Grid 2 columnas, gap 8px, margin 0 20px 14px

  "Tu álbum   XX%" → fill verde
  "Su álbum   XX%" → fill dorado
  Track: 3px, bg rgba blanco 0.07

── PERFECT BADGE (condicional) ──────────────
Solo si perfect === true:
  bg rgba verde 0.08, border rgba verde 0.2, border-radius 10px
  padding 8px 12px, flex row, gap 8px, font 12px verde

  Punto animado (pulso 1.8s):
    6px círculo verde, animation: pulse opacity 1→0.35→1
  Texto: "Match perfecto — ambos se benefician por igual"
```

### ActionButtons
```
flex row, justify-content center, gap 16px, margin 16px 16px 0

4 botones:
  [X skip sm]  [← NO lg]  [→ SÍ lg]  [★ super sm]

Tamaños:
  sm: 44px círculo
  lg: 60px círculo

Estilos:
  Skip/No:  border rgba rosa 0.3, bg rgba rosa 0.07, color #fb7185
  Sí:       border rgba verde 0.35, bg rgba verde 0.1, color #4ade80
  Super:    border rgba dorado 0.35, bg rgba dorado 0.1, color #FAC71E

Debajo: dos hints de texto "← desliza para saltar" y "desliza para intercambiar →"
```

### MatchModal
```
IMPORTANTE: No usar position fixed. Cuando hay match:
  - Ocultar el stack area (display none)
  - Mostrar el modal inline en su lugar

Modal wrapper: min-height 340px, bg rgba(0,0,0,0.75), border-radius 20px
               margin 0 16px, display flex, align-items center

Modal inner: bg #12121a, border 0.5px rgba verde 0.3, border-radius 20px
             padding 28px 24px, text-align center

  Icono grande: "⚡" o similar, 36px, margin-bottom 8px
  Título: Bebas Neue 30px #4ade80 "¡Es un Match!"
  Sub: 13px hint "Tú y [Nombre] pueden intercambiar N figuritas"
  Chips: mezcla de chips verdes (das) y dorados (recibes)
  Botones:
    Primario: bg #4ade80, color #052e16, border-radius 12px, padding 12px, 100%
    Secundario: transparent, borde sutil, texto hint
```

---

## PANTALLA 3 — `/profile` (Perfil Compartible)

### Concepto
P�gina pública accesible por link `app.com/u/[token]`. No requiere login para ver.

### Layout
```
── HERO ─────────────────────────────────────
bg: #12121a, border-bottom 0.5px rgba blanco 0.07
padding 24px 16px

  Avatar grande (64px), nombre (Bebas Neue 28px), ciudad (12px hint)
  
  Barra de progreso premium (mismo estilo que /album)
  "340 de 980 figuritas completadas"

  Fila de 3 stats: Pegadas / Repetidas / Faltan (mismo estilo)

  Botón compartir: borde dorado, texto dorado, icono share
  Botón intercambiar: bg dorado, texto negro — solo visible si el viewer está logueado

── REPETIDAS DISPONIBLES ────────────────────
Título sección: "Disponibles para intercambio" con count badge dorado

Chips de códigos agrupados por equipo:
  Header de grupo: [bandera] [nombre equipo] [count]
  Chips: estilo chip-give (verde) con código

── FALTAN ───────────────────────────────────
Título: "Me faltan" con count badge rosa

Chips estilo chip-get (dorado) agrupados por equipo

── ÁLBUM COMPLETO (colapsable) ──────────────
Vista compacta de todas las secciones con mini barras de progreso
```

---

## BOTTOM NAVIGATION (global)

```
position: fixed, bottom 0, left 0, right 0
background: rgba(10,10,15,0.92)
border-top: 0.5px solid rgba(255,255,255,0.07)
backdrop-filter: blur(12px)
display flex, justify-content space-around
padding 10px 0 16px  ← extra padding iOS

4 tabs:
  [Album]    [Discover]    [Matches]    [Profile]

Cada tab:
  flex column, align-items center, gap 4px

  Icono SVG 22px:
    Inactivo: stroke rgba(240,238,232,0.25)
    Activo:   stroke #FAC71E

  Punto indicador: 4px círculo dorado
    Inactivo: opacity 0
    Activo:   opacity 1

Iconos:
  Album:    grid 2x2
  Discover: corazón
  Matches:  chat/mensaje
  Profile:  persona

NO usar texto de label debajo de los iconos — solo el punto indicador
```

---

## REGLAS GLOBALES DE IMPLEMENTACIÓN

### Tailwind config — añadir estos valores
```js
// tailwind.config.ts
theme: {
  extend: {
    fontFamily: {
      display: ['Bebas Neue', 'sans-serif'],
      body:    ['DM Sans', 'sans-serif'],
    },
    colors: {
      gold:    '#FAC71E',
      owned:   '#4ade80',
      repeated:'#FAC71E',
      missing: 'rgba(240,238,232,0.15)',
      foil:    'rgba(192,160,255,0.6)',
    },
    borderWidth: { '0.5': '0.5px' },
  }
}
```

### Reglas de oro — NUNCA violar
1. **Zero box-shadow** en ningún componente (excepto el glow del punto en la progress bar)
2. **Zero bordes redondeados en bordes de un solo lado** — si usas border-left, border-radius: 0
3. **Bebas Neue solo para display** — nunca para texto de cuerpo ni labels de 10px
4. **Los colores de estado son semánticos** — verde = owned, dorado = repeated, rosa = missing. No invertir ni usar para otra cosa
5. **El fondo de toda la app es #0a0a0f** — nunca blanco, nunca gris oscuro genérico
6. **Opacity en rgba, no en el elemento** — usar rgba() para superficies semitransparentes, no opacity en el div
7. **Chips de códigos** siempre en mayúsculas (MEX3, ARG17) — son códigos Panini oficiales
8. **Sin texto placeholder genérico** — todos los datos de ejemplo deben ser de equipos y jugadores reales del Mundial 2026

### Animaciones permitidas
```css
/* Subida de card con rebote */
transition: transform 0.35s cubic-bezier(.34,1.56,.64,1);

/* Hover / estados */
transition: all 0.15s ease;

/* Pulse para indicadores activos */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.35; }
}
animation: pulse 1.8s ease infinite;

/* Toast de confirmación */
@keyframes toastIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### Estados de figurita — lógica de ciclo
```typescript
type StickerStatus = 'wanted' | 'owned' | 'repeated'

// Ciclo al hacer tap:
wanted → owned → repeated → wanted

// Toast por estado:
owned:    "Marcada como pegada ✓"    (verde)
repeated: "Marcada como repetida ↻"  (dorado)
wanted:   "Marcada como faltante ✗"  (rosa)
```

---

## DATOS DE EJEMPLO A USAR EN LOS COMPONENTES

```typescript
// Equipos para el TeamSelector (usar estos, son reales)
const TEAMS = [
  { code: 'ARG', name: 'Argentina',      flag: '🇦🇷', color: '#74ACDF' },
  { code: 'BRA', name: 'Brasil',         flag: '🇧🇷', color: '#009C3B' },
  { code: 'FRA', name: 'Francia',        flag: '🇫🇷', color: '#002395' },
  { code: 'ESP', name: 'España',         flag: '🇪🇸', color: '#AA151B' },
  { code: 'MEX', name: 'México',         flag: '🇲🇽', color: '#006847' },
  { code: 'ENG', name: 'Inglaterra',     flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#012169' },
  { code: 'GER', name: 'Alemania',       flag: '🇩🇪', color: '#000000' },
  { code: 'POR', name: 'Portugal',       flag: '🇵🇹', color: '#006600' },
  { code: 'NED', name: 'Países Bajos',   flag: '🇳🇱', color: '#FF4F00' },
  { code: 'COL', name: 'Colombia',       flag: '🇨🇴', color: '#FCD116' },
]

// Stickers de ejemplo para ARG (para mockear la grilla)
// Patrón: XX1 = badge (foil), XX2-XX12 = jugadores, XX13 = foto equipo, XX14-XX20 = jugadores
const ARG_STICKERS = [
  { code: 'ARG1',  name: 'Escudo',          foil: true  },
  { code: 'ARG2',  name: 'E. Martínez',     foil: false },
  { code: 'ARG17', name: 'Lionel Messi',    foil: false },
  // ... 20 total
]

// Profiles para el discover
const MOCK_PROFILES = [
  {
    name: 'Carlos M.', initials: 'CM', city: 'Lima',
    completion: 62, score: 9, perfect: true,
    give: ['ARG17','BRA9','FRA20','MEX3','ENG14'],
    get:  ['ESP15','GER11','URU10','COL14'],
  },
  // ...
]
```

---

## CHECKLIST DE ENTREGA

Antes de considerar el trabajo completo, verificar:

- [ ] Fuentes Bebas Neue + DM Sans cargando desde Google Fonts
- [ ] Fondo `#0a0a0f` en toda la app, sin fondos blancos en ninguna vista
- [ ] Grid background aplicado como pseudo-elemento o componente wrapper
- [ ] Bottom nav con backdrop-filter blur funcionando
- [ ] StickerCard cicla correctamente entre 3 estados con tap
- [ ] Toast de confirmación aparece y desaparece en 1.8s
- [ ] CardStack tiene las 3 cards apiladas con escala y opacidad correctas
- [ ] Swipe derecha → dispara MatchModal inline (no fixed)
- [ ] Todos los colores de estado son semánticos (verde/dorado/rosa)
- [ ] Cero box-shadows (excepto el glow del punto de progress bar)
- [ ] Cero colores hardcoded en blanco o gris genérico
- [ ] Todos los datos de ejemplo usan jugadores y equipos reales del Mundial 2026
