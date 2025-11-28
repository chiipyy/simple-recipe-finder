import { Link } from 'react-router-dom';
import { Search, ChefHat, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl md:text-6xl font-light tracking-tight">
            Entdecke <span className="text-primary font-medium">dein nächstes</span> Lieblingsrezept
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Finde Rezepte, die zu deinen vorhandenen Zutaten passen, oder entdecke neue kulinarische Ideen.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" asChild>
              <Link to="/ingredients">
                <ChefHat className="mr-2" size={20} />
                Was habe ich zu Hause?
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" asChild>
              <Link to="/recipes">
                <Search className="mr-2" size={20} />
                Rezepte durchsuchen
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Search className="text-primary" size={24} />
            </div>
            <h3 className="font-medium">Rezepte suchen</h3>
            <p className="text-sm text-muted-foreground">
              Durchsuche tausende Rezepte mit Filtern nach Kategorie und Zeit
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <ChefHat className="text-primary" size={24} />
            </div>
            <h3 className="font-medium">Zutaten eingeben</h3>
            <p className="text-sm text-muted-foreground">
              Finde Rezepte basierend auf dem, was du bereits zu Hause hast
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Heart className="text-primary" size={24} />
            </div>
            <h3 className="font-medium">Favoriten speichern</h3>
            <p className="text-sm text-muted-foreground">
              Merke dir deine Lieblingsrezepte für später
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
