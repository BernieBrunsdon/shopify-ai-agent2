/*
  # Initial Schema Setup for E-commerce Chatbot

  1. New Tables
    - `stores`
      - Store configuration and settings
    - `conversations`
      - Customer chat history with context
    - `orders`
      - Order tracking and details
    - `products`
      - Product catalog sync
    - `customer_preferences`
      - Customer shopping preferences and history

  2. Security
    - Enable RLS on all tables
    - Add policies for store-specific access
*/

-- Stores table for multi-tenant support
CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  platform text NOT NULL, -- 'shopify' or 'standalone'
  settings jsonb DEFAULT '{}'::jsonb,
  shopify_domain text,
  shopify_access_token text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Conversations table for chat history
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id),
  customer_id text NOT NULL,
  context jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Messages within conversations
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id),
  role text NOT NULL,
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Orders table for tracking
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id),
  platform_order_id text NOT NULL,
  customer_id text NOT NULL,
  status text NOT NULL,
  order_data jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Products table for catalog
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id),
  platform_product_id text NOT NULL,
  name text NOT NULL,
  description text,
  price decimal(10,2) NOT NULL,
  inventory_quantity integer,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Customer preferences and history
CREATE TABLE IF NOT EXISTS customer_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid REFERENCES stores(id),
  customer_id text NOT NULL,
  preferences jsonb DEFAULT '{}'::jsonb,
  shopping_history jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Store owners can access their store data"
  ON stores FOR ALL
  USING (
    auth.uid()::text IN (
      SELECT jsonb_array_elements_text(settings->'authorized_users')
      FROM stores
      WHERE id = stores.id
    )
  );

CREATE POLICY "Store can access their conversations"
  ON conversations FOR ALL
  USING (
    store_id IN (
      SELECT id FROM stores 
      WHERE auth.uid()::text IN (
        SELECT jsonb_array_elements_text(settings->'authorized_users')
        FROM stores
        WHERE id = conversations.store_id
      )
    )
  );

-- Create indexes for better performance
CREATE INDEX idx_conversations_store_id ON conversations(store_id);
CREATE INDEX idx_orders_store_id ON orders(store_id);
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_customer_preferences_store_id ON customer_preferences(store_id);