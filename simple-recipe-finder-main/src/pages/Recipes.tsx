import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import RecipeCard from '@/components/RecipeCard';
import { recipeApi, favoritesApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const Recipes = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [time, setTime] = useState<string | undefined>(undefined);
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    setLoading(true);
    const filters: { category?: string; time?: string } = {};
    if (category) filters.category = category;
    if (time) filters.time = time;
    const result = await recipeApi.search(searchQuery, filters);
    
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

  const handleToggleFavorite = async (recipeId: string) => {
    const recipe = recipes.find((r) => r.id === recipeId);
    
    if (recipe?.isFavorite) {
      await favoritesApi.remove(recipeId);
    } else {
      await favoritesApi.add(recipeId);
    }
    
    setRecipes(recipes.map((r) =>
      r.id === recipeId ? { ...r, isFavorite: !r.isFavorite } : r
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-light mb-8">Rezepte durchsuchen</h1>

        <div className="space-y-4 mb-8">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Rezept suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              Suchen
            </Button>
          </div>

          <div className="flex gap-3 flex-wrap">
            <Select value={category} onValueChange={(value) => setCategory(value === 'all' ? undefined : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Kategorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="vegetarian">Vegetarisch</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
                <SelectItem value="meat">Fleisch</SelectItem>
                <SelectItem value="protein">Proteinreich</SelectItem>
              </SelectContent>
            </Select>

            <Select value={time} onValueChange={(value) => setTime(value === 'all' ? undefined : value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Zubereitungszeit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle</SelectItem>
                <SelectItem value="<15">Unter 15 Min</SelectItem>
                <SelectItem value="15-30">15-30 Min</SelectItem>
                <SelectItem value=">30">Über 30 Min</SelectItem>
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
                onToggleFavorite={() => handleToggleFavorite(recipe.id)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">
            Suche nach Rezepten, um Ergebnisse zu sehen
          </p>
        )}
      </main>
    </div>
  );
};

export default Recipes;
