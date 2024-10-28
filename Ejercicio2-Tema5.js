let gastosJSON = [];

// Función para agregar un gasto
function agregarGasto() {
    const nombre = document.getElementById('nombre').value;
    const cantidad = parseFloat(document.getElementById('cantidad').value);
    const fecha = document.getElementById('fecha').value;
    //!isNan sirve para comprobar que es un numero
    if (nombre && !isNaN(cantidad) && fecha) {
        // Crea un objeto que guardare posteriormente en el JSON
        const nuevoGasto = {
            nombre: nombre,
            cantidad: cantidad,
            fecha: fecha
        };

        // Push para guardar el objeto
        gastosJSON.push(nuevoGasto);

        // Poner cajas de texto en blanco una vez que se ejecuten las funciones.
        document.getElementById('nombre').value = '';
        document.getElementById('cantidad').value = '';
        document.getElementById('fecha').value = '';

        // Actualiza la lista de gastos y el total
        mostrarGastos();
        calcularTotal();
    } else {
        alert('Error, algo salio mal.');
    }
}

// Función para mostrar los gastos en la lista
function mostrarGastos() {
    const listaGastos = document.getElementById('listaGastos');
    listaGastos.innerHTML = ''; // Pantalla en blanco antes de proseguir a mostrar los gastos para no repetir datos

    gastosJSON.forEach((gasto) => {
        const gastoItem = document.createElement('div');
        gastoItem.className = 'gasto-item';
        gastoItem.innerHTML =
            //toFixed sirve para reducir la cantidad de decimales
            `
                    <li>${gasto.nombre} - ${gasto.cantidad.toFixed(2)}€ (${gasto.fecha})</li>
                `;
        listaGastos.appendChild(gastoItem);
    });
}

// Función para calcular el total acumulado
function calcularTotal() {
    let total = 0;
    for (let gasto of gastosJSON) {
        total += gasto.cantidad;
    }
    document.getElementById('total').textContent = `Total acumulado: ${total.toFixed(2)}€`;
}