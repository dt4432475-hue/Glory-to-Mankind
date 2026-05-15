// ==========================================================================
// 1. BASE DE DATOS CENTRALIZADA (Añade o edita publicaciones aquí)
// ==========================================================================
const publicaciones = [
    // 💻 SECCIÓN 1: PROGRAMAS
    {
        seccion: 1,
        titulo: "WinRAR Pro v7.0 Full",
        imagen: "img/win.gif", // Usa las imágenes de tu carpeta
        funcion: "Compresor de archivos definitivo con activación permanente incluida.",
        urlDescarga: "https://archive.org"
    },
    {
        seccion: 1,
        titulo: "VLC Media Player Portable",
        imagen: "img/win.gif",
        funcion: "Reproductor multimedia ligero que lee todos los formatos de video existentes.",
        urlDescarga: "https://archive.org"
    },
     {
        seccion: 1,
        titulo: "wise game booster",
        imagen: "img/win.gif",
        funcion: "Reproductor multimedia ligero que lee todos los formatos de video existentes.",
        urlDescarga: "https://archive.org"
    },

    // 🎮 SECCIÓN 2: JUEGOS PC
    {
        seccion: 2,
        titulo: "Counter Strike 1.6 No Steam",
        imagen: "img/baner.gif",
        funcion: "El clásico juego de disparos táctico listo para jugar en servidores de comunidad.",
        urlDescarga: "https://archive.org"
    },

    // 📱 SECCIÓN 3: APPS Y JUEGOS APK
    {
        seccion: 3,
        titulo: "RetroArch Plus APK",
        imagen: "img/android.png",
        funcion: "Emulador todo en uno optimizado para celulares Android de gama baja y media.",
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

// ==========================================================================
// 2. MOTOR DE RENDERIZADO Y BUSCADOR AUTOMÁTICO
// ==========================================================================
let activeSection = null;
let currentSearchQuery = "";

function inicializarSecciones() {
    // Detecta la sección activa mediante el ID en el HTML
    for (let i = 1; i <= 4; i++) {
        if (document.getElementById(`posts-seccion${i}`)) {
            activeSection = i;
            break;
        }
    }

    if (!activeSection) return; // Si estamos en el index, se detiene aquí

    renderizarPosts();

    // Vinculación del buscador en tiempo real
    const buscador = document.getElementById('search-input');
    if (buscador) {
        buscador.addEventListener('input', (e) => {
            currentSearchQuery = e.target.value.toLowerCase();
            renderizarPosts();
        });
    }
}

function renderizarPosts() {
    const contenedor = document.getElementById(`posts-seccion${activeSection}`);
    if (!contenedor) return;

    // Filtra los elementos que corresponden a la sección y coinciden con la lupa
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

    contenedor.innerHTML = postsFiltrados.map(post => `
        <div class="post-card">
            <h3>${post.titulo}</h3>
            <!-- El "../" permite que la sección cargue la imagen de la raíz -->
            <img src="../${post.imagen}" alt="${post.titulo}" class="post-image">
            <p class="post-function">${post.funcion}</p>
            <button class="download-btn" onclick="abrirAcortadorPublicitario('${post.urlDescarga}')">⚡ Descarga Directa</button>
        </div>
    `).join('');
}

// ==========================================================================
// 3. SISTEMA DE ACORTADOR DE DESCARGAS CON CONTADOR
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
    finalBtn.href = urlFinal; // Asigna el enlace de Internet Archive

    modal.classList.add('active'); // Muestra la pantalla flotante

    timerInterval = setInterval(() => {
        tiempoRestante--;
        secondsSpan.textContent = tiempoRestante;

        if (tiempoRestante <= 0) {
            clearInterval(timerInterval);
            counterText.classList.add('hidden');
            finalBtn.classList.remove('hidden'); // Revela el botón de descarga
        }
    }, 1000);
}

// Inicialización de eventos al cargar el documento
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('novedades-lista')) {
        cargarNovedades();
    }
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

// ==========================================================================
// 4. LÓGICA DE LAS NOVEDADES (SÓLO PARA EL INICIO)
// ==========================================================================
const novedades = [
    { fecha: "15/05/2026", texto: "¡Sección de Programas y Juegos actualizada con servidores estables!" },
    { fecha: "12/05/2026", texto: "Implementamos la fuente fija Orbitron Cyberpunk para soporte móvil total." },
    { fecha: "10/05/2026", texto: "Añadidos contenedores con scroll vertical para navegación infinita." }
];

function cargarNovedades() {
    const contenedor = document.getElementById('novedades-lista');
    if (!contenedor) return;
    contenedor.innerHTML = novedades.map(item => `
        <div class="news-item">
            <small style="color: #64748b; font-weight: bold;">${item.fecha}</small>
            <p style="margin-top: 5px;">${item.texto}</p>
        </div>
    `).join('');
}
