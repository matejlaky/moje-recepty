# Moje recepty

Jednoduchá responzívna webová aplikácia na evidenciu receptov. Funguje ako statická stránka a je vhodná na bezplatné publikovanie cez GitHub Pages.

## Súbory
- `index.html` – štruktúra aplikácie
- `styles.css` – vzhľad a responzívne rozloženie
- `app.js` – suroviny, recepty, filtrovanie a ukladanie

## Publikovanie na GitHub Pages
1. Nahraj všetky tri súbory (README môžeš nahrať tiež) do koreňového priečinka repozitára.
2. Otvor **Settings → Pages**.
3. V časti **Build and deployment** vyber **Deploy from a branch**.
4. Vyber branch `main` a priečinok `/ (root)`, potom klikni **Save**.
5. Počkaj na zverejnenie stránky; GitHub zobrazí jej adresu v sekcii Pages.

## Dôležité upozornenie k ukladaniu
GitHub Pages neposkytuje databázu. Recepty sa ukladajú do `localStorage` konkrétneho prehliadača a zariadenia. Na inom mobile alebo počítači sa automaticky nezobrazia. Použi **Exportovať zálohu** a **Importovať zálohu** na prenos dát. Synchronizácia medzi zariadeniami by vyžadovala samostatnú databázu, napríklad Supabase.

## Funkcie
- kategórie Hlavné jedlo, Polievka a Koláč
- výber surovín, ktoré máš doma
- percentuálna zhoda a zoznam chýbajúcich surovín
- radenie podľa zhody, chýbajúcich surovín alebo A–Z
- pridávanie a mazanie receptov
- vyhľadávanie surovín a vlastné suroviny
- export a import JSON zálohy

Aplikácia nepočíta množstvá surovín ani náhrady; každú surovinu berie rovnako.
