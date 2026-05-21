document.addEventListener("DOMContentLoaded", () => {
    // LLAMAMOS A LOS IDS REALES DE TU INDEX.HTML
    const searchInput = document.getElementById("search-input");
    const container = document.getElementById("downloads-container"); // ID real de tu HTML
    const counter = document.getElementById("counted-items"); // ID real de tu HTML
    const filterButtons = document.querySelectorAll(".filter-btn");

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
        // Aseguramos que sean arreglos válidos e inyectamos categorías
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

    // 2. Función para renderizar las tarjetas
    function renderCards(items) {
        if (!container) return; 
        container.innerHTML = "";

        if (items.length === 0) {
            container.innerHTML = `<p class="no-results" style="grid-column: 1/-1; text-align: center; color: #64748b; padding: 40px 0;">No se encontraron aportes que coincidan con tu búsqueda.</p>`;
            return;
        }

        items.forEach(aporte => {
            const card = document.createElement("div");
            card.className = "card";

            // Enlace optimizado usando ID numérico puro
            card.innerHTML = `
                <a href="descarga.html?id=${aporte.id}&tipo=${aporte.categoria}" class="card-download" data-category="${aporte.categoria}">
                    <div class="card-image">
                        <img src="${aporte.icono || aporte.image || 'https://placeholder.com'}" alt="${aporte.titulo}">
                    </div>
                    <div class="card-content">
                        <h3>${aporte.titulo || aporte.name || 'Sin título'}</h3>
                        <p class="server">${aporte.servidor || 'Up-4ever (Servidor Gratuito)'}</p>
                        <div class="card-footer">
                            <span class="tag tag-genre">${aporte.tag || 'General'}</span>
                            <span class="tag tag-status">${aporte.status || 'Seguro'}</span>
                            <span class="tag tag-size">${aporte.peso || 'N/A'}</span>
                        </div>
                    </div>
                </a>
            `;
            container.appendChild(card);
        });
    }

    // 3. Actualizar el contador de aportes
    function updateCounter(count) {
        if (counter) {
            counter.innerText = count;
        }
    }

    // 4. Lógica de Filtrado Combinado (Buscador + Filtro de Menú Nav)
    function filterItems() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

        const filtered = allItems.filter(item => {
            const matchesCategory = (currentCategory === "todos" || item.categoria === currentCategory);
            
            const title = (item.titulo || item.name || "").toLowerCase();
            const tag = (item.tag || "").toLowerCase();
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
            filterItems();
        });
    });
});
