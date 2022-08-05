let carrito = cargarCarrito();
let capacitacionesJSON = [];
let cantidadTotalInscripcion = carrito.length;

$(document).ready(function () {
  $("#cantidad-inscripcion").text(cantidadTotalInscripcion);
  $("#btn-finalizar").on('click', function () {
    Swal.fire({
      title: '¿Seguro que deseas finalizar la inscripción?',
      text: `Total a pagar: $${calcularTotalInscripcion()}`,
      showCancelButton: true,
       confirmButtonColor: '#4c9e9e',
    cancelButtonColor: '#4f7070',
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          '¡Felicidades! Tu inscripción está confirmada',
          '¡Bienvenida/o a Programas Profesionales!',
          'success'
        )
        vaciarCarrito();
      }
    })
  });

  $("#seleccion option[value='pordefecto']").attr("selected", true);
  $("#seleccion").on("change", ordenarCapacitaciones);
  $("#gastoTotal").html(`Total: $ ${calcularTotalInscripcion()}`);
  obtenerJSON();
  CapRender();
  inscripcionesEnTabla();
});

fetch('json/capacitaciones.json')
.then((response) => {
  console.log(response);
  return response.json();
})
.then((data) => {
  console.log(data);
});

function CapRender() {
  for (const capacitacion of capacitacionesJSON) {
    $("#section-capacitaciones").append(`
      <div class="card-capacitacion"> 
          <div class="img-container">
            <img src="${capacitacion.foto}" alt="${capacitacion.nombre}" class="img-capacitacion"/>
          </div>
        <div class="info-capacitacion">
          <p class="font">${capacitacion.nombre}</p>
          <strong class="font">$${capacitacion.precio}</strong>
          <button class="botones" id="btn${capacitacion.id}"> Inscribite </button>
        </div>
      </div>
      `);

    $(`#btn${capacitacion.id}`).on('click', function () {
      agregarCapacitacion(capacitacion);
      $(`#btn${capacitacion.id}`).fadeOut(200).fadeIn(200);
    });
  }
};

function obtenerJSON() {
  $.getJSON("./json/capacitaciones.json", function (respuesta, estado) {
    if (estado == "success") {
      capacitacionesJSON = respuesta;
      CapRender();
    }
  });
}

function ordenarCapacitaciones() {
  let seleccion = $("#seleccion").val();
  if (seleccion == "menor") {
    capacitacionesJSON.sort(function (a, b) {
      return a.precio - b.precio
    });
  } else if (seleccion == "mayor") {
    capacitacionesJSON.sort(function (a, b) {
      return b.precio - a.precio
    });
  } else if (seleccion == "menor") {
    capacitacionesJSON.sort(function (a, b) {
      return a.duracion - b.duracion
    });
  } else if (seleccion == "mayor") {
    capacitacionesJSON.sort(function (a, b) {
      return b.duracion - a.duracion
    });
  } 

  $(".card-capacitacion").remove();
  CapRender();
}

class CapacitacionCarrito {
  constructor(capa) {
    this.id = capa.id;
    this.foto = capa.foto;
    this.nombre = capa.nombre.toUpperCase();;
    this.precio = capa.precio;
    this.cantidad = 1;
  }
}

function agregarCapacitacion(capacitacionAgregada) {
  let encontrada = carrito.find(c => c.id == capacitacionAgregada.id);
  if (encontrada == undefined) {
    let capacitacionEnCarrito = new CapacitacionCarrito(capacitacionAgregada);
    carrito.push(capacitacionEnCarrito);
    Swal.fire(
      'Agregaste una nueva capacitación',
      capacitacionAgregada.nombre,
      'success'
    );

    $("#tablabody").append(`
      <tr id='fila${capacitacionEnCarrito.id}' class='tabla-carrito'>
        <td> ${capacitacionEnCarrito.nombre}</td>
        <td id='${capacitacionEnCarrito.id}'> ${capacitacionEnCarrito.cantidad}</td>
        <td> ${capacitacionEnCarrito.precio}</td>
        <td><button class='btn btn-light' id="btn-eliminar-${capacitacionEnCarrito.id}">🗑️</button></td>
      </tr>
      `);
  } else {
    let posicion = carrito.findIndex(c => c.id == capacitacionAgregada.id);
    carrito[posicion].cantidad += 1;
    $(`#${capacitacionAgregada.id}`).html(carrito[posicion].cantidad);
  }

  $("#gastoTotal").html(`Total: $ ${calcularTotalInscripcion()}`);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  inscripcionesEnTabla();
}

function cargarCarrito() {
  let carrito = JSON.parse(localStorage.getItem("carrito"));
  if (carrito == null) {
    return [];
  } else {
    return carrito;
  }
}

function calcularTotalInscripcion() {
  let total = 0;
  for (const capacitacion of carrito) {
    total += capacitacion.precio * capacitacion.cantidad;
  }
  $("#montoTotalInscripcion").text(total);
  $("#cantidad-inscripcion").text(carrito.length);
  return total;
}

function inscripcionesEnTabla() {
  $("#tablabody").empty();
  for (const capa of carrito) {
    $("#tablabody").append(`
      <tr id='fila${capa.id}' class='tabla-carrito'>
        <td> ${capa.nombre}</td>
        <td id='${capa.id}'> ${capa.cantidad}</td>
        <td> ${capa.precio}</td>
        <td><button class='btn btn-light' id="eliminar${capa.id}">🗑️</button></td>
      </tr>
      `);

    $(`#eliminar${capa.id}`).click(function () {
      let eliminado = carrito.findIndex(c => c.id == capa.id);
      carrito.splice(eliminado, 1);
      console.log(eliminado);
      $(`#fila${capa.id}`).remove();
      $("#gastoTotal").html(`Total: $ ${calcularTotalInscripcion()}`);
      localStorage.setItem("carrito", JSON.stringify(carrito));
    });
  }
}

function vaciarCarrito() {
  $("#gastoTotal").text("Total: $0");
  $("#cantidad-inscripcion").text("0");
  $(".tabla-carrito").remove();
  localStorage.clear();
  carrito = [];
}

