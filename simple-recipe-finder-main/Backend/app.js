const express = require('express');
const cors = require('cors');
// bei Node < 18 zusätzlich:
// const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

// Basis-URL für TheMealDB (öffentliche Demo-API)
const THEMEALDB_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

app.use(express.json());
app.use(cors({ origin: '*' }));
console.log('CORS origin set to *');

// Health-Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Rezeptsuche: /api/recipes/search?q=...
app.get('/api/recipes/search', async (req, res) => {
  const q = req.query.q || '';
  if (!q) {
    return res.json([]);
  }

  try {
    const url = `${THEMEALDB_BASE_URL}/search.php?s=${encodeURIComponent(q)}`;
    const response = await fetch(url);
    const data = await response.json();

    const meals = data.meals || [];

    const recipes = meals.map((meal) => ({
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      category: meal.strCategory,
      area: meal.strArea,
      instructions: meal.strInstructions,
    }));

    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Fehler beim Abrufen der Rezepte' });
  }
});

// Rezept-Details: /api/recipes/:id
app.get('/api/recipes/:id', async (req, res) => {
  const id = req.params.id;
  console.log('DETAIL HIT id=', id);

  if (!id) {
    return res.status(400).json({ message: 'Recipe ID fehlt' });
  }

  try {
    const url = `${THEMEALDB_BASE_URL}/lookup.php?i=${encodeURIComponent(id)}`;
    const response = await fetch(url);
    const data = await response.json();

    const meal = (data.meals && data.meals[0]) || null;
    if (!meal) {
      return res.status(404).json({ message: 'Rezept nicht gefunden' });
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
      ? meal.strInstructions.split('. ').filter(s => s.trim())
      : [];

    const recipe = {
      id: meal.idMeal,
      title: meal.strMeal,
      image: meal.strMealThumb,
      category: meal.strCategory,
      area: meal.strArea,
      instructions: instructionsArray, // Array für schrittweise Anzeige
      ingredients: ingredients, // Array mit "Menge Zutat"
      time: '30 min', // Fallback, TheMealDB hat das nicht
      // nutrition: {} // TheMealDB hat keine Nährwerte
    };

    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Fehler beim Abrufen der Rezeptdetails' });
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

    const url = `${THEMEALDB_BASE_URL}/filter.php?i=${encodeURIComponent(main)}`;
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
    res.status(500).json({ message: 'Fehler bei der Zutaten-Suche' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend läuft auf http://localhost:${PORT}`);
});
