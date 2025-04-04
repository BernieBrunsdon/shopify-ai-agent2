import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const BundleSuggestion = ({ products }) => {
    if (!products.length)
        return null;
    return (_jsxs("section", { className: "bundle-section", children: [_jsx("h2", { children: "Recommended Bundle" }), _jsx("ul", { className: "product-list", children: products.slice(0, 3).map(product => (_jsxs("li", { className: "product-item", children: [_jsx("h3", { children: product.title }), _jsxs("p", { children: ["$", product.variants[0]?.price || 'N/A'] })] }, product.id))) })] }));
};
export default BundleSuggestion;
