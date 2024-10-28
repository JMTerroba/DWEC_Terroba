let tareas = []; // Inicialmente vacío
let nextId = 1; // ID para la próxima tarea

// Función para cargar tareas desde el JSON con fetch
function cargarTareas() {
    fetch('tareas.json') // Obtener el archivo JSON
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar las tareas');
            }
            return response.json(); // Convertir la respuesta a JSON
        })
        .then(data => {
            tareas = data; // Almacenar tareas
            nextId = 1; // Inicializar nextId como 1

            // Encontrar el ID máximo usando un bucle for
            if (tareas.length > 0) {
                for (let i = 0; i < tareas.length; i++) {
                    if (tareas[i].id >= nextId) {
                        nextId = tareas[i].id + 1; // Actualizar nextId si encontramos un ID mayor
                    }
                }
            }

            mostrarTareas(); // Mostrar las tareas
        })
        .catch(console.error); // Manejo de errores
}

// Función para mostrar las tareas en la tabla
function mostrarTareas() {
    const tbody = document.querySelector('#tablaTareas tbody');
    tbody.innerHTML = ''; // Limpiar el contenido actual

    tareas.forEach(tarea => {
        const row = document.createElement('tr');
        row.id = `tarea-${tarea.id}`; // Pone una ID a la fila

        row.innerHTML = `
            <td>${tarea.id}</td>
            <td>${tarea.nombre}</td>
            <td>${tarea.fechaEntrega}</td>
            <td>
                <input type="checkbox" ${tarea.completada ? 'checked' : ''} onchange="tCompletada(${tarea.id}, this.checked)">
            </td>
            <td>
                <button onclick="eliminarTarea(${tarea.id})">Eliminar</button>
            </td>
        `;

        tbody.appendChild(row); // Añade las filas a la tabla
    });
}

// Función para agregar una nueva tarea
function agregarTarea(prevent) {
    prevent.preventDefault(); // Evita enviar el formulario

    const nombre = document.getElementById('nombreTarea').value;
    const fecha = document.getElementById('fechaEntrega').value;

    const nuevaTarea = {
        id: nextId++,
        nombre: nombre,
        fechaEntrega: fecha,
        completada: false
    };

    tareas.push(nuevaTarea); // Añadir la nueva tarea al Json
    mostrarTareas(); // Actualizar la tabla
}

// Función para eliminar una tarea usando de referencia una id
function eliminarTarea(id) {
    tareas = tareas.filter(tarea => tarea.id !== id); // Filtrar la tarea por ID
    mostrarTareas(); // Actualizar la tabla
}

// Función para cambiar el estado de completada de una tarea
function tCompletada(id, completada) {
    const tarea = tareas.find(t => t.id === id);
    if (tarea) {
        tarea.completada = completada; // Actualizar el estado de la tarea
    }
}

// Agregar el evento de submit al formulario
document.getElementById('formTarea').addEventListener('submit', agregarTarea);

// Cargar las tareas directamente después de que el DOM esté listo
document.addEventListener('DOMContentLoaded', cargarTareas);