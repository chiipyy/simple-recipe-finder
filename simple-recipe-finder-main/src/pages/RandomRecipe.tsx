// src/pages/RandomRecipe.tsx
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import RecipeCard from '@/components/RecipeCard';
import { recipeApi, favoritesApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { RefreshCcw } from 'lucide-react';


const RandomRecipePage = () => {
  const [recipe, setRecipe] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadRandom = async () => {
    setLoading(true);
    const result = await recipeApi.getRandom();

    if (result.error) {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
      setLoading(false);
      return;
    }

    const data = result.data as any;
    const favResult = await favoritesApi.getAll();
    const favoriteIds =
      (favResult.data as any[] | undefined)?.map((f) => f.id) ?? [];

    setRecipe({
      ...data,
      isFavorite: favoriteIds.includes(data.id),
    });
    setLoading(false);
  };

  useEffect(() => {
    loadRandom();
  }, []);

  const handleToggleFavorite = async () => {
    if (!recipe) return;

    if (recipe.isFavorite) {
      await favoritesApi.remove(recipe.id);
      setRecipe({ ...recipe, isFavorite: false });
      toast({ title: 'Removed', description: 'Recipe removed from favorites' });
    } else {
      await favoritesApi.add({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        category: recipe.category,
        area: recipe.area,
      });
      setRecipe({ ...recipe, isFavorite: true });
      toast({ title: 'Saved', description: 'Recipe added to your favorites' });
    }
  };

  return (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-light flex items-center gap-3">
          <RefreshCcw className="text-primary" size={28} />
          <span>Random Recipe Generator</span>
        </h1>
        <button
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm"
          onClick={loadRandom}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'New random recipe'}
        </button>
      </div>



        {recipe ? (
          <div className="max-w-xl mx-auto">
            <RecipeCard
              key={recipe.id}
              {...recipe}
              isFavorite={!!recipe.isFavorite}
              onToggleFavorite={handleToggleFavorite}
            />
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            {loading ? 'Loading...' : 'No recipe loaded.'}
          </p>
        )}
      </main>
    </div>
  );
};

export default RandomRecipePage;
