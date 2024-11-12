document.addEventListener('DOMContentLoaded', function () {
    // Cargar habitaciones desde la base de datos
    async function loadRooms() {
        try {
            const response = await fetch('http://localhost:3000/habitaciones');
            const data = await response.json();
            const tableBody = document.getElementById('room-table-body');
            //Vacia la tabla para proceder a volver a cargarla
            tableBody.innerHTML = '';
            //Teniendo en cuenta los datos del json crea la tabla en el html y la rellena 
            data.forEach(habitacion => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${habitacion.numero}</td>
                    <td>${habitacion.nombre}</td>
                    <td>${habitacion.tipo}</td>
                    <td>${habitacion.precio}</td>
                    <td>${habitacion.fechaDisponibilidad}</td>
                    <td>${habitacion.reservada ? 'Sí' : 'No'}</td>
                    <td>
                        <button class="toggle-reservation-btn" room-id="${habitacion.id}" data-reservada="${habitacion.reservada}">
                            ${habitacion.reservada ? 'Liberar' : 'Reservar'}
                        </button>
                        <button class="delete-room-btn" room-id="${habitacion.id}">Eliminar</button>
                    </td>
                `;
                //El siguiente se pone abajo
                tableBody.appendChild(row);
            });

            // Añadir eventos a los botones de reservar/liberar y eliminar
            document.querySelectorAll('.toggle-reservation-btn').forEach(button => {
                button.addEventListener('click', toggleReservation);
            });
            document.querySelectorAll('.delete-room-btn').forEach(button => {
                button.addEventListener('click', deleteRoom);
            });

        } catch (error) {
            console.error('Error al cargar las habitaciones:', error);
        }
    }

    // Obtener el precio según el tipo de habitación
    function getRoomPrice(type) {
        switch (type) {
            case 'Doble':
                return 85;
            case 'Suite':
                return 160;
            case 'Individual':
                return 55;
            default:
                return 0;
        }
    }

    function infoButton(event) {
        const buttonId = event.target.id;

        // Usamos un switch case para ejecutar las funciones según el id del botón (if else pero mas bonito)
        switch (buttonId) {
            case 'roomCountButton':
                showRoomCount();
                break;
            case 'averagePriceButton':
                showAveragePrice();
                break;
            case 'expensiveAndCheapButton':
                showExpensiveAndCheapRoom();
                break;
            case 'availableRoomsByTypeButton':
                showAvailableRoomsByType();
                break;
            case 'availableRoomsNext7DaysButton':
                showAvailableRoomsNext7Days();
                break;
            default:
                console.log('Botón no reconocido');
        }
    }

    // Contador de habitaciones ocupadas y sin ocupar
    async function showRoomCount() {
        try {
            // Obtener las habitaciones desde el servidor
            const response = await fetch('http://localhost:3000/habitaciones');

            const rooms = await response.json();  // Convertir la respuesta en JSON

            // Contar las habitaciones reservadas y disponibles
            const reservedCount = rooms.filter(room => room.reservada).length;
            const availableCount = rooms.filter(room => !room.reservada).length;


            const resultHTML = `
            <h3>Contador de Habitaciones</h3>
            <p><strong>Habitaciones Reservadas:</strong> ${reservedCount}</p>
            <p><strong>Habitaciones Disponibles:</strong> ${availableCount}</p>
        `;

            // Mostrar el resultado en el contenedor
            document.getElementById('report-result').innerHTML = resultHTML;

        } catch (error) {
            console.error('Error al obtener el contador de habitaciones:', error);
            document.getElementById('report-result').innerHTML = 'Error al cargar los datos.';
        }
    }


    async function showAveragePrice() {
        try {
            const response = await fetch('http://localhost:3000/habitaciones');
            const rooms = await response.json();

            /*Es una especie de for en una linea, el reduce lo que hace es reducir el array a un solo valor pero
            de condicion le hemos indicado que vaya sumando y almacenando cad valor del array hasta que solo quede uno  */
            const total = rooms.reduce((sum, room) => sum + room.precio, 0);
            //calculo del precio y uso de toFixed para limitar la cantidad de decimales
            const averagePrice = (total / rooms.length).toFixed(2);

            const resultHTML = `
                <h3>Precio Promedio de Habitaciones</h3>
                <p><strong>Precio Promedio:</strong> $${averagePrice}</p>
            `;

            document.getElementById('report-result').innerHTML = resultHTML;
        } catch (error) {
            console.error('Error al calcular el precio promedio:', error);
            document.getElementById('report-result').innerHTML = 'Error al cargar los datos.';
        }
    }

    async function showExpensiveAndCheapRoom() {
        try {
            const response = await fetch('http://localhost:3000/habitaciones');
            const rooms = await response.json();

            /*Igual que en la suma de la media pero va descartando dependiendo si el numero actual es mayor al que se compara, 
            si asi es se almacena, se descarta el anterior y pasa al siguiente*/
            const mostExpensive = rooms.reduce((max, room) => room.precio > max.precio ? room : max);
            /*Igual que el anterior pero para el minimo*/
            const cheapest = rooms.reduce((min, room) => room.precio < min.precio ? room : min);

            const resultHTML = `
                <h3>Habitación Más Cara y Más Barata</h3>
                <p><strong>Más Cara:</strong> ${mostExpensive.nombre} - $${mostExpensive.precio}</p>
                <p><strong>Más Barata:</strong> ${cheapest.nombre} - $${cheapest.precio}</p>
            `;

            document.getElementById('report-result').innerHTML = resultHTML;
        } catch (error) {
            console.error('Error al obtener las habitaciones más caras y más baratas:', error);
            document.getElementById('report-result').innerHTML = 'Error al cargar los datos.';
        }
    }

    async function showAvailableRoomsByType() {
        try {
            const response = await fetch('http://localhost:3000/habitaciones');
            const rooms = await response.json();

            const availableRooms = rooms.filter(room => !room.reservada);

            const roomTypes = availableRooms.reduce(function (types, room) {
                if (!types[room.tipo]) {
                    types[room.tipo] = 0;  // Si no existe, empezamos el contador en 0
                }
                types[room.tipo] += 1; // Sumamos 1 al contador de ese tipo
                return types;
            }, {});
            
            let resultHTML = '<h3>Habitaciones Disponibles por Tipo</h3>';
            for (let type in roomTypes) {
                resultHTML += '<p><strong>' + type + ':</strong> ' + roomTypes[type] + '</p>';
            }

            document.getElementById('report-result').innerHTML = resultHTML;
        } catch (error) {
            console.error('Error al obtener las habitaciones disponibles por tipo:', error);
            document.getElementById('report-result').innerHTML = 'Error al cargar los datos.';
        }
    }


    async function showAvailableRoomsNext7Days() {
        try {
            // Obtener las habitaciones desde el servidor
            const responseGet = await fetch('http://localhost:3000/habitaciones');

            const rooms = await responseGet.json();

            // Fecha de hoy y la fecha en 7 días
            const today = new Date();
            const sevenDaysLater = new Date(today);
            sevenDaysLater.setDate(today.getDate() + 7);

            // Filtrar habitaciones disponibles en los próximos 7 días
            const availableRooms = rooms.filter(room => {
                const availabilityDate = new Date(room.fechaDisponibilidad);
                return !room.reservada && availabilityDate >= today && availabilityDate <= sevenDaysLater;
            });

            let resultHTML = '<h3>Habitaciones Disponibles en los Próximos 7 Días</h3>';
            if (availableRooms.length > 0) {
                availableRooms.forEach(room => {
                    resultHTML += `<p><strong>${room.nombre}:</strong> Disponible el ${room.fechaDisponibilidad}</p>`;
                });
            } else {
                resultHTML += '<p>No hay habitaciones disponibles en los próximos 7 días.</p>';
            }

            // Mostrar los resultados en el contenedor correspondiente
            document.getElementById('report-result').innerHTML = resultHTML;

        } catch (error) {
            // Si ocurre un error, mostrar mensaje en consola y en la interfaz
            console.error('Error al obtener las habitaciones disponibles en los próximos 7 días:', error);
            document.getElementById('report-result').innerHTML = 'Error al cargar los datos.';
        }
    }

    // Función para cambiar el estado de reservada/liberada
    async function toggleReservation(event) {
        //Esto obtiene el dato del boton actual cuando se clica basandose en la id del boton siempre y cuando se llame data-id
        const roomId = event.target.getAttribute('room-id');
        const currentReservedState = event.target.dataset.reservada === 'true';

        try {
            const responseGet = await fetch(`http://localhost:3000/habitaciones/${roomId}`);

            const roomData = await responseGet.json();

            // Modificar solo el campo reservada
            roomData.reservada = !currentReservedState;

            // Enviar la habitación completa con el estado modificado al servidor
            const responsePut = await fetch(`http://localhost:3000/habitaciones/${roomId}`, {
                method: 'PUT',
                body: JSON.stringify(roomData)
            });

            if (!responsePut.ok) throw new Error('No se pudo cambiar el estado de la habitación');

            loadRooms();

        } catch (error) {
            console.error('Error al cambiar el estado de la habitación:', error);
            alert('Error al cambiar el estado de la habitación');
        }
    }


    // Función para eliminar una habitación
    async function deleteRoom(event) {
        const roomId = event.target.getAttribute('room-id');
        try {
            const response = await fetch(`http://localhost:3000/habitaciones/${roomId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('No se pudo eliminar la habitación');

            // Recargar habitaciones para reflejar la eliminación en la interfaz
            loadRooms();

        } catch (error) {
            console.error('Error al eliminar la habitación:', error);
            alert('Error al eliminar la habitación');
        }
    }

    // Validar el formulario antes de enviar
    async function validateForm() {
        const roomNumber = document.getElementById('room-number').value;
        const roomName = document.getElementById('room-name').value;
        const roomType = document.getElementById('room-type').value;
        const availabilityDate = document.getElementById('date-disponibility').value;

        let errorMessage = '';

        //Limita a 3 numeros como maximo
        const roomNumberRegex = /^\d{3}$/;
        if (!roomNumberRegex.test(roomNumber)) {
            errorMessage += 'El número de habitación debe ser de 3 dígitos.\n';
        } else {
            const response = await fetch('http://localhost:3000/habitaciones');
            const existingRooms = await response.json();
            const roomExists = existingRooms.some(room => room.numero === parseInt(roomNumber, 10));
            if (roomExists) {
                errorMessage += 'El número de habitación ya existe.\n';
            }
        }
        
        //Al menos 2 palabras
        const nameRegex = /^[a-zA-Z]+\s+[a-zA-Z]+/;
        if (!nameRegex.test(roomName)) {
            errorMessage += 'El nombre de la habitación debe contener al menos dos palabras.\n';
        }

        //solo 3 tipos
        const validRoomTypes = ['Individual', 'Doble', 'Suite'];
        if (!validRoomTypes.includes(roomType)) {
            errorMessage += 'Selecciona un tipo de habitación válido.\n';
        }

        //La fecha debe ser del futuro
        const today = new Date().toISOString().split('T')[0];
        if (availabilityDate <= today) {
            errorMessage += 'La fecha de disponibilidad debe ser futura.\n';
        }

        return true;
    }

    // Agregar una nueva habitación
    async function addRoom(event) {
        event.preventDefault();

        //se ejecuta la validacion y si es fallida no continua
        const isValid = await validateForm();
        if (!isValid) return;


        //Obtener datos del form (Precio lo he puesto predeterminado)
        const roomNumber = document.getElementById('room-number').value;
        const roomName = document.getElementById('room-name').value;
        const roomType = document.getElementById('room-type').value;
        const roomPrice = getRoomPrice(roomType);
        const availabilityDate = document.getElementById('date-disponibility').value;

        //Creacion de objeto con los nuevos datos
        const newRoom = {
            numero: parseInt(roomNumber, 10),
            nombre: roomName,
            tipo: roomType,
            precio: roomPrice,
            fechaDisponibilidad: availabilityDate,
            reservada: false
        };

        try {
            const response = await fetch('http://localhost:3000/habitaciones', {
                method: 'POST',
                //Se añade el objeto al json en forma de string gracias a la funcion stringiify
                body: JSON.stringify(newRoom)
            });

            if (!response.ok) throw new Error('Fallo al añadir la habitacion');

            //Cargo las paginas de nuevo para que se muestre la nueva
            loadRooms();

            //Se restablece el formulario (es opcional, no afecta a la funcionalidad)
            document.getElementById('add-room-form').reset();

        } catch (error) {
            console.error('Error al añadir la habitación:', error);
            alert('No se pudo añadir la habitación');
        }
    }

    //Cargar funciones de los botones
    document.getElementById('add-room-form').addEventListener('submit', addRoom);
    document.getElementById('roomCountButton').addEventListener('click', infoButton);
    document.getElementById('averagePriceButton').addEventListener('click', infoButton);
    document.getElementById('expensiveAndCheapButton').addEventListener('click', infoButton);
    document.getElementById('availableRoomsByTypeButton').addEventListener('click', infoButton);
    document.getElementById('availableRoomsNext7DaysButton').addEventListener('click', infoButton);

    // Cargar habitaciones al cargar la página
    loadRooms();
});