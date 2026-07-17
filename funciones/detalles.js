let enlaceReal = "";

document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const idProducto = urlParams.get('id');
    const tipoArchivo = urlParams.get('tipo');

    if (!idProducto || !tipoArchivo) return;

    try {
        const respuesta = await fetch(`./secciones/${tipoArchivo}`);
        const datos = await respuesta.json();
        
        // Definimos la variable DENTRO del alcance correcto
        const productoEncontrado = datos.find(item => String(item.id) === String(idProducto));

        if (productoEncontrado) {
            enlaceReal = productoEncontrado.link;

            // Actualizamos solo si los IDs existen en el HTML
            document.getElementById('titulo').innerText = productoEncontrado.titulo;
            
            const img = document.getElementById('imagen-destacada');
            if (img) img.src = productoEncontrado.imagenDestacada || productoEncontrado.icono;
            
            document.getElementById('descripcion').innerText = productoEncontrado.info || productoEncontrado.descripcion;
            
            // ¡IMPORTANTE! Asegúrate de que este ID exista en tu HTML
            const btn = document.getElementById('btn-descarga');
            if (btn) btn.innerText = "Generar enlace";
        }
    } catch (e) {
        console.error("Error al cargar los detalles:", e);
    }
});

function iniciarDescarga() {
    const btn = document.getElementById('btn-descarga');
    let segundos = 5;
    btn.disabled = true;
    btn.innerText = `Generando... (${segundos}s)`;

    const intervalo = setInterval(() => {
        segundos--;
        if (segundos > 0) {
            btn.innerText = `Generando... (${segundos}s)`;
        } 
        else {
    clearInterval(intervalo);
    btn.innerText = "Descargar ahora";
    btn.disabled = false;
    
    btn.onclick = () => {
        // 1. Mostramos el mensaje de agradecimiento
        document.getElementById('modal-gracias').style.display = 'flex';
        
        setTimeout(() => {
    window.location.replace(enlaceReal); 
  
    document.getElementById('modal-gracias').style.display = 'none';
}, 3000);
    };
        }
    }, 1000);
}