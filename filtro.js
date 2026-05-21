document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const container = document.getElementById("downloads-container"); 
    const counter = document.getElementById("counted-items"); 
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

            // Procesar las etiquetas del JSON. Si vienen separadas por comas, creamos un botón por cada una
            let tagsHTML = "";
            const tagsString = aporte.tag || aporte.tags || "General";
            const tagsArray = tagsString.split(",").map(t => t.trim());

            tagsArray.forEach(tag => {
                // Filtramos para NO renderizar si por error viene un número o peso (como "gb" o "mb")
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
                            <p class="server">${aporte.servidor || 'Up-4ever (Servidor Gratuito)'}</p>
                        </div>
                    </a>
                    <!-- Contenedor exclusivo de palabras clave filtrables -->
                    <div class="card-footer" style="padding: 0 15px 15px 15px; display: flex; gap: 8px; flex-wrap: wrap; position: relative; z-index: 10;">
                        ${tagsHTML}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        // 3. Evento para que al hacer clic en cualquier palabra clave, busque de forma automática
        document.querySelectorAll(".tag-clickable").forEach(tagSpan => {
            tagSpan.addEventListener("click", (e) => {
                e.preventDefault();
                const selectedTag = e.target.getAttribute("data-tag");
                if (searchInput) {
                    searchInput.value = selectedTag; // Pone la palabra en el buscador superior
                    filterItems(); // Ejecuta el filtro
                }
            });
        });
    }

    function updateCounter(count) {
        if (counter) counter.innerText = count;
    }

    function filterItems() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

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
            filterItems();
        });
    });
});
