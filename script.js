document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const cards = document.querySelectorAll('.card');

    let currentCategory = 'all';
    let searchQuery = '';

    // Función principal de filtrado integrado
    function filterContent() {
        cards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardName = card.getAttribute('data-name').toLowerCase();
            
            const matchesCategory = (currentCategory === 'all' || cardCategory === currentCategory);
            const matchesSearch = cardName.includes(searchQuery);

            if (matchesCategory && matchesSearch) {
                card.style.display = 'block';
                // Pequeño delay de animación al aparecer
                setTimeout(() => card.style.opacity = '1', 10);
            } else {
                card.style.opacity = '0';
                card.style.display = 'none';
            }
        });
    }

    // Escuchar el buscador escrito
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        filterContent();
    });

    // Escuchar los clics en las pestañas
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Cambiar clase activa visualmente
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filtrar por categoría
            currentCategory = button.getAttribute('data-filter');
            filterContent();
        });
    });
});
