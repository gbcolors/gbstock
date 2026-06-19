# GBstock

Tienda digital de GBstock montada con la integracion GotoEcommerce.

## Contenido

- Catalogo ecommerce con 1046 productos.
- 1000 fuentes de la coleccion GBstock Business 1000.
- 16 fuentes GBstock Plus.
- Productos digitales de fotografia, musica y sonidos.
- Pruebas tipograficas en ficha individual.
- Carrito, cuenta de usuario, historial de compras, descargas y tickets de soporte.
- Estructura lista para conectar Stripe, Mercado Pago y webhooks de checkout.

## Publicacion

Esta carpeta esta pensada para publicarse como raiz de:

```text
https://gatobronco.com/gbstock
```

Subir todo el contenido de esta carpeta al directorio `/gbstock` del sitio.

Archivos criticos:

- `index.html`
- `fotografia.html`
- `tipografias.html`
- `musica.html`
- `sonidos.html`
- `assets/gbstock.css`
- `assets/gotoecommerce-core.js`
- `assets/gbstock.config.js`
- `font-files/`
- `downloads/`

## Validacion esperada

`assets/gbstock.config.js` debe cargar 1046 productos y el catalogo debe paginar a 30 productos por pagina.

Las rutas de fuentes y descargas deben responder `200`, por ejemplo:

```text
/gbstock/font-files/releases/gbbiz-hotel-prime-001-sans/1.0.0/woff2/gbbiz-hotel-prime-001-sans-regular.woff2
/gbstock/downloads/gbbiz-restaurant-prime-002-serif-package.zip
```

## Marca

GBstock forma parte del ecosistema GB como tienda independiente de recursos digitales.
GotoEcommerce es la integracion ecommerce reutilizable para montar tiendas propias o de marca blanca.

## Tipografia de marca

El sitio usa `GBstock Plus Display`, una familia titular propia ubicada en:

```text
font-files/releases/gbstock-plus-display/1.0.0/
```

Incluye OTF, TTF y WOFF2. Esta fuente se usa para el wordmark y titulares de alto impacto de GBstock.
