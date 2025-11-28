import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, Heart, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import { recipeApi, favoritesApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      
      const result = await recipeApi.getById(id);
      
      if (result.error) {
        toast({
          title: 'Fehler',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        setRecipe(result.data);
        setIsFavorite((result.data as any)?.isFavorite || false);
      }
      
      setLoading(false);
    };

    fetchRecipe();
  }, [id, toast]);

  const handleToggleFavorite = async () => {
    if (!id) return;
    
    if (isFavorite) {
      await favoritesApi.remove(id);
    } else {
      await favoritesApi.add(id);
    }
    
    setIsFavorite(!isFavorite);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Lädt...</p>
        </main>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Rezept nicht gefunden</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-6">
          <Link to="/recipes">
            <ArrowLeft size={16} className="mr-2" />
            Zurück
          </Link>
        </Button>

        <div className="max-w-4xl mx-auto">
          <div className="aspect-video w-full overflow-hidden rounded-lg mb-8 bg-muted">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex items-start justify-between gap-4 mb-6">
            <h1 className="text-3xl md:text-4xl font-light">{recipe.title}</h1>
            <Button variant="ghost" size="lg" onClick={handleToggleFavorite}>
              <Heart
                size={24}
                className={isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'}
              />
            </Button>
          </div>

          {recipe.time && (
            <div className="flex items-center gap-2 text-muted-foreground mb-8">
              <Clock size={18} />
              <span>{recipe.time}</span>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <h2 className="text-xl font-medium mb-4">Zutaten</h2>
              <ul className="space-y-2">
                {recipe.ingredients?.map((ingredient: string, index: number) => (
                  <li key={index} className="text-sm">
                    • {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h2 className="text-xl font-medium mb-4">Zubereitung</h2>
              <ol className="space-y-4">
                {recipe.instructions?.map((instruction: string, index: number) => (
                  <li key={index} className="flex gap-3">
                    <span className="font-medium text-primary">{index + 1}.</span>
                    <span className="text-sm">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {recipe.nutrition && (
            <div className="mt-8 p-6 bg-muted rounded-lg">
              <h2 className="text-xl font-medium mb-4">Nährwerte</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(recipe.nutrition).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm text-muted-foreground capitalize">{key}</p>
                    <p className="text-lg font-medium">{value as string}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RecipeDetail;
