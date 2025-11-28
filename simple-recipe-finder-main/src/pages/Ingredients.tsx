import { useState } from 'react';
import { ChefHat, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import RecipeCard from '@/components/RecipeCard';
import { recipeApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Ingredients = () => {
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [excludeInput, setExcludeInput] = useState('');
  const [exclude, setExclude] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setIngredientInput('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter((i) => i !== ingredient));
  };

  const addExclude = () => {
    const trimmed = excludeInput.trim();
    if (trimmed && !exclude.includes(trimmed)) {
      setExclude([...exclude, trimmed]);
      setExcludeInput('');
    }
  };

  const removeExclude = (ingredient: string) => {
    setExclude(exclude.filter((i) => i !== ingredient));
  };

const handleSearch = async () => {
  const trimmed = ingredientInput.trim();
  let currentIngredients = ingredients;

  if (trimmed && !ingredients.includes(trimmed)) {
    currentIngredients = [...ingredients, trimmed];
    setIngredients(currentIngredients);
    setIngredientInput('');
  }

  if (currentIngredients.length === 0) {
    toast({
      title: 'Hinweis',
      description: 'Bitte gib mindestens eine Zutat ein',
      variant: 'destructive',
    });
    return;
  }

  setLoading(true);

  const result = await recipeApi.searchByIngredients(currentIngredients, exclude);

  if (result.error) {
    toast({
      title: 'Fehler',
      description: result.error,
      variant: 'destructive',
    });
  } else {
    setRecipes((result.data as any[]) || []);
  }

  setLoading(false);
};



   
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl font-light mb-2 flex items-center gap-3">
            <ChefHat className="text-primary" size={32} />
            Was habe ich zu Hause?
          </h1>
          <p className="text-muted-foreground mb-8">
            Gib deine vorhandenen Zutaten ein und finde passende Rezepte
          </p>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Vorhandene Zutaten</label>
              <div className="flex gap-2">
                <Input
                  placeholder="z.B. Tomaten, Zwiebeln..."
                  value={ingredientInput}
                  onChange={(e) => setIngredientInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addIngredient();
                    }
                  }}
                />
                <Button onClick={addIngredient} variant="secondary">
                  Hinzufügen
                </Button>
              </div>
              
              {ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {ingredients.map((ingredient) => (
                    <Badge key={ingredient} variant="secondary" className="gap-1">
                      {ingredient}
                      <X
                        size={14}
                        className="cursor-pointer hover:text-destructive"
                        onClick={() => removeIngredient(ingredient)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Ausschließen (Optional)</label>
              <div className="flex gap-2">
                <Input
                  placeholder="z.B. Nüsse, Milch..."
                  value={excludeInput}
                  onChange={(e) => setExcludeInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addExclude();
                    }
                  }}
                />
                <Button onClick={addExclude} variant="secondary">
                  Hinzufügen
                </Button>
              </div>
              
              {exclude.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {exclude.map((ingredient) => (
                    <Badge key={ingredient} variant="destructive" className="gap-1">
                      {ingredient}
                      <X
                        size={14}
                        className="cursor-pointer"
                        onClick={() => removeExclude(ingredient)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <Button onClick={handleSearch} disabled={loading} className="w-full" size="lg">
              {loading ? 'Suche läuft...' : 'Rezepte finden'}
            </Button>
          </div>
        </div>

        {recipes.length > 0 && (
          <div>
            <h2 className="text-2xl font-light mb-6">
              {recipes.length} Rezept{recipes.length !== 1 && 'e'} gefunden
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe.id} {...recipe} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Ingredients;
