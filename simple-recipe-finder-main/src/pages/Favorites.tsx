import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import Header from '@/components/Header';
import RecipeCard from '@/components/RecipeCard';
import { favoritesApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';
import { getAuthToken } from '@/lib/api';

const Favorites = () => {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const isAuthenticated = !!getAuthToken();

  useEffect(() => {
    const fetchFavorites = async () => {
      const result = await favoritesApi.getAll();
      
      if (result.error) {
        toast({
          title: 'Fehler',
          description: result.error,
          variant: 'destructive',
        });
      } else {
        setFavorites((result.data as any[]) || []);
      }
      
      setLoading(false);
    };

    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [isAuthenticated, toast]);

  const handleToggleFavorite = async (recipeId: string) => {
    await favoritesApi.remove(recipeId);
    setFavorites(favorites.filter((f) => f.id !== recipeId));
    
    toast({
      title: 'Entfernt',
      description: 'Rezept aus Favoriten entfernt',
    });
  };

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-light mb-8 flex items-center gap-3">
          <Heart className="text-primary" size={32} />
          Meine Favoriten
        </h1>

        {loading ? (
          <p className="text-center text-muted-foreground">Lädt...</p>
        ) : favorites.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                {...recipe}
                isFavorite={true}
                onToggleFavorite={() => handleToggleFavorite(recipe.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Heart className="mx-auto text-muted-foreground mb-4" size={48} />
            <p className="text-muted-foreground">
              Du hast noch keine Favoriten gespeichert
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;
