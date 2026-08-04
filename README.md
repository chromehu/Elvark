# ELVARK – Online oktatási platform

Az ELVARK egy online oktatási platform, amely videókurzusokat, digitális tananyagokat és élő online oktatásokat kapcsol össze.

## Technológiák

- **Next.js 13** (App Router, TypeScript)
- **Tailwind CSS** (saját színrendszer: navy, cobalt, teal)
- **Supabase** (autentikáció, adatbázis, RLS)
- **lucide-react** (ikonok)

## Beállítás

### 1. Supabase projekt létrehozása

1. Navigálj a [supabase.com](https://supabase.com) oldalra, és jelentkezz be.
2. Kattints a **New Project** gombra.
3. Adj nevet a projektnek (pl. "ELVARK").
4. Válassz egy régiót (pl. EU Central).
5. Állíts be egy erős jelszót az adatbázishoz.
4. Kattints a **Create new project** gombra.

### 2. API kulcsok másolása

1. A Supabase projekt irányítópultján navigálj a **Project Settings > API** oldalra.
2. Keresd meg a **Project URL** mezőt — ez a `NEXT_PUBLIC_SUPABASE_URL`.
3. Keresd meg az **anon public** kulcsot — ez a `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   > **Fontos:** Soha ne használd a **service_role** kulcsot a böngészőben. Az csak szerveroldali műveletekhez való.

### 3. `.env.local` konfigurálása

Hozd létre a `.env.local` fájlt a projekt gyökérkönyvtárában:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://peldaprojekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_MODE=true
```

### 4. Adatbázis migráció futtatása

A migrációt a Supabase MCP eszközökkel kell alkalmazni. Ha a Bolt környezetben vagy, a migráció automatikusan megtörténik. Ha manuálisan kell futtatni, nyisd meg a **SQL Editor**-t a Supabase irányítópulton, és másold be a `supabase/migrations/` mappában lévő SQL-t.

### 5. Authentikáció átirányítási URL-ek beállítása

1. A Supabase irányítópulton navigálj a **Authentication > URL Configuration** oldalra.
2. A **Site URL** mezőbe írd be a oldalad URL-jét (pl. `http://localhost:3000`).
3. A **Redirect URLs** listához add hozzá:
   - `http://localhost:3000/jelszo-visszaallitas`
   - (produkciónál a saját domain-t)

### 6. E-mail megerősítés beállítása

1. A Supabase irányítópulton navigálj a **Authentication > Providers** oldalra.
2. Kattints az **Email** provider-re.
3. A **Confirm email** kapcsoló:
   - **Kikapcsolva** (alapértelmezett): A regisztráció után a felhasználó azonnal bejelentkezik.
   - **Bekapcsolva**: A regisztráció után a felhasználónak meg kell erősítenie az e-mail-címét egy linkkel.

### 7. Első felhasználó létrehozása

1. Indítsd el a fejlesztői szervert: `npm run dev`
2. Nyisd meg a `http://localhost:3000/regisztracio` oldalt.
3. Regisztrálj egy új fiókot (minden fiók hallgatóként kezd).

### 8. Admin jogosultság beállítása

> **Figyelem:** A felhasználónak már regisztráltnak kell lennie!

Nyisd meg a **SQL Editor**-t a Supabase irányítópulton, és futtasd a következő SQL-t (cseréld ki az e-mail-címet):

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'te@email.hu';
```

Ezután a felhasználó adminisztrátor szerepkörbe kerül, és hozzáfér az `/admin` felülethez.

### 9. Oktatói jelentkezés tesztelése

1. Jelentkezz be hallgató fiókkal.
2. Navigálj a `/oktato-jelentkezes` oldalra.
3. Töltsd ki az űrlapot és küldd be.
4. Jelentkezz be admin fiókkal.
5. Navigálj az `/admin` oldalra.
6. A "Oktatói jelentkezések" szekcióban jóváhagyhatod vagy elutasíthatod a jelentkezést.

### 10. Védett útvonalak tesztelése

- **Kijelentkezett állapotban** navigálj a `/fiokom` oldalra — átirányít a `/belepes` oldalra.
- **Hallgató fiókkal** navigálj az `/admin` oldalra — "Nincs jogosultság" oldal.
- **Hallgató fiókkal** navigálj az `/oktato` oldalra — átirányít az `/oktato-jelentkezes` oldalra.
- **Oktató fiókkal** navigálj az `/admin` oldalra — "Nincs jogosultság" oldal.

### 11. Jelszó visszaállítás tesztelése

1. Navigálj az `/elfelejtett-jelszo` oldalra.
2. Add meg az e-mail-címed.
3. Ellenőrizd a postaládádat a visszaállítási linkért.
4. Kattints a linkre, ami az `/jelszo-visszaallitas` oldalra visz.
5. Állítsd be az új jelszót.

### 12. Demó mód kikapcsolása

Állítsd be a `NEXT_PUBLIC_DEMO_MODE=false` értéket a `.env.local` fájlban. Ez eltünteti a demó banner-t és a demó szerepkör-választót.

### 13. Produkción build

```bash
npm run build
```

## Fejlesztés

```bash
npm run dev    # Fejlesztői szerver
npm run build  # Produkción build
npm run lint   # ESLint ellenőrzés
```

## Biztonsági megjegyzések

- A **service-role kulcs** soha nem kerül a böngészőbe.
- A szerepkörök (role) és státuszok (status) módosítása csak SECURITY DEFINER függvényeken keresztül történik, amelyek ellenőrzik a hívó admin jogosultságát.
- A felhasználók nem módosíthatják a saját szerepkörüket vagy státuszukat — ez adatbázis szinten van korlátozva (REVOKE + GRANT).
- A demó nézet kizárólag a felületek megtekintésére szolgál, és nem módosítja a fiók jogosultságait.
