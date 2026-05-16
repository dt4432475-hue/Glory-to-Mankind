// ==========================================================================
// 1. BASE DE DATOS DE PUBLICACIONES
// ==========================================================================
const publicaciones = [
    // 💻 SECCIÓN 1: PROGRAMAS
    {
        seccion: 1,
        titulo: "inicio",
        imagen: "img/win.gif", 
        funcion: "Compresor de archivos definitivo con activación permanente incluida.",
        urlDescarga: "https://archive.org"
    },
    {
        seccion: 1,
        titulo: "Wise Disk Cleaner",
        imagen: "img/win.gif", 
        funcion: "Compresor de archivos definitivo con activación permanente incluida.",
        urlDescarga: "https://archive.org"
    },
    {
        seccion: 1,
        titulo: "Wise Disk Cleaner",
        imagen: "img/win.gif", 
        funcion: "Compresor de archivos definitivo con activación permanente incluida.",
        urlDescarga: "https://archive.org"
    },
    {
        seccion: 1,
        titulo: "Wise Disk Cleaner",
        imagen: "img/win.gif", 
        funcion: "Compresor de archivos definitivo con activación permanente incluida.",
        urlDescarga: "https://archive.org"
    },
    {
        seccion: 1,
        titulo: "Wise Disk Cleaner",
        imagen: "img/win.gif", 
        funcion: "Compresor de archivos definitivo con activación permanente incluida.",
        urlDescarga: "https://archive.org"
    },
    {
        seccion: 1,
        titulo: "Wise Disk Cleaner",
        imagen: "img/win.gif", 
        funcion: "Compresor de archivos definitivo con activación permanente incluida.",
        urlDescarga: "https://archive.org"
    },
    {
        seccion: 1,
        titulo: "Wise Disk Cleaner",
        imagen: "img/win.gif", 
        funcion: "Compresor de archivos definitivo con activación permanente incluida.",
        urlDescarga: "https://archive.org"
    },
    {
        seccion: 1,
        titulo: "fin",
        imagen: "img/win.gif", 
        funcion: "Compresor de archivos definitivo con activación permanente incluida.",
        urlDescarga: "https://archive.org"
    },

    // 🎮 SECCIÓN 2: JUEGOS PC
    {
        seccion: 2,
        titulo: "Counter Strike 1.6 No Steam",
        imagen: "https://postimg.cc",
        funcion: "El clásico juego de disparos táctico listo para jugar en servidores de comunidad.",
        urlDescarga: "https://archive.org"
    },

    // 📱 SECCIÓN 3: APPS Y JUEGOS APK
    {
        seccion: 3,
        titulo: "Minecraft 1.21.20",
        imagen: "img/banner.gif",
        funcion: "Ultima version we",
        urlDescarga: "https://archive.org"
    },

    // 💿 SECCIÓN 4: ISOS
    {
        seccion: 4,
        titulo: "Windows 10 Gaming ISO Lite",
        imagen: "img/footer.gif",
        funcion: "Sistema operativo modificado sin telemetría ni basura para ganar más FPS.",
        urlDescarga: "https://archive.org"
    }
];

let activeSection = null;
let currentSearchQuery = "";

// ==========================================================================
// 2. LOGÍSTICA DEL CARRUSEL Y SECCIONES
// ==========================================================================
function inicializarSecciones() {
    // Detecta la sección activa mediante el ID en el HTML
    for (let i = 1; i <= 4; i++) {
        if (document.getElementById(`posts-seccion${i}`)) {
            activeSection = i;
            break;
        }
    }

    if (!activeSection) return;

    renderizarPosts();

    // Vinculación del buscador en tiempo real
    const buscador = document.getElementById('search-input');
    if (buscador) {
        buscador.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value.toLowerCase();
            renderizarPosts();
        });
    }

    // CONTROL DE LAS FLECHAS PARA LAS CASILLAS
    const flechaIzquierda = document.getElementById('btn-carrusel-izq');
    const flechaDerecha = document.getElementById('btn-carrusel-der');
    const contenedorPublicaciones = document.getElementById(`posts-seccion${activeSection}`);

    if (flechaDerecha && contenedorPublicaciones) {
        flechaDerecha.addEventListener('click', () => {
            const tarjeta = contenedorPublicaciones.querySelector('.post-card');
            if (tarjeta) {
                const anchoCasilla = tarjeta.clientWidth + 20; 
                contenedorPublicaciones.scrollLeft += (anchoCasilla * 4); // Avanza 4 de golpe
            }
        });
    }

    if (flechaIzquierda && contenedorPublicaciones) {
        flechaIzquierda.addEventListener('click', () => {
            contenedorPublicaciones.scrollLeft = 0; // Resetea al inicio
        });
    }
}

function renderizarPosts() {
    const contenedor = document.getElementById(`posts-seccion${activeSection}`);
    if (!contenedor) return;

    const postsFiltrados = publicaciones.filter(post => {
        const perteneceSeccion = post.seccion === activeSection;
        const coincideBuscador = post.titulo.toLowerCase().includes(currentSearchQuery) || 
                                 post.funcion.toLowerCase().includes(currentSearchQuery);
        return perteneceSeccion && coincideBuscador;
    });

    if (postsFiltrados.length === 0) {
        contenedor.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 40px; font-family: inherit;">No se encontraron aportes con ese nombre.</p>`;
        return;
    }

    contenedor.innerHTML = postsFiltrados.map(post => {
        const urlFinalImagen = post.imagen.startsWith('http') ? post.imagen : `../${post.imagen}`;

        return `
            <div class="post-card">
                <h3>${post.titulo}</h3>
                <img src="${urlFinalImagen}" alt="${post.titulo}" class="post-image" onerror="this.src='../img/win.gif'">
                <p class="post-function">${post.funcion}</p>
                <button class="download-btn" onclick="abrirAcortadorPublicitario('${post.urlDescarga}')">⚡ Descarga Directa</button>
            </div>
        `;
    }).join('');
}

// ==========================================================================
// 3. CONTROL DEL MODAL ADSTERRA
// ==========================================================================
let timerInterval = null;

function abrirAcortadorPublicitario(urlFinal) {
    const modal = document.getElementById('download-modal');
    const secondsSpan = document.getElementById('seconds');
    const counterText = document.getElementById('counter-text');
    const finalBtn = document.getElementById('final-download-btn');

    if (!modal) return;

    clearInterval(timerInterval);
    let tiempoRestante = 5;
    
    secondsSpan.textContent = tiempoRestante;
    counterText.classList.remove('hidden');
    finalBtn.classList.add('hidden');
    finalBtn.href = urlFinal;

    modal.classList.add('active');

    timerInterval = setInterval(() => {
        tiempoRestante--;
        secondsSpan.textContent = tiempoRestante;

        if (tiempoRestante <= 0) {
            clearInterval(timerInterval);
            counterText.classList.add('hidden');
            finalBtn.classList.remove('hidden');
        }
    }, 1000);
}

// Inicialización de eventos al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    inicializarSecciones();

    const closeBtn = document.getElementById('close-modal-btn');
    const modal = document.getElementById('download-modal');
    
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            modal.classList.remove('active');
        });
    }
});
