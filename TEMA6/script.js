fetch('http://localhost:3000/habitaciones')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json(); // Parsear la respuesta como JSON
    })
    .then(data => {
        const tableBody = document.getElementById('room-table').querySelector('tbody');

        // Limpiar el contenido anterior de la tabla
        tableBody.innerHTML = '';

        // Agregar cada habitación a la tabla
        data.forEach(habitaciones => {
            const row = document.createElement('tr');

            row.innerHTML = `
                    <td>${habitaciones.numero}</td>
                    <td>${habitaciones.nombre}</td>
                    <td>${habitaciones.tipo}</td>
                    <td>${habitaciones.precio}</td>
                    <td>${habitaciones.fechaDisponibilidad}</td>
                    <td>${habitaciones.reservada}</td>
                `;

            tableBody.appendChild(row);
        });
    })
    .catch(error => {
        console.error('Hubo un problema con la solicitud Fetch:', error);
    });