const publicaciones = [
    // 💻 SECCIÓN 1: PROGRAMAS
    {
        seccion: 1,
        titulo: "Wise Disk Cleaner",
        imagen: "img/win.gif", // 👈 Al ser local, el script le pondrá "../img/win.gif" automáticamente en las secciones
        funcion: "Compresor de archivos definitivo con activación permanente incluida.",
        urlDescarga: "https://archive.org"
    },
    {
        seccion: 1,
        titulo: "Dism",
        imagen: "https://postimg.cc", // 👈 Si pegas un link de Postimg, el script lo dejará intacto
        funcion: "Compresor de archivos definitivo con activación permanente incluida.",
        urlDescarga: "https://archive.org"
    },

    // 🎮 SECCIÓN 2: JUEGOS PC
    {
        seccion: 2,
        titulo: "Counter Strike 1.6 No Steam",
        imagen: "https://postimg.cc", // 👈 Link directo de Postimg que no se alterará
        funcion: "El clásico juego de disparos táctico listo para jugar en servidores de comunidad.",
        urlDescarga: "https://archive.org"
    },

    // 📱 SECCIÓN 3: APPS Y JUEGOS APK
    {
        seccion: 3,
        titulo: "Minecraft 1.21.111",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT_DLXb7rd3qS7aCagDrv0sDSNGuEFbCNkuaw&s",
        funcion: "Ultima version we",
        urlDescarga: "https://archive.org/download/minecraft-1.21.111/Minecraft%201.21.111.apk"
    },
      {
        seccion: 3,
        titulo: "ePSXe v2.0.17",
        imagen: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTn0KgEtH6zDbyjEMb94vs20kaFRCs0O-Iwiw&s",
        funcion: "El mejor emulador de ps1 😪",
        urlDescarga: "https://archive.org/download/e-psxe-v-2.0.17/ePSXe%20v2.0.17%20.apk"
    },

     {
        seccion: 3,
        titulo: "AetherSX2",
        imagen: "https://img.utdstc.com/icon/499/a3d/499a3dd14d609ecc134f2784e3e9ef468583771ea7692c26ff79acf0f6957946:600",
        funcion: "Mejor emulador de ps2 👾",
        urlDescarga: "https://archive.org/download/aether-sx-2_202605/AetherSX2.apk"
    },

     {
        seccion: 3,
        titulo: "InShot v2.Pro",
        imagen: "https://i.postimg.cc/sf6k8WKg/image.png",
        funcion: "Tiene 1 falso positivo, no te alarmes 😝",
        urlDescarga: "#"
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

    contenedor.innerHTML = postsFiltrados.map(post => {
        // SOLUCIÓN INTELIGENTE: Si la imagen empieza con http (Postimg), se queda igual. 
        // Si es una ruta local (como img/win.gif), le añade el "../" para que salga de la carpeta "secciones".
        const urlFinalImagen = post.imagen.startsWith('http') ? post.imagen : `../${post.imagen}`;

        return `
            <div class="post-card">
                <h3>${post.titulo}</h3>
                <img src="${urlFinalImagen}" alt="${post.titulo}" class="post-image">
                <p class="post-function">${post.funcion}</p>
                <button class="download-btn" onclick="abrirAcortadorPublicitario('${post.urlDescarga}')">⚡ Descarga Directa</button>
            </div>
        `;
    }).join('');
}

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
    // CORRECCIÓN FINAL: Eliminada la línea de novedades obsoleta para evitar caídas de script
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
