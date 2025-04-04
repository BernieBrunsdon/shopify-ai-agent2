import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, PackageSearch, BarChart2, ShoppingCart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
export function ChatInterface({ onSendMessage, messages, isLoading }) {
    const [input, setInput] = useState('');
    const [showComparison, setShowComparison] = useState(false);
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading)
            return;
        const message = input.trim();
        setInput('');
        await onSendMessage(message);
    };
    const renderProductComparison = (comparison) => {
        if (!comparison || !comparison.products.length)
            return null;
        return (_jsx("div", { className: "bg-white rounded-lg shadow-lg p-4 mt-4", children: _jsx("h3", { className: "text-lg font-semibold mb-3", children: "Product Comparison" }) }));
    };
    const renderBundleSuggestions = (bundles) => {
        if (!bundles || !bundles.length)
            return null;
        return (_jsx("div", { className: "bg-white rounded-lg shadow-lg p-4 mt-4", children: _jsx("h3", { className: "text-lg font-semibold mb-3", children: "Recommended Bundles" }) }));
    };
    return (_jsxs("div", { className: "flex flex-col h-full bg-white rounded-lg shadow-lg", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Bot, { className: "w-6 h-6 text-blue-600 mr-2" }), _jsx("h2", { className: "text-lg font-semibold", children: "Smart Shopping Assistant" })] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { className: "p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100", onClick: () => setShowComparison(!showComparison), children: _jsx(PackageSearch, { className: "w-5 h-5" }) }), _jsx("button", { className: "p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100", children: _jsx(BarChart2, { className: "w-5 h-5" }) }), _jsx("button", { className: "p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-gray-100", children: _jsx(ShoppingCart, { className: "w-5 h-5" }) })] })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [messages.map((message) => (_jsx("div", { className: `flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`, children: _jsxs("div", { className: `max-w-[80%] rounded-lg p-3 ${message.role === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-800'}`, children: [_jsx(ReactMarkdown, { className: "prose prose-sm", children: message.content }), message.metadata?.comparisons && renderProductComparison(message.metadata.comparisons[0]), message.metadata?.bundleSuggestions && renderBundleSuggestions(message.metadata.bundleSuggestions)] }) }, message.id))), isLoading && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-gray-100 rounded-lg p-3 animate-pulse", children: "Analyzing your request..." }) })), _jsx("div", { ref: messagesEndRef })] }), _jsx("form", { onSubmit: handleSubmit, className: "p-4 border-t", children: _jsxs("div", { className: "flex space-x-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), placeholder: "Ask about products, orders, or get recommendations...", className: "flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600", disabled: isLoading }), _jsx("button", { type: "submit", disabled: isLoading || !input.trim(), className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed", children: _jsx(Send, { className: "w-5 h-5" }) })] }) })] }));
}
