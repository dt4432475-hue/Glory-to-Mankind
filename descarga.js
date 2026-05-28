const searchInput = document.getElementById('search-input');
const heroBanner = document.getElementById('hero-bg');
const topDownloadsSection = document.getElementById('top-downloads-section');
const mainCatalogSection = document.getElementById('main-catalog-section');
const mainCatalogTitle = document.querySelector('.catalog-wrapper h2');
const countedItems = document.getElementById('counted-items');
const downloadsContainer = document.getElementById('downloads-container');
const topDownloadsContainer = document.getElementById('top-downloads-container');
const filterButtons = document.querySelectorAll('.filter-btn');

let todosLosAportes = [];
let cacheTodosLosArchivos = []; // Base de datos unificada de la web

const jsonFiles = {
    'juegos-pc': 'juegos-pc.json',
    'juegos-android': 'juegos-android.json',
    'apps-android': 'apps-android.json',
    'isos-optimizadores': 'isos-optimizadores.json'
};

// Generador de tarjetas horizontales anchas (Secciones / Búsqueda)
function crearTarjetaHorizontal(item, categoria) {
    const descripcion = item.descripcion || "Explora este aporte de forma directa y completamente analizada por seguridad.";
    const servidor = item.servidor || "Servidor Externo";
    const etiquetas = item.etiquetas || [];
    const juegoId = encodeURIComponent(item.titulo.trim());

    return `
        <div class="download-card" onclick="window.location.href='descarga.html?categoria=${categoria}&id=${juegoId}'" style="cursor:pointer;">
            <img src="${item.imagen}" alt="${item.titulo}">
            <div class="card-info">
                <h3>${item.titulo}</h3>
                <p class="card-description">${descripcion}</p>
                <p class="card-server"><i class="fa-solid fa-server"></i> Server: <span>${servidor}</span></p>
                <div class="tags">
                    ${etiquetas.map(tag => `<span class="tag" style="background-color: rgba(0, 255, 136, 0.1); color: var(--accent-green); border: 1px solid var(--accent-green); font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 4px; margin-right: 0.3rem;">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `;
}

// Generador de tarjetas cuadradas para el TOP 4 de Inicio
function crearTarjetaTop(item, categoria) {
    const juegoId = encodeURIComponent(item.titulo.trim());
    const clicks = item.descargas || 0;
    return `
        <div class="download-card" onclick="window.location.href='descarga.html?categoria=${categoria}&id=${juegoId}'" style="cursor:pointer;">
            <img src="${item.imagen}" alt="${item.titulo}">
            <h3>${item.titulo}</h3>
            <p style="font-size: 0.8rem; color: var(--accent-green); margin-top: 0.2rem;">
                <i class="fa-solid fa-circle-down"></i> ${clicks} descargas
            </p>
        </div>
    `;
}

// Escanea todos los JSON, calcula el TOP 4 por descargas y arma el buscador global
async function inicializarSistemaGlobal() {
    cacheTodosLosArchivos = [];
    if (topDownloadsContainer) topDownloadsContainer.innerHTML = '';

    // Cargar todos los archivos JSON simultáneamente
    for (const [key, value] of Object.entries(jsonFiles)) {
        try {
            const response = await fetch(value);
            const datos = await response.json();
            
            datos.forEach(item => {
                item.categoriaOrigen = key; // Guardar procedencia
                // Si el item no tiene descargas seteadas en el JSON, forzar 0
                if (item.descargas === undefined) item.descargas = 0; 
                cacheTodosLosArchivos.push(item);
            });
        } catch (e) {
            console.error("Error cargando base de datos: " + value, e);
        }
    }

    // ORDENAR DE MAYOR A MENOR SEGÚN EL NÚMERO DE DESCARGAS
    const catalogoOrdenado = [...cacheTodosLosArchivos].sort((a, b) => b.descargas - a.descargas);

    // SELECCIONAR EXCLUSIVAMENTE LAS 4 PRIMERAS APPS MÁS DESCARGADAS
    const topCuatro = catalogoOrdenado.slice(0, 4);

    if (topDownloadsContainer) {
        if (topCuatro.length === 0) {
            topDownloadsContainer.innerHTML = "<p style='color: var(--text-muted); grid-column: span 4; text-align: center;'>No se registran aportes en la base de datos.</p>";
        } else {
            topCuatro.forEach(item => {
                topDownloadsContainer.innerHTML += crearTarjetaTop(item, item.categoriaOrigen);
            });
        }
    }
}

// Controlador maestro de vistas y secciones
async function cambiarSeccion(categoria) {
    if (categoria === 'inicio') {
        // En Inicio: Mostrar Banner y Top 4. Ocultar el catálogo general
        if (heroBanner) heroBanner.classList.remove('hidden-section');
        if (topDownloadsSection) topDownloadsSection.classList.remove('hidden-section');
        if (mainCatalogSection) mainCatalogSection.classList.add('hidden-section');
        
        downloadsContainer.classList.remove('list-view');
        downloadsContainer.innerHTML = '';
        countedItems.textContent = "0";
        return;
    }

    // EN SECCIONES: Ocultar Banner y Top 4. Mostrar el catálogo horizontal abajo
    if (heroBanner) heroBanner.classList.add('hidden-section');
    if (topDownloadsSection) topDownloadsSection.classList.add('hidden-section');
    if (mainCatalogSection) mainCatalogSection.classList.remove('hidden-section');
    
    downloadsContainer.classList.add('list-view');
    const nombreFiltro = document.querySelector(`[data-filter="${categoria}"]`).textContent.trim();
    mainCatalogTitle.innerHTML = `<i class="fa-solid fa-folder-open"></i> Aportes Disponibles: ${nombreFiltro}`;

    const archivoJson = jsonFiles[categoria];
    try {
        const response = await fetch(archivoJson);
        const datos = await response.json();
        todosLosAportes = datos;

        countedItems.textContent = datos.length;
        downloadsContainer.innerHTML = '';

        if (datos.length === 0) {
            downloadsContainer.innerHTML = "<p style='color: var(--text-muted); padding: 1rem 0;'>No hay aportes disponibles en este momento.</p>";
            return;
        }

        datos.forEach(item => {
            downloadsContainer.innerHTML += crearTarjetaHorizontal(item, categoria);
        });
    } catch (error) {
        downloadsContainer.innerHTML = "<p style='color: var(--text-muted); padding: 1rem 0;'>Error crítico al conectar las tarjetas.</p>";
    }
}

// Lógica del buscador predictivo en tiempo real
searchInput.addEventListener('input', (e) => {
    const valor = e.target.value.toLowerCase().trim();

    if (valor !== '') {
        if (heroBanner) heroBanner.classList.add('hidden-section');
        if (topDownloadsSection) topDownloadsSection.classList.add('hidden-section');
        if (mainCatalogSection) mainCatalogSection.classList.remove('hidden-section');
        
        downloadsContainer.classList.add('list-view');
        mainCatalogTitle.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> Resultados de búsqueda global`;

        const filtrados = cacheTodosLosArchivos.filter(item => 
            item.titulo.toLowerCase().includes(valor) ||
            (item.descripcion && item.descripcion.toLowerCase().includes(valor))
        );

        countedItems.textContent = filtrados.length;
        downloadsContainer.innerHTML = '';

        if (filtrados.length === 0) {
            downloadsContainer.innerHTML = "<p style='color: var(--text-muted); padding: 1rem 0;'>No se encontraron coincidencias.</p>";
            return;
        }

        filtrados.forEach(item => {
            downloadsContainer.innerHTML += crearTarjetaHorizontal(item, item.categoriaOrigen);
        });
    } else {
        const botonActivo = document.querySelector('.filter-btn.active');
        cambiarSeccion(botonActivo.getAttribute('data-filter'));
    }
});

// Eventos del menú del panel izquierdo
filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        searchInput.value = ''; // Limpiar barra al cambiar
        cambiarSeccion(button.getAttribute('data-filter'));
    });
});

// Arrancar cargando la base total por detrás y activar la pantalla de Inicio
document.addEventListener('DOMContentLoaded', () => {
    inicializarSistemaGlobal().then(() => {
        cambiarSeccion('inicio');
    });
});
