let publicacionesGlobales = [];
let urlDescargaActiva = ""; 
let intervaloContador;

async function cargarPublicaciones() {
    try {
        // 1. Detectamos cuál de las 4 grillas existe en la pantalla actual
        const contenedorProgramas = document.getElementById('lista-programas-pc');
        const contenedorJuegos = document.getElementById('lista-juegos-pc');
        const contenedorApps = document.getElementById('lista-apps-apk');
        const contenedorIsos = document.getElementById('lista-isos-gamer');

        let archivoJSON = "";

        // 2. Apuntamos al JSON correcto dependiendo de la página abierta
        if (contenedorProgramas) archivoJSON = "../programas.json";
        else if (contenedorJuegos) archivoJSON = "../juegos.json";
        else if (contenedorApps) archivoJSON = "../apps.json";
        else if (contenedorIsos) archivoJSON = "../isos.json";

        // Si no encuentra ninguna de las listas (por ejemplo, en la portada index.html), frena el script
        if (!archivoJSON) return;

        // 3. Hacemos la petición exclusivamente al archivo que necesitamos
        const respuesta = await fetch(archivoJSON);
        publicacionesGlobales = await respuesta.json();

        // Renderizamos e inicializamos el buscador en tiempo real
        filtrarYRenderizar();

        const inputBuscador = document.getElementById('buscador-gamer');
        if (inputBuscador) {
            inputBuscador.addEventListener('input', filtrarYRenderizar);
        }

    } catch (error) {
        console.error("Error al cargar la base de datos independiente, mi king:", error);
    }
}

function filtrarYRenderizar() {
    // Detectamos nuevamente el contenedor de la página actual
    const idContenedorActivo = 
        document.getElementById('lista-programas-pc') || 
        document.getElementById('lista-juegos-pc') || 
        document.getElementById('lista-apps-apk') || 
        document.getElementById('lista-isos-gamer');

    if (!idContenedorActivo) return;
    idContenedorActivo.innerHTML = ''; // Limpiamos la grilla antes de pintar

    const inputBuscador = document.getElementById('buscador-gamer');
    const textoBusqueda = inputBuscador ? inputBuscador.value.toLowerCase().trim() : '';

    publicacionesGlobales.forEach(pub => {
        // Validamos la búsqueda por iniciales
        const coincideBusqueda = pub.titulo.toLowerCase().startsWith(textoBusqueda);

        if (coincideBusqueda) {
            const tarjetaHTML = `
                <div class="tarjeta-publicacion-gamer">
                    <div class="tarjeta-img-contenedor">
                        <img src="${pub.imagen}" alt="${pub.titulo}">
                    </div>
                    <div class="tarjeta-info">
                        <h3 class="tarjeta-titulo-post">${pub.titulo}</h3>
                        <p class="tarjeta-detalles">${pub.detalles || 'Versión Estable | Full'}</p>
                    </div>
                    <button onclick="iniciarEsperaDescarga('${pub.link}')" class="tarjeta-btn-descarga" style="width:100%; border:none; cursor:pointer;">
                        <span>DESCARGAR</span>
                    </button>
                </div>
            `;
            idContenedorActivo.innerHTML += tarjetaHTML;
        }
    });
}

// SISTEMA DEL CONTADOR DE MONETIZACIÓN (Mismo comportamiento premium)
function iniciarEsperaDescarga(linkInternetArchive) {
    urlDescargaActiva = linkInternetArchive;
    let tiempoRestante = 5;
    
    const modal = document.getElementById('modal-descarga-gamer');
    const zonaContadorBoton = document.getElementById('zona-contador-boton');
    
    zonaContadorBoton.innerHTML = `<p class="texto-contador">Tu archivo comenzará a descargarse en <span id="segundos-restantes">${tiempoRestante}</span> segundos...</p>`;
    modal.style.display = "flex";

    clearInterval(intervaloContador);
    
    intervaloContador = setInterval(() => {
        tiempoRestante--;
        const txtSegundos = document.getElementById('segundos-restantes');
        if (txtSegundos) txtSegundos.textContent = tiempoRestante;

        if (tiempoRestante <= 0) {
            clearInterval(intervaloContador);
            zonaContadorBoton.innerHTML = `
                <a href="${urlDescargaActiva}" download class="btn-descarga-final" onclick="cerrarModalGamer()">
                    ¡DESCARGAR AHORA DIRECTO!
                </a>
            `;
        }
    }, 1000);
}

function cerrarModalGamer() {
    clearInterval(intervaloContador);
    document.getElementById('modal-descarga-gamer').style.display = "none";
}

document.addEventListener('DOMContentLoaded', cargarPublicaciones);
