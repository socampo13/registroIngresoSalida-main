const socket = require('socket.io');

 // Cargar los registros existentes al conectarse
 socket.on('cargarRegistros', (registros) => {
    registros.forEach(registro => mostrarPersona(registro));
});

// Actualizar la lista cuando se recibe un nuevo registro
socket.on('actualizarRegistros', (registros) => {
    document.getElementById('listaPersonas').innerHTML = ''; // Limpiar la lista
    registros.forEach(registro => mostrarPersona(registro));
});

// Manejar el formulario
const formulario = document.getElementById('registroForm');
formulario.addEventListener('submit', function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();

    if (nombre && apellido) {
        // Enviar los datos al servidor
        socket.emit('nuevoRegistro', { nombre, apellido });
    } else {
        alert('Por favor, ingresa un nombre y apellido válidos.');
    }

    formulario.reset();
});

// Función para mostrar una persona en la lista
function mostrarPersona(persona) {
    const lista = document.getElementById('listaPersonas');
    const li = document.createElement('li');
    li.textContent = `${persona.nombre} ${persona.apellido} (ID: ${persona.id}) 
      - Entrada: ${new Date(persona.horaEntrada).toLocaleTimeString()} 
      ${persona.horaSalida ? `- Salida: ${new Date(persona.horaSalida).toLocaleTimeString()} - Tiempo trabajado: ${persona.tiempoTrabajado}` : ''}`;
    lista.appendChild(li);
}