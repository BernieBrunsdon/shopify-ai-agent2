import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const ComparisonTable = ({ products }) => {
    if (!products.length)
        return null;
    return (_jsxs("section", { className: "comparison-section", children: [_jsx("h2", { children: "Product Comparison" }), _jsxs("table", { className: "comparison-table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Product" }), _jsx("th", { children: "Price" })] }) }), _jsx("tbody", { children: products.map(product => (_jsxs("tr", { children: [_jsx("td", { children: product.title }), _jsxs("td", { children: ["$", product.variants[0]?.price || 'N/A'] })] }, product.id))) })] })] }));
};
export default ComparisonTable;
