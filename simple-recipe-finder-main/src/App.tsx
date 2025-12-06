// src/App.tsx
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Recipes from './pages/Recipes';
import Ingredients from './pages/Ingredients';
import RecipeDetail from './pages/RecipeDetail';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';
import RandomRecipePage from './pages/RandomRecipe';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/ingredients" element={<Ingredients />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/random" element={<RandomRecipePage />} />
          {/* Catch-all immer ganz unten */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
