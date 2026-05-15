/**
 * GLORY TO MANKIND - CORE OPERATIVO (SPA con Inicio Estático)
 */

// Variable global para almacenar el HTML de inicio que está en el index
let inicioHTMLCache = '';

// Al cargar el DOM, capturamos el diseño original de inicio para el caché
window.addEventListener('DOMContentLoaded', () => {
    const inicioContainer = document.getElementById('inicio-static-content');
    if (inicioContainer) {
        inicioHTMLCache = inicioContainer.innerHTML;
    }
});

/**
 * Muestra el contenido de inicio desde el caché (Evita peticiones de red innecesarias)
 */
function showInicio(buttonElement) {
    const contentArea = document.getElementById('content-area');
    const searchWrapper = document.getElementById('searchWrapper');
    const searchInput = document.getElementById('globalSearch');

    // 1. Manejo visual de los botones
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    if (buttonElement) buttonElement.classList.add('active');

    // 2. Ocultar el buscador en Inicio
    searchWrapper.style.display = 'none';
    if (searchInput) searchInput.value = '';

    // 3. Restaurar el contenido estático desde el caché
    contentArea.innerHTML = `<div id="inicio-static-content">${inicioHTMLCache}</div>`;
}

/**
 * Carga de forma asíncrona los módulos externos (Apps, Juegos, Sistemas)
 */
async function loadSection(sectionName, buttonElement) {
    const contentArea = document.getElementById('content-area');
    const searchWrapper = document.getElementById('searchWrapper');
    const searchInput = document.getElementById('globalSearch');

    // 1. Manejo visual de los botones
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    if (buttonElement) buttonElement.classList.add('active');

    // 2. Mostrar el buscador en las secciones de descargas
    searchWrapper.style.display = 'flex';
    if (searchInput) searchInput.value = ''; 

    // 3. Petición HTTP asíncrona para traer la sección seleccionada
    try {
        contentArea.innerHTML = `
            <div style="padding: 50px; text-align: center; color: var(--neon-cyan); font-weight: bold; letter-spacing: 2px;">
                <i class="bi bi-arrow-repeat" style="display:inline-block; animation: spin 1s linear infinite; font-size:1.5rem; margin-right:10px; vertical-align:middle;"></i>
                ESTABLECIENDO CONEXIÓN CON EL MÓDULO...
            </div>`; 
        
        const response = await fetch(`sections/${sectionName}.html`);
        if (!response.ok) throw new Error('El módulo solicitado no se encuentra en el repositorio.');
        
        const htmlText = await response.text();
        contentArea.innerHTML = htmlText;
        
    } catch (error) {
        contentArea.innerHTML = `
            <div style="padding: 50px; color: var(--neon-magenta); font-weight: bold; border: 1px solid rgba(255,0,85,0.2); background: rgba(255,0,85,0.02); border-radius: 8px;">
                <i class="bi bi-exclamation-triangle" style="margin-right: 10px;"></i>
                ERROR CRÍTICO: ${error.message}
            </div>`;
    }
}

/**
 * Motor de búsqueda en tiempo real para filtrar tarjetas
 */
function filtrarPublicaciones() {
    const query = document.getElementById('globalSearch').value.toLowerCase().trim();
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
        const desc = card.querySelector('p')?.textContent.toLowerCase() || '';
        card.style.display = (title.includes(query) || desc.includes(query)) ? 'flex' : 'none';
    });
}
