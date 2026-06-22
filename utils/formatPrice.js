export function formatPrice(value, currency = 'TRY'){
  return new Intl.NumberFormat('tr-TR', {
    style:'currency', currency, minimumFractionDigits:2, maximumFractionDigits:2
  }).format(Number(value) || 0);
}

