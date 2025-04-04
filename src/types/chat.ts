export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  metadata?: {
    intent?: string;
    confidence?: number;
    entities?: any[];
    suggestions?: string[];
    orderInfo?: any;
    productInfo?: any;
    comparisons?: ProductComparison[];
    bundleSuggestions?: ProductBundle[];
    priceAlerts?: PriceAlert[];
    type?: 'comparison' | 'bundle';
    products?: any[];
    comparison?: string;
    bundles?: any[];
  };
}

interface ProductComparison {
  // Define your comparison fields
}

interface ProductBundle {
  // Define your bundle fields
}

interface PriceAlert {
  // Define your alert fields
}