document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search-input");
    const container = document.getElementById("downloads-container"); 
    const counter = document.getElementById("counted-items"); 
    const filterButtons = document.querySelectorAll(".filter-btn");
    const heroBanner = document.querySelector(".hero-banner");

    let allItems = [];
    let currentCategory = "todos";

  
    Promise.all([
        fetch("secciones/juegos-pc.json").then(res => res.json()).catch(() => []),
        fetch("secciones/juegos-android.json").then(res => res.json()).catch(() => []),
        fetch("secciones/mis-proyectos.json").then(res => res.json()).catch(() => [])
    ])
    .then(([juegosPc, juegosAndroid, misProyectos]) => {
        const pcList = Array.isArray(juegosPc) ? juegosPc : [];
        const androidList = Array.isArray(juegosAndroid) ? juegosAndroid : [];
        const proyectosList = Array.isArray(misProyectos) ? misProyectos : [];

        pcList.forEach(item => item.categoria = "juegos-pc");
        androidList.forEach(item => item.categoria = "juegos-android");
        proyectosList.forEach(item => item.categoria = "mis-proyectos");

        allItems = [...pcList, ...androidList, ...proyectosList];

        renderCards(allItems);
        updateCounter(allItems.length);
    })
    .catch(error => console.error("Error al cargar datos:", error));

    function renderCards(items) {
    container.innerHTML = "";

    if (items.length === 0) {
        container.innerHTML = `<p class="no-results">No se encontraron aportes que coincidan con tu búsqueda.</p>`;
        counter.textContent = "0";
        return;
    }

    counter.textContent = items.length;

    items.forEach(aporte => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="card-link-wrapper">
                <a href="index2.html?id=${aporte.id}&tipo=${aporte.categoria}" class="card-download" data-category="${aporte.categoria}">
                     
                    <div class="card-image">
                        <img src="${aporte.icono || 'https://via.placeholder.com/150'}" alt="${aporte.titulo}">
                    </div>
                    
                    <div class="card-content">
                        <h3>${aporte.titulo || 'Sin título'}</h3>
                        
                        <p class="platform-tag ${aporte.categoria}">
                            <i class="${
                                aporte.categoria === 'juegos-pc' ? 'fa-solid fa-desktop' :
                                aporte.categoria === 'juegos-android' ? 'fa-brands fa-android' :
                                aporte.categoria === 'mis-proyectos' ? 'fa-solid fa-code' : 
                                'fa-solid fa-layer-group'
                            }"></i>
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
        heroBanner.style.visibility = "hidden"; // Mantiene el espacio ocupado
        heroBanner.style.height = "0";          // Opcional: si quieres que colapse pero mantenga estructura
        heroBanner.style.padding = "0";         // Opcional: elimina rellenos
    } else {
        heroBanner.style.opacity = "1";
        heroBanner.style.visibility = "visible";
        heroBanner.style.height = "auto";       // Restaura altura
        heroBanner.style.padding = "";          // Restaura padding
    }
}

    function filterItems() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

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

    window.addEventListener("scroll", () => {
        const navbar = document.querySelector(".main-navbar");
        if (navbar) {
            if (window.scrollY > 20) {
                navbar.classList.add("scrolled");
            } else {
                navbar.classList.remove("scrolled");
            }
        }
    });
