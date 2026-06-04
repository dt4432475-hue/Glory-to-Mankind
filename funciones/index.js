document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const container = document.getElementById("downloads-container"); 
    const counter = document.getElementById("counted-items"); 
    const filterButtons = document.querySelectorAll(".filter-btn");
    
    // CAPTURAMOS EL BANNER PRINCIPAL PARA CONTROLARLO
    const heroBanner = document.querySelector(".hero-banner");

    let allItems = [];
    let currentCategory = "todos";

    // 1. Cargar datos de múltiples archivos JSON de forma simultánea
    Promise.all([
        fetch("secciones/juegos-pc.json").then(res => res.json()).catch(() => []),
        fetch("secciones/juegos-android.json").then(res => res.json()).catch(() => []),
        fetch("secciones/apps-android.json").then(res => res.json()).catch(() => []),
        fetch("secciones/isos-herramientas.json").then(res => res.json()).catch(() => [])
    ])
    .then(([juegosPc, juegosAndroid, appsAndroid, isosyherramientas]) => {
        const pcList = Array.isArray(juegosPc) ? juegosPc : [];
        const androidList = Array.isArray(juegosAndroid) ? juegosAndroid : [];
        const appsList = Array.isArray(appsAndroid) ? appsAndroid : [];
        const isosList = Array.isArray(isosyherramientas) ? isosyherramientas : [];

        pcList.forEach(item => item.categoria = "juegos-pc");
        androidList.forEach(item => item.categoria = "juegos-android");
        appsList.forEach(item => item.categoria = "apps-android");
        isosList.forEach(item => item.categoria = "isos-herramientas");

        allItems = [...pcList, ...androidList, ...appsList, ...isosList];

        renderCards(allItems);
        updateCounter(allItems.length);
    })
    .catch(error => console.error("Error al cargar datos:", error));

    function renderCards(items) {
        container.innerHTML = ""; 
        counter.textContent = items.length; 

        if (items.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <p>No se encontraron aportes que coincidan con tu búsqueda.</p>
                </div>`;
            return;
        }

        items.forEach(aporte => {
            const card = document.createElement("div");
            card.className = "card";

            // 🎮 ASIGNACIÓN DE ICONOS Y TEXTOS SEGÚN LA CATEGORÍA
            let platformIcon = "fa-solid fa-cube"; // Icono por defecto
            let platformText = "Aporte";           // Texto por defecto

            switch(aporte.categoria) {
                case "juegos-pc":
                    platformIcon = "fa-solid fa-desktop";
                    platformText = "Juegos PC";
                    break;
                case "juegos-android":
                    platformIcon = "fa-brands fa-android";
                    platformText = "Juegos Android";
                    break;
                case "apps-android":
                    platformIcon = "fa-solid fa-cubes";
                    platformText = "Apps Android";
                    break;
                case "isos-herramientas":
                    platformIcon = "fa-solid fa-compact-disc";
                    platformText = "Isos y Herramientas";
                    break;
            }

            // Renderizado de la tarjeta respetando tus clases originales
            card.innerHTML = `
                <div class="card-link-wrapper">
                    <a href="index2.html?id=${aporte.id}&tipo=${aporte.categoria}" class="card-download" data-category="${aporte.categoria}">
                         
                        <div class="card-image">
                            <img src="${aporte.icono || 'https://via.placeholder.com/150'}" alt="${aporte.titulo}">
                        </div>
                        
                        <div class="card-content">
                            <h3>${aporte.titulo || 'Sin título'}</h3>
                            <p class="platform-tag ${aporte.categoria}">
                                <i class="${platformIcon}"></i> ${platformText}
                            </p>
                        </div>
                        
                    </a>
                </div>
            `;
            container.appendChild(card);
        });
    }
  
    function updateCounter(count) {
        if (counter) counter.innerText = count;
    }
 function manageBannerVisibility(query) {
        if (!heroBanner) return;

        if (query.length > 0 || currentCategory !== "todos") {
            heroBanner.style.opacity = "0";
            heroBanner.style.transform = "translateY(-10px)";
            // Espera un instante a que termine la animación de CSS antes de ocultarlo por completo
            setTimeout(() => {
                if(searchInput.value.trim().length > 0 || currentCategory !== "todos") {
                    heroBanner.style.display = "none";
                }
            }, 300);
        } else {
            heroBanner.style.display = "block";
            // Forzar un reflujo en el navegador para activar la animación de entrada
            setTimeout(() => {
                heroBanner.style.opacity = "1";
                heroBanner.style.transform = "translateY(0)";
            }, 10);
        }
    }

    function filterItems() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

        // Controlamos el banner antes de filtrar
        manageBannerVisibility(query);

        const filtered = allItems.filter(item => {
            const matchesCategory = (currentCategory === "todos" || item.categoria === currentCategory);
            
            const title = (item.titulo || item.name || "").toLowerCase();
            
           const matchesSearch = title.includes(query);

            return matchesCategory && matchesSearch;
        });

        renderCards(filtered);
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterItems);
    }

    filterButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            
            currentCategory = button.getAttribute("data-filter");
            filterItems(); // Ejecuta el filtro completo y analiza el banner
        });
    });
});
    // 📌 CONTROLADOR SENSOR DE SCROLL PARA HACER LA NAVBAR TRANSPARENTE
    window.addEventListener("scroll", () => {
        const navbar = document.querySelector(".main-navbar");
        if (navbar) {
            if (window.scrollY > 20) {
                navbar.classList.add("scrolled"); // Activa el cristal transparente si bajó más de 20px
            } else {
                navbar.classList.remove("scrolled"); // Vuelve a sólido si regresó arriba del todo
            }
        }
    });
