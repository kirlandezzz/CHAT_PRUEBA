# Limpilla — Bio-solución para la tunera canaria

Web de difusión del proyecto **Limpilla**, que investiga el uso de aceites
esenciales de la flora canaria como bioinsecticidas para el control de
*Dactylopius opuntiae* (cochinilla silvestre) en *Opuntia ficus-indica* (tunera).

Universidad de La Laguna · IUBO-AG · Programa INGENIA.

## Estructura del repositorio

```
CHAT_PRUEBA/
├── docs/               ← sitio web (servido por GitHub Pages)
│   ├── index.html
│   ├── css/styles.css
│   ├── js/script.js
│   ├── js/lib/three.min.js
│   ├── img/            (fotografías y logo)
│   └── video/          (vídeos de presentación)
└── materiales/         ← fuentes (no se publican)
    ├── fotos/          (originales de WhatsApp)
    ├── poster-texto.txt
    └── poster-limpilla-miniatura.jpg
```

## Desarrollo local

Abrir `docs/index.html` directamente en el navegador funciona, pero para que los
vídeos y la animación 3D carguen sin problemas conviene un servidor:

**Opción A — Live Server (VSCode):** instala la extensión *Live Server* y haz
click derecho sobre `docs/index.html` → *Open with Live Server*.

**Opción B — Python:**

```bash
cd docs
python3 -m http.server 8000
# abre http://localhost:8000
```

## Deploy en GitHub Pages

1. Sube los cambios:

   ```bash
   git add -A
   git commit -m "Rename web/ → docs/ y añadir README"
   git push
   ```

2. En GitHub: **Settings → Pages**.
3. *Source:* **Deploy from a branch**.
4. *Branch:* `main`, *Folder:* **`/docs`**.
5. *Save.*

En ~1 minuto el sitio estará disponible en
`https://kirlandezzz.github.io/CHAT_PRUEBA/`.

## Dependencias

El sitio es estático y **no requiere build**. La única biblioteca externa es
[Three.js](https://threejs.org/) (r128), incluida localmente en
`docs/js/lib/three.min.js` para que la web funcione también offline.

Las tipografías *Fraunces* e *Inter* se cargan desde Google Fonts.

## Licencia

Material académico de los autores — uso para difusión científica.
