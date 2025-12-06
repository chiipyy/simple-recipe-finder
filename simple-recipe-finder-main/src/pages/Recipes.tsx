import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Header from '@/components/Header';
import RecipeCard from '@/components/RecipeCard';
import { recipeApi, favoritesApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Recipes = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialwerte aus URL lesen
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('q') ?? ''
  );
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [category, setCategory] = useState<string>(
    searchParams.get('category') ?? 'all'
  );
  const [area, setArea] = useState<string>(
    searchParams.get('area') ?? 'all'
  );
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Eingabe verzögert übernehmen (z.B. 400ms nach letzter Eingabe)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Wenn sich der debouncte Wert oder Filter ändern, URL + Suche aktualisieren
  useEffect(() => {
    // URL-SearchParams updaten
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (debouncedQuery) params.set('q', debouncedQuery);
      else params.delete('q');

      if (category && category !== 'all') params.set('category', category);
      else params.delete('category');

      if (area && area !== 'all') params.set('area', area);
      else params.delete('area');

      return params;
    });

    if (!debouncedQuery && category === 'all' && area === 'all') {
      setRecipes([]);
      return;
    }
    handleSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, category, area]);

  const handleSearch = async () => {
  setLoading(true);

  let result;

  if (debouncedQuery) {
    // Es gibt einen Suchtext: API nach Text fragen
    result = await recipeApi.search(debouncedQuery, {});
  } else {
    // Kein Suchtext: API nur mit Filtern fragen
    const filters: { category?: string; area?: string } = {};
    if (category !== 'all') filters.category = category;
    if (area !== 'all') filters.area = area;

    result = await recipeApi.search('', filters);
  }

  if (result.error) {
    toast({
      title: 'Error',
      description: result.error,
      variant: 'destructive',
    });
    setLoading(false);
    return;
  }

  const recipesFromSearch = (result.data as any[]) || [];

  // Wenn mit Text gesucht wurde, noch per Dropdown nachfiltern
  const baseList = debouncedQuery ? recipesFromSearch.filter((r) => {
    const matchCategory = category === 'all' || r.category === category;
    const matchArea = area === 'all' || r.area === area;
    return matchCategory && matchArea;
  }) : recipesFromSearch;

  const favResult = await favoritesApi.getAll();
  const favoriteIds =
    (favResult.data as any[] | undefined)?.map((f) => f.id) ?? [];

  const recipesWithFlag = baseList.map((r) => ({
    ...r,
    isFavorite: favoriteIds.includes(r.id),
  }));

  setRecipes(recipesWithFlag);

  if (recipesWithFlag.length === 0) {
    toast({
      title: 'No results',
      description:
        'No recipes were found. Please try another combination.',
    });
  }

  setLoading(false);
};



  const handleToggleFavorite = async (recipeId: string) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    if (!recipe) return;

    if (recipe.isFavorite) {
      await favoritesApi.remove(recipeId);
      setRecipes((prev) =>
        prev.map((r) =>
          r.id === recipeId ? { ...r, isFavorite: false } : r
        )
      );
      toast({
        title: 'Removed',
        description: 'Recipe removed from favorites',
      });
    } else {
      await favoritesApi.add({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        category: recipe.category,
        area: recipe.area,
      });
      setRecipes((prev) =>
        prev.map((r) =>
          r.id === recipeId ? { ...r, isFavorite: true } : r
        )
      );
      toast({
        title: 'Saved',
        description: 'Recipe added to your favorites',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-light mb-8 flex items-center gap-3">
          <Search className="text-primary" size={28} />
          <span> Search for Recipes</span>
        </h1>
        <div className="space-y-4 mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                size={18}
              />
              <Input
                placeholder="Search for recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Search size={18} className="shrink-0" />
              <span>{loading ? 'Searching...' : 'Search'}</span>
            </Button>


          </div>

          <div className="flex gap-3 flex-wrap">
            {/* Category: wenn gewählt, setzt Cuisine auf All */}
            <Select
              value={category}
              onValueChange={(value) => {
                setCategory(value);
                if (value !== 'all') {
                  setArea('all');
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Category</SelectItem>
                <SelectItem value="Beef">Beef</SelectItem>
                <SelectItem value="Chicken">Chicken</SelectItem>
                <SelectItem value="Seafood">Seafood</SelectItem>
                <SelectItem value="Pasta">Pasta</SelectItem>
                <SelectItem value="Pork">Pork</SelectItem>
                <SelectItem value="Lamb">Lamb</SelectItem>
                <SelectItem value="Goat">Goat</SelectItem>
                <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                <SelectItem value="Vegan">Vegan</SelectItem>
                <SelectItem value="Dessert">Dessert</SelectItem>
                <SelectItem value="Side">Side</SelectItem>
                <SelectItem value="Starter">Starter</SelectItem>
                <SelectItem value="Miscellaneous">Miscellaneous</SelectItem>
              </SelectContent>
            </Select>

            {/* Cuisine: wenn gewählt, setzt Category auf All */}
            <Select
              value={area}
              onValueChange={(value) => {
                setArea(value);
                if (value !== 'all') {
                  setCategory('all');
                }
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Cuisine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Cuisine</SelectItem>
                <SelectItem value="American">American</SelectItem>
                <SelectItem value="British">British</SelectItem>
                <SelectItem value="Canadian">Canadian</SelectItem>
                <SelectItem value="Chinese">Chinese</SelectItem>
                <SelectItem value="Croatian">Croatian</SelectItem>
                <SelectItem value="Dutch">Dutch</SelectItem>
                <SelectItem value="Egyptian">Egyptian</SelectItem>
                <SelectItem value="French">French</SelectItem>
                <SelectItem value="Greek">Greek</SelectItem>
                <SelectItem value="Indian">Indian</SelectItem>
                <SelectItem value="Irish">Irish</SelectItem>
                <SelectItem value="Italian">Italian</SelectItem>
                <SelectItem value="Jamaican">Jamaican</SelectItem>
                <SelectItem value="Japanese">Japanese</SelectItem>
                <SelectItem value="Kenyan">Kenyan</SelectItem>
                <SelectItem value="Malaysian">Malaysian</SelectItem>
                <SelectItem value="Mexican">Mexican</SelectItem>
                <SelectItem value="Moroccan">Moroccan</SelectItem>
                <SelectItem value="Polish">Polish</SelectItem>
                <SelectItem value="Portuguese">Portuguese</SelectItem>
                <SelectItem value="Russian">Russian</SelectItem>
                <SelectItem value="Spanish">Spanish</SelectItem>
                <SelectItem value="Thai">Thai</SelectItem>
                <SelectItem value="Tunisian">Tunisian</SelectItem>
                <SelectItem value="Turkish">Turkish</SelectItem>
                <SelectItem value="Vietnamese">Vietnamese</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <p className="text-center text-muted-foreground">Lädt...</p>
        ) : recipes.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                {...recipe}
                isFavorite={!!recipe.isFavorite}
                onToggleFavorite={() => handleToggleFavorite(recipe.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Search for recipes to see results
          </p>
        )}
      </main>
    </div>
  );
};

export default Recipes;
