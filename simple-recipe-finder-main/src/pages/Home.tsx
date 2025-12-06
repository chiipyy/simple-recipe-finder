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
            Discover <span className="text-primary font-medium">your next</span>{' '}
            favorite recipe
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Find recipes that match the ingredients you have at home, or discover
            new culinary ideas.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button size="lg" asChild>
              <Link to="/ingredients">
                <ChefHat className="mr-2" size={20} />
                Tell me your ingredients
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link to="/recipes">
                <Search className="mr-2" size={20} />
                Look for Recipes
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link to="/random">
                Random Recipe
              </Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Search className="text-primary" size={24} />
            </div>
            <h3 className="font-medium">Search for recipes</h3>
            <p className="text-sm text-muted-foreground">
              Search thousands of recipes using filters for country cuisines or
              categories.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <ChefHat className="text-primary" size={24} />
            </div>
            <h3 className="font-medium">Enter ingredients</h3>
            <p className="text-sm text-muted-foreground">
              Find recipes based on what you already have at home and exclude
              things you don&apos;t feel like eating.
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Heart className="text-primary" size={24} />
            </div>
            <h3 className="font-medium">Save favorites</h3>
            <p className="text-sm text-muted-foreground">
              Save your favorite recipes for later.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
