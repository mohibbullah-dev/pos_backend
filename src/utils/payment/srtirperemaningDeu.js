const remaingDue = (order) => {
  const total = Number(order?.bills?.totalWithTax || 0);
  const paid = Number(order?.paidTotal || 0);
  return Math.max(0, total - paid);
};

export { remaingDue };
