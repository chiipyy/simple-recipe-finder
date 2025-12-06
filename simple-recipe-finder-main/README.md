# KochHilfe - Frontend

Minimalistisches React-Frontend für die KochHilfe-Kochseite.

## Features

- 🔐 Benutzer-Authentifizierung (Login/Registrierung)
- 🔍 Rezeptsuche mit Filtern (Kategorie, Zubereitungszeit)
- 🥘 Zutaten-Suche: Finde Rezepte basierend auf vorhandenen Zutaten
- ❤️ Favoriten-Verwaltung
- 📱 Responsive Design (Mobile First)
- 🎨 Minimalistisches UI-Design

## Voraussetzungen

- Node.js (v18 oder höher)
- npm oder yarn
- Laufendes Backend (Node.js/Express API auf Port 3001)

## Installation (Windows)

1. Repository klonen oder Dateien herunterladen

2. Dependencies installieren:
```bash
npm install
```

3. Umgebungsvariablen konfigurieren:
   - Kopiere `.env.example` zu `.env`
   - Passe die Backend-URL an falls nötig:
   ```
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

## Entwicklung starten

```bash
npm run dev
```

Die App läuft dann auf `http://localhost:5173`

## Produktion Build

```bash
npm run build
```

Die Build-Dateien befinden sich dann im `dist/` Ordner.

## Backend-Integration

Das Frontend erwartet folgende API-Endpunkte vom Backend:

### Auth
- `POST /api/auth/register` - Registrierung
- `POST /api/auth/login` - Login

### Rezepte
- `GET /api/recipes/search?q=...&category=...&time=...` - Rezeptsuche
- `GET /api/recipes/:id` - Rezeptdetails
- `POST /api/recipes/by-ingredients` - Suche nach Zutaten

### Favoriten
- `GET /api/favorites` - Alle Favoriten abrufen
- `POST /api/favorites` - Favorit hinzufügen
- `DELETE /api/favorites/:id` - Favorit entfernen

## Technologie-Stack

- **React** 18.3 mit TypeScript
- **Vite** als Build-Tool
- **React Router** für Navigation
- **Tailwind CSS** für Styling
- **shadcn/ui** Komponenten-Bibliothek
- **Lucide React** für Icons

## Projektstruktur

```
src/
├── components/        # Wiederverwendbare Komponenten
│   ├── ui/           # shadcn/ui Basis-Komponenten
│   ├── Header.tsx    # Hauptnavigation
│   └── RecipeCard.tsx # Rezeptkarte
├── pages/            # Seiten-Komponenten
│   ├── Home.tsx      # Startseite
│   ├── Auth.tsx      # Login/Registrierung
│   ├── Recipes.tsx   # Rezeptübersicht
│   ├── Ingredients.tsx # Zutaten-Suche
│   ├── RecipeDetail.tsx # Rezeptdetails
│   └── Favorites.tsx # Favoriten
├── lib/
│   ├── api.ts        # API-Client
│   └── utils.ts      # Helper-Funktionen
└── index.css         # Globale Styles
```

## Design-System

Das Projekt nutzt ein minimalistisches Design mit:
- Hauptfarbe: Coral-Orange (#FF6B4A)
- Hintergrund: Weiß mit viel Weißraum
- Typografie: Inter (Google Fonts)
- Semantische Farb-Tokens in `index.css`

## Browser-Unterstützung

- Chrome/Edge (letzte 2 Versionen)
- Firefox (letzte 2 Versionen)
- Safari (letzte 2 Versionen)
- Mobile Browser (iOS Safari, Chrome Mobile)

---

## Original Lovable Project Info

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/c4446fa2-a4ce-4122-8dbc-b1464e08f58e) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/c4446fa2-a4ce-4122-8dbc-b1464e08f58e) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)






Mein Teil
## Setup

Frontend:
- cd simple-recipe-finder-main
- npm install
- npm run dev

Backend:
- cd simple-recipe-finder-main/Backend
- npm install
- npm start

Starten?
Node.js und npm installiert
Git installiert

1. Repo klonen
git clone DEIN_REPO_LINK.git
cd simple-recipe-finder-main

2. Frontend installieren und starten
# im Projekt-Hauptordner \simple-recipe-finder-main\simple-recipe-finder-main> 
npm install
npm run dev

3. Backend installieren (neues Terminal)
cd simple-recipe-finder-main/Backend
npm install
npm start
