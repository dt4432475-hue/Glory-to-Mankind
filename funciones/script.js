let todosLosAportes = [];
let filtroActual = "inicio"; // Puede ser: inicio, pc, android, proyectos

// Función para cargar los datos de un JSON específico
async function cargarDatos(rutaJson, claseEtiqueta, textoEtiqueta, categoria) {
    try {
        const respuesta = await fetch(rutaJson);
        const datos = await respuesta.json();
        
        // Añadimos propiedades de control a cada elemento cargado
        datos.forEach(item => {
            todosLosAportes.push({
                ...item,
                claseEtiqueta: claseEtiqueta,
                textoEtiqueta: textoEtiqueta,
                categoria: categoria // 'pc', 'android' o 'proyectos'
            });
        });
    } catch (error) {
        console.error(`Error cargando ${rutaJson}:`, error);
    }
}

// Función encargada de aplicar filtros y pintar las casillas
function actualizarPantalla() {
    const contenedor = document.getElementById("contenedor-principal");
    const tituloDinamico = document.getElementById("titulo-dinamico");
    const textoBusqueda = document.getElementById("buscador").value.toLowerCase();
    
    if (!contenedor) return;
    contenedor.innerHTML = "";

    // 1. Filtrar según el botón seleccionado
    let aportesFiltrados = todosLosAportes.filter(item => {
        if (filtroActual === "inicio") {
            // En inicio se mezclan PC y Android, pero se ocultan los "proyectos" independientes
            return item.categoria === "pc" || item.categoria === "android";
        } else {
            // En las otras pestañas, se muestra estrictamente la categoría elegida
            return item.categoria === filtroActual;
        }
    });

    // 2. Filtrar adicionalmente por lo que el usuario tenga escrito en el buscador
    if (textoBusqueda !== "") {
        aportesFiltrados = aportesFiltrados.filter(item => {
            return item.nombre.toLowerCase().includes(textoBusqueda) || 
                   item.descripcion.toLowerCase().includes(textoBusqueda);
        });
    }

    // 3. Actualizar el título principal dinámicamente
    const titulos = { "inicio": "Todos los Aportes", "pc": "Juegos de PC", "android": "Juegos de Android", "proyectos": "Mis Proyectos" };
    tituloDinamico.textContent = titulos[filtroActual] || "Aportes";

    // 4. Pintar las tarjetas procesadas
    aportesFiltrados.forEach(item => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("tarjeta-juego");
        
        tarjeta.innerHTML = `
            <img src="${item.imagen}" alt="Miniatura de ${item.nombre}">
            <div class="contenido-tarjeta">
                <h2>${item.nombre}</h2>
                <p>${item.descripcion.replaceAll("\n", "<br>")}</p>
                <span class="etiqueta ${item.claseEtiqueta}">${item.textoEtiqueta}</span>
                <a href="${item.enlace}" target="_blank" class="boton-descargar">Descargar / Ver</a>
            </div>
        `;
        contenedor.appendChild(tarjeta);
    });
}

// Configurar los eventos de los botones y el buscador
document.addEventListener("DOMContentLoaded", async () => {
    // Cargamos los tres archivos JSON de manera simultánea en el array global
    await Promise.all([
        cargarDatos("secciones/pc.json", "pc", "PC", "pc"),
        cargarDatos("secciones/android.json", "android", "Android", "android"),
        cargarDatos("secciones/proyectos.json", "proyectos", "Proyecto", "proyectos")
    ]);

    // Mostrar los aportes combinados inicialmente
    actualizarPantalla();

    // Evento para capturar los clics en los botones de filtrado
    const botones = document.querySelectorAll(".btn-filtro");
    botones.forEach(btn => {
        btn.addEventListener("click", (e) => {
            // Cambiar la clase activa visualmente al botón pulsado
            botones.forEach(b => b.classList.remove("activo"));
            e.target.classList.add("activo");

            // Cambiar el filtro y refrescar la rejilla
            filtroActual = e.target.getAttribute("data-filtro");
            actualizarPantalla();
        });
    });

    // Evento para actualizar en tiempo real mientras se escribe en el buscador
    document.getElementById("buscador").addEventListener("input", actualizarPantalla);
});
