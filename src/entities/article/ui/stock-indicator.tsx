// src/entities/article/ui/stock-indicator.tsx
import { cn } from '../../../shared/lib/utils';
import type { Article } from '../model/schema';

export type ArticleStockIndicatorProps = {
  article: Article;
};

export const ArticleStockIndicator = ({ article }: ArticleStockIndicatorProps) => {
  const { stock, minStock, unit = 'Stück' } = article;
  const isLow = stock <= minStock;

  return (
    <div className={cn('font-medium', isLow && 'text-orange-600')}>
      {stock} {unit}
      {isLow && <span className="text-xs"> ⚠️</span>}
    </div>
  );
};
