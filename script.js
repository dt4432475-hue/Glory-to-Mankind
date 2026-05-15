// LISTA DE NOVEDADES DEL INICIO
// Para añadir otra, copia una línea entera, pon una coma y escribe tu actualización.
const novedades = [
    { fecha: "15/05/2026", texto: "¡Sección 1 actualizada con las últimas guías de comunidad!" },
    { fecha: "12/05/2026", texto: "Implementamos el nuevo diseño oscuro neón en todo el portal." },
    { fecha: "10/05/2026", texto: "Corrección de errores menores en los enlaces de navegación rápida." }
];

// Función para renderizar las novedades automáticamente en el HTML
function cargarNovedades() {
    const contenedor = document.getElementById('novedades-lista');
    if (!contenedor) return; // Si no está en esta página, no hace nada

    contenedor.innerHTML = novedades.map(item => `
        <div class="news-item">
            <small style="color: #64748b;">${item.fecha}</small>
            <p style="margin-top: 5px;">${item.texto}</p>
        </div>
    `).join('');
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarNovedades();
});
