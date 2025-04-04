import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, PackageSearch, BarChart2, ShoppingCart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { Message, ProductComparison, ProductBundle } from '../types/chat';

interface ChatInterfaceProps {
  onSendMessage: (message: string) => Promise<void>;
  messages: Message[];
  isLoading: boolean;
}

export function ChatInterface({ onSendMessage, messages, isLoading }: ChatInterfaceProps) {
  const [input, setInput] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    const message = input.trim();
    setInput('');
    await onSendMessage(message);
  };

  const renderProductComparison = (comparison: ProductComparison) => {
    if (!comparison || !comparison.products.length) return null;
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 mt-4">
        <h3 className="text-lg font-semibold mb-3">Product Comparison</h3>
        {/* Comparison UI implementation */}
      </div>
    );
  };

  const renderBundleSuggestions = (bundles: ProductBundle[]) => {
    if (!bundles || !bundles.length) return null;
    return (
      <div className="bg-white rounded-lg shadow-lg p-4 mt-4">
        <h3 className="text-lg font-semibold mb-3">Recommended Bundles</h3>
        {/* Bundle UI implementation */}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <Bot className="w-6 h-6 text-blue-600 mr-2" />
          <h2 className="text-lg font-semibold">Smart Shopping Assistant</h2>
        </div>
        <div className="flex space-x-2">
          <button
            className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100"
            onClick={() => setShowComparison(!showComparison)}
          >
            <PackageSearch className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100">
            <BarChart2 className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <ReactMarkdown className="prose prose-sm">
                {message.content}
              </ReactMarkdown>
              {message.metadata?.comparisons && renderProductComparison(message.metadata.comparisons[0])}
              {message.metadata?.bundleSuggestions && renderBundleSuggestions(message.metadata.bundleSuggestions)}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-lg p-3 animate-pulse">
              Analyzing your request...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about products, orders, or get recommendations..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}