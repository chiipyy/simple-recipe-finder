const express = require('express');
const cors = require('cors');
// bei Node < 18 zusätzlich:
// const fetch = require('node-fetch');

const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'supergeheimes-token-secret';

const app = express();
const PORT = 3001;

// SQLite-Datenbank (users.db im backend-Ordner)
const db = new sqlite3.Database('./users.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      recipe_id TEXT NOT NULL,
      title TEXT NOT NULL,
      image TEXT,
      category TEXT,
      area TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
});

// Basis-URL für TheMealDB (öffentliche Demo-API)
const THEMEALDB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

app.use(express.json());
app.use(cors({ origin: '*' }));
console.log('CORS origin set to *');

// Health-Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Registrierung
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Email and password are required' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const stmt = db.prepare(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)'
    );
    stmt.run(email, passwordHash, function (err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          return res
            .status(409)
            .json({ message: 'Email is already registered' });
        }
        console.error('Register Error:', err);
        return res
          .status(500)
          .json({ message: 'Error during registration' });
      }

      return res.status(201).json({ id: this.lastID, email });
    });
    stmt.finalize();
  } catch (err) {
    console.error('Register-Hash-Error:', err);
    return res
      .status(500)
      .json({ message: 'Error during registration' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Email and password are required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      console.error('Login-DB-Fehler:', err);
      return res.status(500).json({ message: 'Error during your registration try' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid login details' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid login details' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  });
});

// Rezeptsuche: /api/recipes/search?q=...
// Rezeptsuche: /api/recipes/search?q=...
// Rezeptsuche: /api/recipes/search?q=...
app.get('/api/recipes/search', async (req, res) => {
  const q = (req.query.q || '').toString().trim();
  const category = (req.query.category || '').toString().trim();
  const area = (req.query.area || '').toString().trim();

  try {
    let meals = [];

    // 1) Wenn Kategorie gesetzt: immer zuerst nach Kategorie filtern
    if (category) {
      const url = `${THEMEALDB_BASE_URL}/filter.php?c=${encodeURIComponent(
        category
      )}`;
      const response = await fetch(url);
      const data = await response.json();
      meals = data.meals || [];

      // Wenn zusätzlich Area gewählt: aus den Kategorie-Ergebnissen nur diese Area behalten
      if (area) {
        meals = meals.filter((meal) => meal.strArea === area);
      }
    }
    // 2) Keine Kategorie, aber Area gewählt
    else if (area) {
      const url = `${THEMEALDB_BASE_URL}/filter.php?a=${encodeURIComponent(
        area
      )}`;
      const response = await fetch(url);
      const data = await response.json();
      meals = data.meals || [];
    }
    // 3) Nur Textsuche
    else if (q) {
      const url = `${THEMEALDB_BASE_URL}/search.php?s=${encodeURIComponent(q)}`;
      const response = await fetch(url);
      const data = await response.json();
      meals = data.meals || [];
    } else {
      return res.json([]);
    }

    const recipes = meals.map((meal) => ({
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      category: meal.strCategory,
      area: meal.strArea,
      instructions: meal.strInstructions || '',
    }));

    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving the recipes you are looking for' });
  }
});



// Zufallsrezept: /api/recipes/random
app.get('/api/recipes/random', async (req, res) => {
  try {
    const url = `${THEMEALDB_BASE_URL}/random.php`;
    const response = await fetch(url);
    const data = await response.json();

    const meal = (data.meals && data.meals[0]) || null;
    if (!meal) {
      return res
        .status(404)
        .json({ message: 'No random recipe found' });
    }

    // Zutaten aus TheMealDB extrahieren (strIngredient1-20 + strMeasure1-20)
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() && measure && measure.trim()) {
        ingredients.push(`${measure} ${ingredient}`);
      }
    }

    // Instructions in Sätze aufteilen
    const instructionsArray = meal.strInstructions
      ? meal.strInstructions.split('. ').filter((s) => s.trim())
      : [];

    const recipe = {
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      category: meal.strCategory,
      area: meal.strArea,
      instructions: instructionsArray,
      ingredients: ingredients,
    };

    res.json(recipe);
  } catch (err) {
    console.error('Random recipe error:', err);
    res
      .status(500)
      .json({ message: 'Error retrieving random recipe' });
  }
});

