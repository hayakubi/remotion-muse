# Pilot: Kabin Winter + Salju Turun (Remotion)

## Versi aset asli (WinterCabinRealLoop)

Komposisi `WinterCabinRealLoop` memakai SVG asli user
(`03-winter_4.svg`). Script `tools/split-cabin-svg.py` memecah SVG itu
jadi layer-layer di `public/` (semuanya dengan viewBox yang sama,
jadi ditumpuk persis seperti ilustrasi asli):

- `cabin-base.svg`: badan, atap salju, cerobong, pintu, tanah salju
- `cabin-window-top.svg`, `cabin-window-left.svg`,
  `cabin-window-right.svg`: masing-masing berkedip beda siklus
- `cabin-tree-left.svg`, `cabin-tree-right.svg`: goyang kecil,
  poros di pangkal batang
- `cabin-smoke.svg`: bentuk asap asli, 3 kepul digilir

Render versi asli:

```bash
npx remotion render src/index.ts WinterCabinRealLoop out/winter-cabin-real-loop.mp4
```

Komposisi lama `WinterCabinLoop` tetap ada sebagai placeholder
pembanding.


Loop 10 detik, 1920x1080, 30fps, 300 frame. Frame 300 sama persis
dengan frame 0, jadi bisa diputar berulang tanpa putus.

## Yang bergerak

- **Salju turun** (`src/Snowfall.tsx`): 130 butir. Jarak jatuh per loop
  selalu kelipatan bulat tinggi layar, goyangan horizontal selalu
  jumlah siklus sinus bulat per loop. Itu yang bikin salju tidak
  melompat saat loop berulang.
- **Asap cerobong**: 3 kepul digilir. Tiap kepul naik, membesar, lalu
  memudar dengan opacity `sin(π*t)`, jadi 0 di awal dan akhir siklus.
- **Jendela**: kedip halus, beda siklus tiap jendela (2, 3, 4 siklus
  per loop) supaya tidak terlihat seragam atau strobo.
- **Pohon**: goyang 2-2,5 derajat, poros di bawah.
- **Bulan & bintang**: denyut dan twinkle dengan siklus bulat.

## Jalankan

```bash
npm install
npm run dev
# buka Remotion Studio, pilih komposisi WinterCabinLoop
```

Render MP4 final:

```bash
npm run render
# hasil: out/winter-cabin-loop.mp4
```

Preview cepat 3 detik (hemat waktu di laptop spek ringan):

```bash
npm run render:preview
```

Tips laptop Lenovo 2-core / 8GB: render 1080p dulu, jangan 4K.
Tutup aplikasi berat lain saat render. Kalau Studio terasa berat,
langsung `npm run render` saja tanpa membuka Studio.

## Ganti placeholder dengan EPS kabin aslimu

Template ini sengaja pakai bentuk kabin placeholder yang meniru
layout kabinmu. Untuk memakai aset aslimu:

1. Buka EPS kabin di Illustrator.
2. Namai layer/grupnya persis seperti ini (nama ini jadi `id` di SVG):
   - `cabin-body`, `roof-snow`, `chimney`, `smoke-origin`
   - `window-top`, `window-left`, `window-right`, `door`
   - `tree-left`, `tree-right`, `snow-ground`
3. Export sebagai SVG: File > Export > Export As > SVG.
   Centang opsi yang mempertahankan layer/group, jangan flatten.
4. Buka SVG hasil export, salin path tiap grup ke `src/WinterCabin.tsx`
   menggantikan grup placeholder dengan `id` yang sama.
5. Posisi asap: di kode, asap mulai di sekitar `left: 1140, top: 390`.
   Sesuaikan angka itu dengan posisi atas cerobong di SVG barumu.
6. Salju, goyangan, dan kedip tidak perlu diubah, karena semuanya
   digerakkan lewat `opacity` / `transform` grup, bukan lewat bentuk.

Kalau SVG-mu satu file utuh tanpa grup terpisah, pakai cara lain:
export tiap layer jadi SVG terpisah, lalu import tiap file sebagai
komponen dan beri transform masing-masing di Remotion.

## Cek loop sebelum upload

1. Putar hasil render 3x berturut-turut.
2. Perhatikan titik sambungan detik ke-10 ke detik ke-0: salju dan
   asap tidak boleh melompat.
3. Perhatikan juga detik ke-5: gerakan harus masih terasa, bukan
   seperti video yang diam di tengah.
4. Cek di layar penuh: tidak ada elemen yang terpotong di tepi,
   tidak ada watermark, teks, atau logo.

## Varian cepat dari template yang sama

Tanpa mengubah gerakan, kamu bisa dapat beberapa file jualan:

- Siang: ganti gradient background jadi biru muda terang, matikan
  bintang/bulan, jendela dibuat lebih redup.
- Malam: seperti pilot ini.
- Salju lebat: ubah `130` di Snowfall jadi `220`, dan `fallLoops`
  jadi lebih sering `2`.
- Salju pelan: ubah semua `fallLoops` jadi `1`.

Jangan kirim varian yang hanya beda 1 parameter kecil ke microstock
yang sama dalam waktu berdekatan kalau aturannya melarang duplikat
mirip, beri jeda atau ubah juga komposisi/backgroundnya.

## Judul & keyword awal (sesuaikan dengan platform)

Judul contoh: "Cozy snowy wooden cabin in winter night, falling snow,
chimney smoke, seamless loop"

Keyword awal: winter cabin, snowy house, christmas cabin, falling snow,
chimney smoke, winter night, cozy cabin, seamless loop, snow background,
winter landscape, holiday background
