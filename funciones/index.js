document.addEventListener("DOMContentLoaded", () => {
    const gridAportes = document.getElementById("grid-aportes");
    const totalAportesText = document.getElementById("total-aportes");
    const menuLinks = document.querySelectorAll(".nav-menu .nav-item");
    const heroBanner = document.querySelector(".hero-section"); // Captura el banner de bienvenida
    const buscador = document.querySelector(".search-container input"); // Captura tu barra de búsqueda

    // ==========================================
    // MAPEO EXACTO DE TUS 4 ARCHIVOS JSON REALES
    // ==========================================
    const seccionesJson = {
        "Juegos PC": "./secciones/juegos_pc.json",
        "Juegos Android": "./secciones/juegos_android.json",
        "Apps Android": "./secciones/apps_android.json",
        "Isos y Herramientas": "./secciones/isos_herramientas.json"
    };

    // 🌟 FUNCIÓN AUXILIAR PARA OBTENER EL ICONO SEGÚN LA CATEGORÍA/SECCIÓN
    function obtenerIconoCategoria(categoria) {
        if (!categoria) return 'fa-solid fa-file-code';
        
        switch (categoria.toLowerCase().trim()) {
            case 'juegos pc':
                return 'fa-solid fa-desktop';
            case 'juegos android':
                return 'fa-brands fa-android';
            case 'apps android':
                return 'fa-solid fa-mobile-screen-button';
            case 'isos y herramientas':
            case 'isos gamer':
                return 'fa-solid fa-compact-disc';
            default:
                return 'fa-solid fa-file-code'; // Icono de seguridad por si acaso
        }
    }

    // Función auxiliar para renderizar las casillas en el contenedor
    function dibujarCasillas(listaAportes) {
        gridAportes.innerHTML = ""; 
        
        listaAportes.forEach(aporte => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.style.backgroundImage = `url('${aporte.imagen}')`;

            // 🌟 NUEVO: Creación del iconito flotante en la esquina superior izquierda
            const badgeIcon = document.createElement("div");
            badgeIcon.classList.add("card-badge-icon");
            
            const iconoElement = document.createElement("i");
            // Averigua qué clase de Font Awesome le corresponde según su sección
            const claseIcono = obtenerIconoCategoria(aporte.categoria); 
            
            // Separamos las clases por espacio para agregarlas correctamente
            claseIcono.split(" ").forEach(clase => iconoElement.classList.add(clase));
            
            badgeIcon.appendChild(iconoElement);
            card.appendChild(badgeIcon); // Se agrega a la tarjeta arriba del todo

            // Estructura de información de la tarjeta que ya tenías
            const cardInfo = document.createElement("div");
            cardInfo.classList.add("card-info");

            const titulo = document.createElement("h3");
            titulo.textContent = aporte.titulo;

            cardInfo.appendChild(titulo);
            card.appendChild(cardInfo);
            gridAportes.appendChild(card);
        });
    }

    // PORTADA "INICIO": Muestra el banner y mezcla todo el contenido
    function cargarInicio() {
        if (heroBanner) heroBanner.classList.remove("oculto"); // Asegura que se vea el banner

        const archivos = Object.values(seccionesJson);

        Promise.all(archivos.map(url => fetch(url).then(res => res.json()).catch(() => [])))
            .then(resultados => {
                // Para que el icono sepa qué poner en Inicio, necesitamos inyectarle la categoría a cada objeto antes de mezclarlos
                const llaves = Object.keys(seccionesJson);
                let todosLosAportes = [];

                resultados.forEach((lista, index) => {
                    lista.forEach(aporte => {
                        // Le añadimos la propiedad categoria dinámicamente si no la tiene en el JSON
                        if (!aporte.categoria) {
                            aporte.categoria = llaves[index];
                        }
                        todosLosAportes.push(aporte);
                    });
                });

                todosLosAportes.sort(() => Math.random() - 0.5); // Surtido mezclado al azar

                totalAportesText.textContent = `${todosLosAportes.length} aportes en total`;
                dibujarCasillas(todosLosAportes);
            })
            .catch(error => {
                console.error("Error al cargar la portada de Inicio:", error);
                gridAportes.innerHTML = "<p style='color: #ff4a4a; text-align: center; width: 100%; grid-column: 1/-1;'>Error al generar el surtido de Inicio.</p>";
            });
    }

    // SECCIONES INDIVIDUALES: Oculta el banner y carga su respectivo JSON
    function cargarSeccion(nombreSeccion) {
        if (heroBanner) heroBanner.classList.add("oculto"); // Oculta el banner de inmediato

        const urlJson = seccionesJson[nombreSeccion];
        if (!urlJson) return;

        fetch(urlJson)
            .then(response => {
                if (!response.ok) throw new Error("Error al cargar el archivo JSON");
                return response.json();
            })
            .then(data => {
                // Le aseguramos la categoría también al cargar por sección suelta
                data.forEach(aporte => {
                    if (!aporte.categoria) aporte.categoria = nombreSeccion;
                });

                totalAportesText.textContent = `${data.length} aportes disponibles`;
                dibujarCasillas(data);
            })
            .catch(error => {
                console.error("Error:", error);
                gridAportes.innerHTML = "<p style='color: #ff4a4a; text-align: center; width: 100%; grid-column: 1/-1;'>Error al cargar el contenido.</p>";
                totalAportesText.textContent = "0 aportes";
            });
    }

    // DETECTAR CLICS EN EL MENÚ SUPERIOR
    menuLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); 

            menuLinks.forEach(item => item.classList.remove("active"));
            link.classList.add("active");

            // Modificado para obtener solo el texto ignorando las etiquetas del icono <i> de la barra
            const seccionSeleccionada = link.textContent.trim();
            
            if (seccionSeleccionada === "Inicio") {
                if (buscador) buscador.value = ""; // Limpia el buscador si regresa a Inicio
                cargarInicio();
            } else {
                cargarSeccion(seccionSeleccionada);
            }
        });
    });

    // DETECTAR EVENTO DE ESCRITURA EN EL BUSCADOR
    if (buscador) {
        buscador.addEventListener("input", (e) => {
            const textoBusqueda = e.target.value.trim().toLowerCase();

            if (textoBusqueda !== "") {
                if (heroBanner) heroBanner.classList.add("oculto"); // Si escribe algo, el banner vuela
            } else {
                // Si borra lo escrito, el banner solo regresa si está parado en la pestaña de Inicio
                const itemActivo = document.querySelector(".nav-menu .nav-item.active");
                const pestañaActiva = itemActivo ? itemActivo.textContent.trim() : "Inicio";
                if (pestañaActiva === "Inicio" && heroBanner) {
                    heroBanner.classList.remove("oculto");
                }
            }
        });
    }

    // CARGA INICIAL POR DEFECTO
    cargarInicio();
});