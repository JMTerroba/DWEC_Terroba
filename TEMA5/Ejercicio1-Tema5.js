// JSON de personajes
const personajes = [
    {
        nombre: "Terrolback",
        edad: 87,
        descripcion: "Un burPajo",
        Definitiva: "Llamada del Burpi"
    },
    {
        nombre: "Pacocok",
        edad: 19,
        descripcion: "Un burPajo",
        Definitiva: "Omnipotencia de Linux"
    },
    {
        nombre: "Alcocnada",
        edad: 50,
        descripcion: "Un burPajo",
        Definitiva: "Dormir en clase de pedro"
    },
    {
        nombre: "Mr.Python",
        edad: 24,
        descripcion: "Un burPajo",
        Definitiva: "Biblia de Python"
    }
];

// Mostrar todos los personajes en la lista
function mostrarPersonajes(personajesFiltrados) {
    const listaPersonajes = document.getElementById("listaPersonajes");
    listaPersonajes.innerHTML = ""; // Pone la pantalla en blanco

    personajesFiltrados.forEach(personaje => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${personaje.nombre}</strong> - Edad: 
        ${personaje.edad} <br>${personaje.descripcion} <br>
        ${personaje.Definitiva}
        `;
        listaPersonajes.appendChild(li);//Hace que se agregue el elemento li a listaPersonajes que es un ul
    });
}

// Filtrar personajes por edad 
function filtrarPersonajes() {
    const edad = document.getElementById("edadMinima").value;
    const edadPj = parseInt(edad);
3
    let personajesFiltrados;
    //!isNaN sirve para comprobar si el numero es valido
    if (!isNaN(edadPj)) {
        // Si la edad es un numero igual muestra a los personajes que correspondadn con la edad
        personajesFiltrados = personajes.filter(personaje => personaje.edad === edadPj);
        //filter crea un nuevo array basandose en una condicion, en este caso la condicion es si la edad escrita es igual a la del personaje
    } else {
        // Si no hay un número que sea igual que una edad muestra todos los personajes
        personajesFiltrados = personajes;
    }
    mostrarPersonajes(personajesFiltrados);
}

// Mostrar todos los personajes al principio
mostrarPersonajes(personajes);

// Hacer que se ejecute la funcion al pulsar el boton
document.getElementById("botonFiltrar").addEventListener("click", filtrarPersonajes);