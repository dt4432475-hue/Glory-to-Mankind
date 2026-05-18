document.addEventListener('DOMContentLoaded', () => {
    // 1. CAPTURA DE ELEMENTOS DEL HTML
    const botonesFiltro = document.querySelectorAll('.filter-btn');
    const buscador = document.getElementById('search-input');
    const contadorTexto = document.getElementById('counted-items');
    const botonArriba = document.getElementById('scroll-top-btn');
    const contenedorGrilla = document.getElementById('downloads-container');

    let todosLosAportes = []; // Aquí se fusionarán los 4 archivos JSON
    let categoryActive = 'todos';
    let searchText = '';

    // Mapeo de diseño e iconos oficiales por sección para el JSON
    const configuracionCategorias = {
        'juegos-pc': { tagClass: 'tag-pc' },
        'juegos-android': { tagClass: 'tag-android' },
        'apps': { tagClass: 'tag-apps' },
        'isos': { tagClass: 'tag-iso' }
    };

    // FUNCIÓN AUXILIAR: Limpia espacios y acentos para las URLs del acortador
    function generateSlug(text) {
        if (!text) return '';
        return text.toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    // ==========================================
    // 2. CARGA SIMULTÁNEA DE LOS 4 ARCHIVOS JSON
    // ==========================================
    Promise.all([
        fetch('juegos-pc.json').then(res => res.json()).then(data => data.map(item => ({ ...item, categoria: 'juegos-pc' }))).catch(() => []),
        fetch('juegos-android.json').then(res => res.json()).then(data => data.map(item => ({ ...item, categoria: 'juegos-android' }))).catch(() => []),
        fetch('apps.json').then(res => res.json()).then(data => data.map(item => ({ ...item, categoria: 'apps' }))).catch(() => []),
        fetch('isos.json').then(res => res.json()).then(data => data.map(item => ({ ...item, categoria: 'isos' }))).catch(() => [])
    ])
    .then(resultados => {
        // Fusionamos las 4 bases de datos en una sola lista maestra
        todosLosAportes = [].concat(...resultados);
        renderizarTarjetas();
        conectarContadoresReales(); // Lanzar contadores de visitas una vez cargada la base de datos
    })
    .catch(error => console.error("Error cargando los archivos JSON separados:", error));

    // ==========================================
    // 3. MOTOR DE RENDERIZADO DINÁMICO CON ACORTADOR
    // ==========================================
    function renderizarTarjetas() {
        if (!contenedorGrilla) return;
        contenedorGrilla.innerHTML = ''; 
        let visibleCount = 0;

        todosLosAportes.forEach(aporte => {
            const matchesCategory = (categoryActive === 'todos' || aporte.categoria === categoryActive);
            const matchesSearch = aporte.titulo.toLowerCase().includes(searchText);

            if (matchesCategory && matchesSearch) {
                const config = configuracionCategorias[aporte.categoria] || { tagClass: 'tag-apps' };
                
                // Imágenes de respaldo por si el JSON está vacío
                const urlImagen = aporte.imagen || 'https://unsplash.com';
                const pesoArchivo = aporte.peso || 'N/A';

                // Inyectamos la tarjeta apuntando de forma inteligente a descarga.html
                const tarjetaHTML = `
                    <a href="descarga.html?id=${generateSlug(aporte.titulo)}" class="card-download" data-category="${aporte.categoria}">
                        <div class="card-icon">
                            <img src="${urlImagen}" alt="${aporte.titulo}">
                        </div>
                        <div class="card-info">
                            <h3>${aporte.titulo}</h3>
                            <p>${aporte.servidor}</p>
                            <div class="card-meta">
                                <span class="meta-tag ${config.tagClass}">${aporte.tag}</span>
                                <span class="meta-tag m-status">${aporte.status}</span>
                                <span class="meta-tag m-weight"><i class="fa-solid fa-file-zipper"></i> ${pesoArchivo}</span>
                            </div>
                        </div>
                    </a>
                `;
                
                contenedorGrilla.insertAdjacentHTML('beforeend', tarjetaHTML);
                visibleCount++;
            }
        });

        if (contadorTexto) {
            contadorTexto.textContent = visibleCount;
        }
    }

    // ==========================================
    // 4. SISTEMA DE CONTADORES GLOBALES EN VIVO
    // ==========================================
    function conectarContadoresReales() {
        const LLAVE_PROYECTO = "glorytomankind_hub_2026"; 
        const CONTADOR_VISITAS = `https://moondb.org{LLAVE_PROYECTO}_visitas`;
        const CONTADOR_DESCARGAS = `https://moondb.org{LLAVE_PROYECTO}_descargas`;

        const viewEl = document.getElementById('live-views');
        const downEl = document.getElementById('live-downloads');

        // A) Registrar entrada e inflar contador de Visitas en +1
        if (viewEl) {
            fetch(CONTADOR_VISITAS, { method: 'POST' })
                .then(res => res.json())
                .then(data => {
                    viewEl.textContent = (data.value || 0).toLocaleString();
                })
                .catch(() => { viewEl.textContent = "0"; });
        }

        // B) Leer número acumulado de Descargas Totales
        function syncDownloads() {
            if (!downEl) return;
            fetch(CONTADOR_DESCARGAS)
                .then(res => res.json())
                .then(data => {
                    downEl.textContent = (data.value || 0).toLocaleString();
                })
                .catch(() => { downEl.textContent = "0"; });
        }

        syncDownloads();

        // C) Capturar clics en las tarjetas dinámicas para sumar descargas reales
        if (contenedorGrilla) {
            contenedorGrilla.addEventListener('click', (e) => {
                const tarjetaLink = e.target.closest('.card-download');
                if (tarjetaLink && downEl) {
                    fetch(CONTADOR_DESCARGAS, { method: 'POST' })
                        .then(res => res.json())
                        .then(data => {
                            downEl.textContent = (data.value || 0).toLocaleString();
                        });
                }
            });
        }
    }

    // ==========================================
    // 5. NAVEGACIÓN Y EVENTOS DE INTERFAZ
    // ==========================================
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            botonesFiltro.forEach(b => b.classList.remove('active'));
            boton.classList.add('active');
            categoryActive = boton.getAttribute('data-filter');
            renderizarTarjetas();
        });
    });

    if (buscador) {
        buscador.addEventListener('input', (e) => {
            searchText = e.target.value.toLowerCase().trim();
            renderizarTarjetas();
        });
    }

    // Control del botón flotante para volver arriba
    window.addEventListener('scroll', () => {
        if (botonArriba) {
            if (window.scrollY > 300) {
                botonArriba.classList.add('show');
            } else {
                botonArriba.classList.remove('show');
            }
        }
    });

    if (botonArriba) {
        botonArriba.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
    // ==========================================
    // RECONEXIÓN DE ENLACES CLICKABLES EN EL INICIO
    // ==========================================
    const modalGaleria = document.getElementById('gallery-modal');
    const btnAbrirGaleria = document.getElementById('open-gallery-btn');
    const btnCerrarGaleria = document.getElementById('close-gallery-btn');
    const fondoModal = document.querySelector('.modal-overlay');
    
    const bannerPrincipal = document.getElementById('hero-bg');
    const miniaturasClickables = document.querySelectorAll('.clickable-thumb');

    if (btnAbrirGaleria && modalGaleria) {
        // Abrir ventana flotante de capturas
        btnAbrirGaleria.addEventListener('click', () => {
            modalGaleria.classList.add('open');
            document.body.style.overflow = 'hidden'; 
        });

        // Cerrar al pulsar la X
        btnCerrarGaleria.addEventListener('click', () => {
            modalGaleria.classList.remove('open');
            document.body.style.overflow = 'auto'; 
        });

        // Cerrar al pulsar el fondo oscuro
        fondoModal.addEventListener('click', () => {
            modalGaleria.classList.remove('open');
            document.body.style.overflow = 'auto';
        });

        // Cambiar el fondo del banner principal al hacer clic en una foto
        miniaturasClickables.forEach(miniatura => {
            miniatura.addEventListener('click', (e) => {
                const nuevaImagenUrl = e.target.src;
                if (bannerPrincipal) {
                    bannerPrincipal.style.backgroundImage = `linear-gradient(rgba(7, 9, 14, 0.45), rgba(7, 9, 14, 0.9)), url('${nuevaImagenUrl}')`;
                }
                modalGaleria.classList.remove('open');
                document.body.style.overflow = 'auto';
            });
        });
    }

