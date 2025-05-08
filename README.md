# Repositori Aplikasi Web GeoApp

## Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:

- [Git](https://git-scm.com/downloads)
- [Node.js dan npm](https://nodejs.org/en/download/)
- [pnpm](https://pnpm.io/installation)

## Memulai

Pertama, instal semua dependensi menggunakan pnpm

```bash
pnpm install
```

Kedua, minta file .env.local kepada Administrator

Kemudian, jalankan server pengembangan:

```bash
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000) dengan browser Anda untuk melihat hasilnya.

## Sebelum membuat pull request

1. Jalankan script build terlebih dahulu agar Next.js melakukan build produksi yang dioptimalkan menggunakan pnpm

```bash
pnpm build
```

2. Buat pull request di Github. Pastikan komentarnya jelas untuk menghindari kesalahpahaman

3. Beri tahu tim pengembang, idealnya minta salah satu dari mereka untuk meninjau perubahan

4. Setelah selesai, gabungkan (merge) branch tersebut

5. [OPSIONAL] Jika Anda merasa tugas sudah selesai, hapus saja branch tersebut

## Tech Stack (Diperbarui secara berkala)

- Framework Utama: Next.js 13
- Framework UI: Shadcn UI
- Manajemen state: Zustand
