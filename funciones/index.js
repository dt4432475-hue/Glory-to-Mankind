async function cargarSeccion(archivo, idContenedor) {
    try {
        const respuesta = await fetch(`secciones/${archivo}`);
        const datos = await respuesta.json();
        const contenedor = document.getElementById(idContenedor);

        if (!contenedor) return;

        contenedor.innerHTML = '';

        // ... dentro de tu función cargarSeccion
datos.forEach(item => {
    contenedor.innerHTML += `
    <div class="card">
        <img src="${item.icono}" alt="${item.titulo}" class="card-icon">
        <h3>${item.titulo}</h3>
        <p>${item.descripcion}</p>
        <a href="detalles.html?id=${item.id}" class="btn">Ver detalles</a>
    </div>
`;
});
    } catch (error) {
        console.warn(`No se pudo cargar la sección: ${archivo}`);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    cargarSeccion('apks.json', 'container-apks');
    cargarSeccion('mods.json', 'container-mods');
    cargarSeccion('addons.json', 'container-addons');
});