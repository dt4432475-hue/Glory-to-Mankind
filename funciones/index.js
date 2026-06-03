document.addEventListener("DOMContentLoaded", () => {
    const gridAportes = document.getElementById("grid-aportes");
    const totalAportesText = document.getElementById("total-aportes");
    const menuLinks = document.querySelectorAll(".nav-menu .nav-item");

    // ==========================================
    // MAPEO DE SECCIONES (Texto del menú -> Archivo JSON real)
    // ==========================================
    const seccionesJson = {
        "Juegos PC": "secciones/juegos_pc.json",
        "Juegos Android": "secciones/juegos_android.json",
        "Apps Android": "secciones/apps_android.json",
        "ISOs Gamer": "secciones/isos_herramientas.json" // Adaptado a tu nuevo nombre de archivo
    };

    // Función para cargar y dibujar las casillas
    function cargarSeccion(nombreSeccion) {
        const urlJson = seccionesJson[nombreSeccion];
        
        // Si se hace clic en "Inicio" o "Optimiza Windows", podemos mostrar un mensaje o dejarlo vacío temporalmente
        if (!urlJson) {
            gridAportes.innerHTML = "<p style='color: #627284; text-align: center; width: 100%; grid-column: 1/-1;'>Selecciona una sección activa del menú para ver los aportes.</p>";
            totalAportesText.textContent = "0 aportes disponibles";
            return;
        }

        fetch(urlJson)
            .then(response => {
                if (!response.ok) throw new Error("Error al cargar el archivo JSON");
                return response.json();
            })
            .then(data => {
                totalAportesText.textContent = `${data.length} aportes disponibles`;
                gridAportes.innerHTML = ""; // Limpiar las casillas de la sección anterior

                // Generar las casillas verticales dinámicamente con las clases de tu CSS
                data.forEach(aporte => {
                    const card = document.createElement("div");
                    card.classList.add("card");
                    // Aquí se aplica tu imagen de fondo desde el JSON
                    card.style.backgroundImage = `url('${aporte.imagen}')`;

                    const cardInfo = document.createElement("div");
                    cardInfo.classList.add("card-info");

                    const titulo = document.createElement("h3");
                    titulo.textContent = aporte.titulo;

                    cardInfo.appendChild(titulo);
                    card.appendChild(cardInfo);
                    gridAportes.appendChild(card);
                });
            })
            .catch(error => {
                console.error("Error:", error);
                gridAportes.innerHTML = "<p style='color: #ff4a4a; text-align: center; width: 100%; grid-column: 1/-1;'>Crea publicaciones en este archivo JSON para que aparezcan aquí.</p>";
                totalAportesText.textContent = "0 aportes";
            });
    }

    // Escuchar los clics de las pestañas del menú
    menuLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault(); // Evita que la página se mueva o recargue

            // Cambiar la línea verde estética (.active) a la pestaña presionada
            menuLinks.forEach(item => item.classList.remove("active"));
            link.classList.add("active");

            // Obtener el texto exacto del botón que presionaste (ej: "Apps Android")
            const seccionSeleccionada = link.textContent.trim();
            
            // Cargar el JSON correspondiente
            cargarSeccion(seccionSeleccionada);
        });
    });

    // Carga inicial por defecto al abrir la página
    cargarSeccion("Juegos PC");
});