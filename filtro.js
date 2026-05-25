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
        fetch("juegos-pc.json").then(res => res.json()).catch(() => []),
        fetch("juegos-android.json").then(res => res.json()).catch(() => []),
        fetch("apps.json").then(res => res.json()).catch(() => []),
        fetch("isos.json").then(res => res.json()).catch(() => [])
    ])
    .then(([juegosPc, juegosAndroid, apps, isos]) => {
        const pcList = Array.isArray(juegosPc) ? juegosPc : [];
        const androidList = Array.isArray(juegosAndroid) ? juegosAndroid : [];
        const appsList = Array.isArray(apps) ? apps : [];
        const isosList = Array.isArray(isos) ? isos : [];

        pcList.forEach(item => item.categoria = "juegos-pc");
        androidList.forEach(item => item.categoria = "juegos-android");
        appsList.forEach(item => item.categoria = "apps");
        isosList.forEach(item => item.categoria = "isos");

        allItems = [...pcList, ...androidList, ...appsList, ...isosList];

        renderCards(allItems);
        updateCounter(allItems.length);
    })
    .catch(error => console.error("Error al cargar datos:", error));

    // 2. Función para renderizar las tarjetas con solo palabras clave interactivas
    function renderCards(items) {
        if (!container) return; 
        container.innerHTML = "";

        if (items.length === 0) {
            container.innerHTML = `<p class="no-results" style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 40px 0;">No se encontraron aportes.</p>`;
            return;
        }

        items.forEach(aporte => {
            const card = document.createElement("div");
            card.className = "card";

            let tagsHTML = "";
            const tagsString = aporte.tag || aporte.tags || "General";
            const tagsArray = tagsString.split(",").map(t => t.trim());

            tagsArray.forEach(tag => {
                if (!tag.toLowerCase().includes("gb") && !tag.toLowerCase().includes("mb") && isNaN(tag)) {
                    tagsHTML += `
                        <span class="tag tag-clickable" data-tag="${tag}" style="cursor: pointer; background: rgba(0, 255, 135, 0.1); padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: bold; color: #00ff87; border: 1px solid rgba(0, 255, 135, 0.2); transition: all 0.2s;">
                            ${tag}
                        </span>`;
                }
            });

            card.innerHTML = `
                <div class="card-link-wrapper" style="position: relative; display: block;">
                    <a href="descarga.html?id=${aporte.id}&tipo=${aporte.categoria}" class="card-download" data-category="${aporte.categoria}" style="text-decoration: none; color: inherit;">
                        <div class="card-image">
                            <img src="${aporte.icono || aporte.image || 'https://placeholder.com'}" alt="${aporte.titulo}">
                        </div>

        <div class="card-content">
            <h3>${aporte.titulo || aporte.name || 'Sin título'}</h3>
            <div class="tags-container">
                ${(aporte.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>

                    </a>
                    <div class="card-footer" style="padding: 0 15px 15px 15px; display: flex; gap: 8px; flex-wrap: wrap; position: relative; z-index: 10;">
                        ${tagsHTML}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        document.querySelectorAll(".tag-clickable").forEach(tagSpan => {
            tagSpan.addEventListener("click", (e) => {
                e.preventDefault();
                const selectedTag = e.target.getAttribute("data-tag");
                if (searchInput) {
                    searchInput.value = selectedTag;
                    filterItems(); 
                }
            });
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
            const tag = (item.tag || item.tags || "").toLowerCase();
            const server = (item.servidor || "").toLowerCase();
            
            const matchesSearch = title.includes(query) || tag.includes(query) || server.includes(query);

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
