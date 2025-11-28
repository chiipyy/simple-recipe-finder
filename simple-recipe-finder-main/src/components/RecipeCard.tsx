import { Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface RecipeCardProps {
  id: string;
  title: string;
  image: string;
  description?: string;
  time?: string;
  tags?: string[];
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const RecipeCard = ({
  id,
  title,
  image,
  description,
  time,
  tags = [],
  isFavorite = false,
  onToggleFavorite,
}: RecipeCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/recipe/${id}`} className="block">
        <div className="aspect-video w-full overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link to={`/recipe/${id}`}>
            <h3 className="font-medium text-lg hover:text-primary transition-colors">
              {title}
            </h3>
          </Link>
          {onToggleFavorite && (
            <Button
              variant="ghost"
              size="sm"
              className="shrink-0"
              onClick={onToggleFavorite}
            >
              <Heart
                size={18}
                className={isFavorite ? 'fill-primary text-primary' : 'text-muted-foreground'}
              />
            </Button>
          )}
        </div>

        {description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex items-center gap-2 flex-wrap">
          {time && (
            <span className="text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground">
              {time}
            </span>
          )}
          {tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default RecipeCard;
