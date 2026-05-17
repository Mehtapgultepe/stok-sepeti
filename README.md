# 🛒 StokSepeti

Gıda Son Tüketim Tarihi ve Mutfak Stok Takip Sistemi

## Proje Hakkında

StokSepeti, mutfaktaki ürünlerin son tüketim tarihlerini takip eden, israfı önlemeye yardımcı olan bir web uygulamasıdır. Ürünler otomatik olarak **Taze**, **Kritik** (3 gün veya daha az) ve **Tarihi Geçmiş** olarak etiketlenir.

## Teknolojiler

- **Frontend:** Vanilla JavaScript (SPA), HTML, CSS
- **Backend:** Node.js, Express
- **Veritabanı:** SQLite (better-sqlite3)
- **API Dokümantasyonu:** Swagger UI (OpenAPI 3.0)
- **Test:** Jest

## Kurulum

### Gereksinimler

- Node.js v18+
- npm

### Adımlar

```bash
git clone https://github.com/KULLANICI_ADIN/stok-sepeti.git
cd stok-sepeti/backend
npm install
npm start
```

Frontend için `frontend/index.html` dosyasını tarayıcıda açın.

## Çalıştırma

```bash
cd backend
npm start
# API: http://localhost:3001
# Swagger: http://localhost:3001/api-docs
```

## API Kullanımı

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | /api/products | Tüm ürünleri listele |
| GET | /api/products?filter=critical | Kritik ürünleri listele |
| GET | /api/products?sortBy=asc | Son tarihe göre sırala |
| GET | /api/products/:id | Tek ürün getir |
| POST | /api/products | Yeni ürün ekle |
| PUT | /api/products/:id | Ürün güncelle |
| DELETE | /api/products/:id | Ürün sil |

### Örnek İstek

```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Süt","category":"Süt Ürünleri","quantity":1,"unit":"L","expiry_date":"2026-05-20"}'
```

## Testleri Çalıştırma

```bash
cd backend
npm test
```

## Proje Yapısı

```
stok-sepeti/
├── backend/
│   └── src/
│       ├── app.js
│       ├── db.js
│       ├── swagger.js
│       ├── routes/
│       │   └── products.js
│       ├── services/
│       │   └── productService.js
│       └── tests/
│           └── productService.test.js
└── frontend/
    ├── index.html
    ├── style.css
    └── app.js
```
