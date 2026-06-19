# font-files - Flujo GBstock para fuentes

Esta carpeta centraliza las fuentes que lleguen desde cualquier proyecto de la suite y prepara los binarios finales para GBstock.

## Estructura exacta

```text
font-files/
  incoming/
    <proyecto-origen>/
      <fuente-original>/
        source/
        notes/
        license-evidence/
  sources/
    gotofont-softy-sans/
      gotofont-softy-sans.svg
  build/
    gotofont-softy-sans/
      gotofont-softy-sans.svg
  releases/
    gotofont-softy-sans/
      1.0.0/
        otf/
          gotofont-softy-sans-regular.otf
        ttf/
          gotofont-softy-sans-regular.ttf
        woff2/
          gotofont-softy-sans-regular.woff2
        licenses/
          LICENSE-COMERCIAL-BASE.txt
        previews/
          font-face.css
          preview.html
        manifest.json
  catalog/
    gotofont-softy-sans.json
```

## Regla de naming

- Todas las familias publicables deben usar marca `gotofont`.
- La primera familia queda como `gotofont Softy Sans`.
- No usar nombres parecidos a fuentes comerciales de terceros.
- Cada fuente entrante debe renombrarse antes de publicar si su nombre original se parece a una familia existente.

## Binarios finales requeridos

Cada release debe incluir:

- OTF para instalacion profesional/escritorio.
- TTF para compatibilidad amplia.
- WOFF2 para web.

La release inicial `gotofont-softy-sans/1.0.0` ya incluye los tres formatos.

## Registro para licencia y soporte legal

Cada fuente entrante debe traer o generar:

- Proyecto origen.
- Autor o responsable.
- Fecha de creacion o recepcion.
- Archivos fuente.
- Binarios compilados.
- Evidencia de autoria.
- Version de licencia personal, comercial y extendida.
- Specimen o preview.
- Hash/checksum recomendado antes de publicar.

## Comando de compilacion actual

Desde `work/`:

```powershell
node .\build-gotofont-softy-sans.js
```

