class RegistroPersonas {
  constructor() {
    this.personas = [];
    this.idsGenerados = new Set();
  }

  // Generar un ID de 5 dígitos único
  generarID() {
    let id;
    do {
      id = Math.floor(10000 + Math.random() * 90000); // Generar número de 5 dígitos aleatorios
    } while (this.idsGenerados.has(id)); // Asegurar que no se repita
    this.idsGenerados.add(id);
    return id;
  }

  // Verificar si una persona ya existe (por nombre y apellido)
  personaExiste(nombre, apellido) {
    return this.personas.find(persona => persona.nombre === nombre && persona.apellido === apellido);
  }

  // Agregar o registrar la hora de entrada/salida de una persona
  agregarPersona(nombre, apellido) {
    const personaExistente = this.personaExiste(nombre, apellido);

    if (personaExistente) {
      // Registrar hora de salida y calcular tiempo trabajado
      const horaSalida = new Date();
      personaExistente.horaSalida = horaSalida;

      // Calcular tiempo trabajado
      const tiempoTrabajado = this.calcularTiempo(personaExistente.horaEntrada, personaExistente.horaSalida);
      personaExistente.tiempoTrabajado = tiempoTrabajado;

      console.log(`Hora de salida registrada para: ${nombre} ${apellido}. Tiempo trabajado: ${tiempoTrabajado}`);
    } else {
      // Registrar nueva persona y hora de entrada
      const id = this.generarID();
      const horaEntrada = new Date();
      const persona = { id, nombre, apellido, horaEntrada };
      this.personas.push(persona);
      console.log(`Persona añadida: ${nombre} ${apellido} con ID: ${id}. Hora de entrada: ${horaEntrada}`);
    }

    // Actualizar la lista en la interfaz
    this.mostrarPersonas();
  }

  // Calcular el tiempo trabajado en formato de horas y minutos
  calcularTiempo(horaEntrada, horaSalida) {
    const milisegundosTrabajados = horaSalida - horaEntrada;
    const horas = Math.floor(milisegundosTrabajados / (1000 * 60 * 60));
    const minutos = Math.floor((milisegundosTrabajados % (1000 * 60 * 60)) / (1000 * 60));
    return `${horas} horas y ${minutos} minutos`;
  }

  // Mostrar todas las personas registradas en la lista
  mostrarPersonas() {
    const lista = document.getElementById('listaPersonas');
    lista.innerHTML = ''; // Limpiar la lista

    this.personas.forEach(persona => {
      const li = document.createElement('li');
      li.textContent = `${persona.nombre} ${persona.apellido} (ID: ${persona.id}) 
        - Entrada: ${persona.horaEntrada.toLocaleTimeString()} 
        ${persona.horaSalida ? `- Salida: ${persona.horaSalida.toLocaleTimeString()} - Tiempo trabajado: ${persona.tiempoTrabajado}` : ''}`;
      lista.appendChild(li);
    });
  }
}

// Instancia de RegistroPersonas
const registro = new RegistroPersonas();

// Manejar el formulario
const formulario = document.getElementById('registroForm');
formulario.addEventListener('submit', function(event) {
  event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();

  if (nombre && apellido) {
    registro.agregarPersona(nombre, apellido);
  } else {
    alert('Por favor, ingresa un nombre y apellido válidos.');
  }

  // Enviar datos al servidor
  fetch('/registrar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nombre: nombre,
      apellido: apellido
    })
  })
  .then(response => response.json())
  .then(data => {
    document.getElementById('mensaje').innerText = data.message || 'Registro exitoso!';
  })
  .catch(error => {
    console.error('Error:', error);
    document.getElementById('mensaje').innerText = 'Hubo un error al registrar la persona';
  });

  // Limpiar los campos del formulario
  formulario.reset();
});