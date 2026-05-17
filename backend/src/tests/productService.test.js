const { getDaysUntilExpiry, getStatus } = require('../services/productService');

function localDate(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toLocaleDateString('en-CA'); // YYYY-MM-DD
}

describe('getDaysUntilExpiry', () => {
  test('geçmiş tarih için negatif döner', () => {
    expect(getDaysUntilExpiry(localDate(-5))).toBeLessThan(0);
  });

  test('bugünkü tarih için 0 döner', () => {
    expect(getDaysUntilExpiry(localDate(0))).toBe(0);
  });

  test('5 gün sonrası için 5 döner', () => {
    expect(getDaysUntilExpiry(localDate(5))).toBe(5);
  });
});

describe('getStatus', () => {
  test('geçmiş tarih → Tarihi Geçmiş', () => {
    expect(getStatus(localDate(-1))).toBe('Tarihi Geçmiş');
  });

  test('2 gün kalan → Kritik', () => {
    expect(getStatus(localDate(2))).toBe('Kritik');
  });

  test('10 gün kalan → Taze', () => {
    expect(getStatus(localDate(10))).toBe('Taze');
  });
});
