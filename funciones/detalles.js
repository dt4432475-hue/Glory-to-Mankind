document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const idProducto = urlParams.get('id');

    if (!idProducto) {
        document.getElementById('titulo').innerText = "No se especificó un producto";
        return;
    }

    const archivos = ['apks.json', 'mods.json', 'addons.json'];
    let productoEncontrado = null;

    for (const archivo of archivos) {
        try {
            const respuesta = await fetch(`secciones/${archivo}`);
            const datos = await respuesta.json();
            
            // Usamos String() para asegurar que ambos sean texto y comparar bien
            productoEncontrado = datos.find(item => String(item.id) === String(idProducto));
            if (productoEncontrado) break;
        } catch (e) { console.error("Error buscando:", e); }
    }

    if (productoEncontrado) {
        document.getElementById('titulo').innerText = productoEncontrado.titulo;
        document.getElementById('descripcion').innerText = productoEncontrado.info || productoEncontrado.descripcion;
        document.getElementById('link-descarga').href = productoEncontrado.link;
        
        // Si la imagen no existe en el JSON, ponemos el icono como respaldo
        const imgElement = document.getElementById('imagen-destacada');
        imgElement.src = productoEncontrado.imagenDestacada || productoEncontrado.icono;
    } else {
        document.getElementById('titulo').innerText = "Producto no encontrado";
    }
});