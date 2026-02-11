export const formatCurrency = (amount, currency = "USD") => {
    if (isNaN(amount)) return "₹0.00";
    return amount.toLocaleString("en-IN", {
        style: "currency",
        currency,
        minimumFractionDigits: 2,
    });
};