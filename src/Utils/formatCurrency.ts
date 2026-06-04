export const formatCurrency = (amount: number = 0) =>
  `৳ ${amount.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
