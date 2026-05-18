document.addEventListener('DOMContentLoaded', () => {
    const botonesFiltro = document.querySelectorAll('.filter-btn');
    const tarjetas = document.querySelectorAll('.card-download');
    const buscador = document.getElementById('search-input');
    const contadorTexto = document.getElementById('counted-items');
    const botonArriba = document.getElementById('scroll-top-btn');

    let categoryActive = 'todos';
    let searchText = '';

    function filterAndCount() {
        let visibleCount = 0;

        tarjetas.forEach(tarjeta => {
            const cardCategory = tarjeta.getAttribute('data-category');
            const cardTitle = tarjeta.querySelector('h3').textContent.toLowerCase();

            const matchesCategory = (categoryActive === 'todos' || cardCategory === categoryActive);
            const matchesSearch = cardTitle.includes(searchText);

            if (matchesCategory && matchesSearch) {
                tarjeta.style.display = 'flex';
                setTimeout(() => {
                    tarjeta.style.opacity = '1';
                    tarjeta.style.transform = 'scale(1)';
                }, 10);
                visibleCount++;
            } else {
                tarjeta.style.opacity = '0';
                tarjeta.style.transform = 'scale(0.96)';
                setTimeout(() => {
                    tarjeta.style.display = 'none';
                }, 200);
            }
        });

        contadorTexto.textContent = visibleCount;
    }

    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            botonesFiltro.forEach(b => b.classList.remove('active'));
            boton.classList.add('active');
            categoryActive = boton.getAttribute('data-filter');
            filterAndCount();
        });
    });

    buscador.addEventListener('input', (e) => {
        searchText = e.target.value.toLowerCase().trim();
        filterAndCount();
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            botonArriba.classList.add('show');
        } else {
            botonArriba.classList.remove('show');
        }
    });

    botonArriba.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    filterAndCount();
});