// Rezept-Details: /api/recipes/:id
app.get('/api/recipes/:id', async (req, res) => {
  const id = req.params.id;
  console.log('DETAIL HIT id=', id);

  if (!id) {
    return res.status(400).json({ message: 'Recipe ID is missing' });
  }

  try {
    const url = `${THEMEALDB_BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`;
    const response = await fetch(url);
    const data = await response.json();

    const meal = (data.meals && data.meals[0]) || null;
    if (!meal) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Zutaten aus TheMealDB extrahieren (strIngredient1-20 + strMeasure1-20)
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];
      if (ingredient && ingredient.trim() && measure && measure.trim()) {
        ingredients.push(`${measure} ${ingredient}`);
      }
    }

    // Instructions in Sätze aufteilen
    const instructionsArray = meal.strInstructions
      ? meal.strInstructions.split('. ').filter((s) => s.trim())
      : [];

    const recipe = {
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      category: meal.strCategory,
      area: meal.strArea,
      instructions: instructionsArray,
      ingredients: ingredients,
    };

    res.json(recipe);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Error retrieving recipe details' });
  }
});

// Zutaten-Suche: /api/recipes/by-ingredients
app.post('/api/recipes/by-ingredients', async (req, res) => {
  const { ingredients = [], exclude = [] } = req.body || {};

  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    return res.json([]);
  }

  try {
    const main = ingredients[0];

    const url = `${THEMEALDB_BASE_URL}/filter.php?i=${encodeURIComponent(
      main
    )}`;
    const response = await fetch(url);
    const data = await response.json();

    const meals = data.meals || [];

    const filteredMeals = meals.filter((meal) => {
      const name = (meal.strMeal || '').toLowerCase();
      return !exclude.some((ex) => name.includes(ex.toLowerCase()));
    });

    const recipes = filteredMeals.map((meal) => ({
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      category: meal.strCategory || '',
      area: meal.strArea || '',
      instructions: '',
    }));

    res.json(recipes);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Error in ingredient search' });
  }
});

// Middleware: User aus JWT holen
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res
      .status(401)
      .json({ message: 'No token, access denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.userId, email: decoded.email };
    next();
  } catch (err) {
    console.error('JWT-Fehler:', err);
    return res
      .status(401)
      .json({ message: 'Invalid or expired token' });
  }
}

// Alle Favoriten des eingeloggten Nutzers holen
app.get('/api/favorites', authMiddleware, (req, res) => {
  const userId = req.user.id;

  db.all(
    'SELECT id, recipe_id, title, image, category, area FROM favorites WHERE user_id = ? ORDER BY created_at DESC',
    [userId],
    (err, rows) => {
      if (err) {
        console.error('Favorites Select Error:', err);
        return res
          .status(500)
          .json({ message: 'Error loading favorites' });
      }

      const favorites = rows.map((row) => ({
        id: row.recipe_id,
        title: row.title,
        image: row.image,
        category: row.category,
        area: row.area,
      }));

      res.json(favorites);
    }
  );
});

// Einen Favoriten hinzufügen
app.post('/api/favorites', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const { id, title, image, category, area } = req.body;

  if (!id || !title) {
    return res
      .status(400)
      .json({ message: 'Recipe data incomplete' });
  }

  const stmt = db.prepare(
    'INSERT INTO favorites (user_id, recipe_id, title, image, category, area) VALUES (?, ?, ?, ?, ?, ?)'
  );
  stmt.run(
    userId,
    id,
    title,
    image || null,
    category || null,
    area || null,
    function (err) {
      if (err) {
        console.error('Favorites insert error:', err);
        return res
          .status(500)
          .json({ message: 'Error saving favorite' });
      }

      return res
        .status(201)
        .json({ message: 'Favorite saved', favoriteId: this.lastID });
    }
  );
  stmt.finalize();
});

// Einen Favoriten entfernen
app.delete('/api/favorites/:recipeId', authMiddleware, (req, res) => {
  const userId = req.user.id;
  const { recipeId } = req.params;

  const stmt = db.prepare(
    'DELETE FROM favorites WHERE user_id = ? AND recipe_id = ?'
  );
  stmt.run(userId, recipeId, function (err) {
    if (err) {
      console.error('Favorites delete error:', err);
      return res
        .status(500)
        .json({ message: 'Error deleting favorite' });
    }

    return res.json({ message: 'Favorite removed', deleted: this.changes });
  });
  stmt.finalize();
});

app.listen(PORT, () => {
  console.log(`Backend läuft auf http://localhost:${PORT}`);
});
