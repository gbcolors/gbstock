# GBstock deploy manifest

Destino publico:

```text
https://gatobronco.com/gbstock
```

Subir el contenido de esta carpeta como raiz de `/gbstock`.

## Archivos principales

- `index.html`
- `fotografia.html`
- `tipografias.html`
- `musica.html`
- `sonidos.html`
- `assets/gotoecommerce-core.js`
- `assets/gbstock.css`
- `assets/gbstock.config.js`
- `downloads/`

## Estado de productos

La tienda queda con 1042 productos listos para adquirir en prototipo:

- 1036 paquetes de fuentes finales con ZIP completo.
- 1000 pertenecen a la coleccion `GBstock Business 1000`, enfocada en negocios, tiendas, publicidad, anuncios, hoteles, restaurantes, retail, inmobiliarias, servicios y marcas comerciales.
- 16 pertenecen a la coleccion `GBstock Plus`, inspirada por tendencias generales de rounded sans premium, Bauhaus, monoline, ultra thin y display pesado, sin copiar contornos, nombres ni archivos de terceros.
- 2 productos de fotografia.
- 2 productos de musica.
- 2 productos de sonidos.

Todos los productos tienen:

- Precio.
- Categoria.
- Botones comprar/agregar/ver.
- Carrito.
- Checkout simulado exitoso.
- Aparicion posterior en cuenta de usuario.
- Link de descarga local.

## Fuentes finales

Cada fuente publicada incluye:

- OTF final.
- TTF final.
- WOFF2 final.
- Manifest.
- Licencia base.
- Preview web para tester.
- Credito `Designed by ...`.

La lista de fuentes usa paginacion de 30 elementos por pagina. Al hacer click en una fuente se abre su ficha con tester fijo, sin control de cambio de tamano.

## Produccion

Para compra real falta conectar backend de `gotoecommerce`:

- Checkout Mercado Pago/Stripe.
- Webhooks verificados.
- Autenticacion real.
- Links temporales de descarga.
- Ordenes persistentes.
- Tickets persistentes.
