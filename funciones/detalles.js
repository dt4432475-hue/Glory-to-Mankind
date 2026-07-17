document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const idProducto = urlParams.get('id');

    if (!idProducto) return;

    const archivos = ['apks.json', 'mods.json', 'addons.json'];
    let productoEncontrado = null;

    for (const archivo of archivos) {
        try {
            const respuesta = await fetch(`secciones/${archivo}`);
            const datos = await respuesta.json();
            productoEncontrado = datos.find(item => item.id == idProducto);
            if (productoEncontrado) break;
        } catch (e) { console.error("Error buscando:", e); }
    }

    if (productoEncontrado) {

    document.getElementById('titulo').innerText = productoEncontrado.titulo;
    document.getElementById('imagen-destacada').src = productoEncontrado.imagenDestacada; // Usamos el nuevo campo
    document.getElementById('descripcion').innerText = productoEncontrado.info;
    document.getElementById('link-descarga').href = productoEncontrado.link;
    } else {
        document.getElementById('titulo').innerText = "Producto no encontrado";
    }
});