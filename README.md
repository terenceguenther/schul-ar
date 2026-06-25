# Schulgebäude in AR – Abiturientenball

Kleine Webseite, die unser 3D-Druck-Modell der Schule per QR-Code in **Augmented Reality** zeigt –
**ohne App**, direkt im Browser (iPhone = Apple Quick Look, Android = Google Scene Viewer).

## Inhalt
```
index.html                  # die AR-Seite
models/schulmodell.glb      # 3D-Modell für Android / Web (3,3 MB)
models/schulmodell.usdz     # 3D-Modell für iPhone (1,9 MB)
.nojekyll                   # nötig, damit GitHub Pages den models-Ordner ausliefert
```

## Online stellen mit GitHub Pages
1. Auf github.com ein neues Repository anlegen, z. B. `schul-ar` (Public).
2. Alle Dateien hochladen (**„Add file → Upload files“**, Ordnerstruktur beibehalten).
3. **Settings → Pages → Branch: `main` / `(root)` → Save.**
4. Nach ~1 Minute ist die Seite erreichbar unter:
   `https://DEIN-NUTZERNAME.github.io/schul-ar/`

## Alternative ohne GitHub-Konto: Netlify Drop
Ganzen Ordner auf https://app.netlify.com/drop ziehen → sofort eine öffentliche URL.

## QR-Code
Aus der fertigen URL einen QR-Code erzeugen (z. B. qr-code-generator.com) und auf
die Vortragsfolie / ein Plakat drucken. Gäste scannen → „In AR ansehen“ → fertig.

## Hinweise
- Beim ersten Mal fragt Android ggf., ob „Google Play Services für AR“ aktualisiert werden
  sollen – das ist Googles eigene Systemkomponente, **keine fremde App**.
- Das Modell erscheint als ~40 cm großes Tischmodell und kann mit zwei Fingern gedreht/skaliert werden.
- Titel/Text in `index.html` oben frei anpassbar (Schulname etc.).
