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
let cacheTodosLosArchivos = []; 

const jsonFiles = {
    'juegos-pc': 'juegos-pc.json',
    'juegos-android': 'juegos-android.json',
    'apps-android': 'apps-android.json',
    'isos-optimizadores': 'isos-optimizadores.json'
};

// 🛠️ DICCIONARIO DE ICONOS REVISADO CON FORMATO FontAwesome CORRECTO
const stickersSecciones = {
    'juegos-pc': '<span class="card-icon-circle"><i class="fa-solid fa-desktop"></i></span>',
    'juegos-android': '<span class="card-icon-circle"><i class="fa-brands fa-android"></i></span>',
    'apps-android': '<span class="card-icon-circle"><i class="fa-solid fa-cubes"></i></span>',
    'isos-optimizadores': '<span class="card-icon-circle"><i class="fa-solid fa-compact-disc"></i></span>'
};

// FUNCIÓN MAESTRA CON ICONOS DENTRO DEL CÍRCULO
function crearTarjetaAnchaEstandar(item, categoria) {
    const descripcion = item.descripcion || "Explora este aporte de forma directa y completamente analizada por seguridad.";
    const servidor = item.servidor || "Servidor Externo";
    const clicks = item.descargas !== undefined ? item.descargas : 0;
    const juegoId = encodeURIComponent(item.titulo.trim());

    // Obtener el círculo con su respectivo icono según la procedencia
    const circuloIcono = stickersSecciones[categoria] || '<span class="card-icon-circle"><i class="fa-solid fa-gamepad"></i></span>';

    return `
        <div class="download-card" onclick="window.location.href='descarga.html?categoria=${categoria}&id=${juegoId}'" style="cursor:pointer;">
            <div class="card-info">
                <div class="card-title-container">
                    ${circuloIcono}
                    <h3>${item.titulo}</h3>
                </div>
                <p class="card-description">${descripcion}</p>
                <div class="card-details-row">
                    <span class="detail-item"><i class="fa-solid fa-server"></i> Servidor: <span class="highlight">${servidor}</span></span>
                    <span class="detail-item"><i class="fa-solid fa-circle-down"></i> <span class="highlight">${clicks}</span> descargas</span>
                </div>
            </div>
            <img src="${item.imagen}" alt="${item.titulo}">
        </div>
    `;
}

async function inicializarSistemaGlobal() {
    cacheTodosLosArchivos = [];
    if (topDownloadsContainer) topDownloadsContainer.innerHTML = '';

    for (const [key, value] of Object.entries(jsonFiles)) {
        try {
            const response = await fetch(value);
            const datos = await response.json();
            
            datos.forEach(item => {
                item.categoriaOrigen = key;
                if (item.descargas === undefined) item.descargas = 0; 
                cacheTodosLosArchivos.push(item);
            });
        } catch (e) {
            console.error("Error cargando base de datos: " + value, e);
        }
    }

    const catalogoOrdenado = [...cacheTodosLosArchivos].sort((a, b) => b.descargas - a.descargas);
    const topCuatro = catalogoOrdenado.slice(0, 4);

    if (topDownloadsContainer) {
        if (topCuatro.length === 0) {
            topDownloadsContainer.innerHTML = "<p style='color: var(--text-muted); text-align: center; width: 100%; padding: 2rem 0;'>No se registran aportes en la base de datos.</p>";
        } else {
            topCuatro.forEach(item => {
                topDownloadsContainer.innerHTML += crearTarjetaAnchaEstandar(item, item.categoriaOrigen);
            });
        }
    }
}

async function cambiarSeccion(categoria) {
    if (categoria === 'inicio') {
        if (heroBanner) heroBanner.classList.remove('hidden-section');
        if (topDownloadsSection) topDownloadsSection.classList.remove('hidden-section');
        if (mainCatalogSection) mainCatalogSection.classList.add('hidden-section');
        downloadsContainer.innerHTML = '';
        countedItems.textContent = "0";
        return;
    }

    if (heroBanner) heroBanner.classList.add('hidden-section');
    if (topDownloadsSection) topDownloadsSection.classList.add('hidden-section');
    if (mainCatalogSection) mainCatalogSection.classList.remove('hidden-section');
    
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
            downloadsContainer.innerHTML += crearTarjetaAnchaEstandar(item, categoria);
        });
    } catch (error) {
        downloadsContainer.innerHTML = "<p style='color: var(--text-muted); padding: 1rem 0;'>Error crítico al conectar las tarjetas.</p>";
    }
}

searchInput.addEventListener('input', (e) => {
    const valor = e.target.value.toLowerCase().trim();

    if (valor !== '') {
        if (heroBanner) heroBanner.classList.add('hidden-section');
        if (topDownloadsSection) topDownloadsSection.classList.add('hidden-section');
        if (mainCatalogSection) mainCatalogSection.classList.remove('hidden-section');
        
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
            downloadsContainer.innerHTML += crearTarjetaAnchaEstandar(item, item.categoriaOrigen);
        });
    } else {
        const botonActivo = document.querySelector('.filter-btn.active');
        cambiarSeccion(botonActivo.getAttribute('data-filter'));
    }
});

filterButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        searchInput.value = ''; 
        cambiarSeccion(button.getAttribute('data-filter'));
    });
});

document.addEventListener('DOMContentLoaded', () => {
    inicializarSistemaGlobal().then(() => {
        cambiarSeccion('inicio');
    });
});