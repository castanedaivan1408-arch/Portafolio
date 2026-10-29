"use strict"; // modo estricto: el navegador avisa de errores comunes (p. ej. usar una variable sin declarar)

/* =====================================================================
   1. CONFIGURACIÓN
   ===================================================================== */

// Número de WhatsApp en formato internacional, solo dígitos (57 = Colombia).
const NUMERO_WHATSAPP = "573232037503";

/* =====================================================================
   2. REFERENCIAS A ELEMENTOS DEL HTML (se buscan una sola vez por su id)
   ===================================================================== */

const encabezado         = document.getElementById("encabezado");
const botonMenu          = document.getElementById("botonMenu");
const menuNavegacion     = document.getElementById("menuNavegacion");
const formularioContacto = document.getElementById("formularioContacto");
const avisoFlotante      = document.getElementById("avisoFlotante");
const botonVolverArriba  = document.getElementById("botonVolverArriba");

/* =====================================================================
   3. MENÚ HAMBURGUESA (modo responsive)
   ===================================================================== */

// Abre o cierra el menú. Si recibe true/false lo fuerza; si no recibe nada, alterna.
function alternarMenu(forzarAbierto) {
  const abrir = typeof forzarAbierto === "boolean"
    ? forzarAbierto                                         // caso 1: nos dijeron qué hacer
    : !menuNavegacion.classList.contains("abierto");        // caso 2: invertimos el estado actual

  menuNavegacion.classList.toggle("abierto", abrir);        // agrega o quita .abierto en el menú (el CSS hace el resto)
  botonMenu.classList.toggle("abierto", abrir);             // también en el botón: convierte las 3 rayas en una X
  botonMenu.setAttribute("aria-expanded", String(abrir));   // avisa a lectores de pantalla si está abierto
}

botonMenu.addEventListener("click", () => alternarMenu());  // al pulsar la hamburguesa, alterna

// Al elegir un enlace del menú, se cierra para no tapar la sección a la que vas
menuNavegacion.querySelectorAll("a").forEach((enlace) => {
  enlace.addEventListener("click", () => alternarMenu(false));
});

// Con la tecla Escape también se cierra
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") alternarMenu(false);
});

// Si giras el celular o agrandas la ventana (> 768px), el menú vuelve a su estado normal
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) alternarMenu(false);
});

/* =====================================================================
   4. SOMBRA DEL ENCABEZADO AL HACER SCROLL
   ===================================================================== */

function actualizarSombraEncabezado() {
  // toggle(clase, condición): la clase está puesta solo si se bajó más de 10px
  encabezado.classList.toggle("con-sombra", window.scrollY > 10);
}
window.addEventListener("scroll", actualizarSombraEncabezado, { passive: true }); // passive: no frena el scroll
actualizarSombraEncabezado(); // se ejecuta una vez al cargar, por si la página abre a mitad de scroll

/* =====================================================================
   5. ANIMACIONES DE SECCIONES: aparecen cuando entran en pantalla
   ===================================================================== */

const elementosRevelar = document.querySelectorAll(".revelar"); // todos los elementos marcados en el HTML

if ("IntersectionObserver" in window) {
  // El observador avisa cuando un elemento se vuelve visible en la ventana
  const observador = new IntersectionObserver((entradas, observadorActual) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {                       // ¿ya está en pantalla?
        entrada.target.classList.add("visible");          // sí: el CSS lanza la animación
        observadorActual.unobserve(entrada.target);       // y dejamos de vigilarlo: la animación ocurre una sola vez
      }
    });
  }, {
    threshold: 0.15,                // se dispara cuando se ve al menos el 15% del elemento
    rootMargin: "0px 0px -60px 0px" // espera a que entre 60px por encima del borde inferior
  });

  elementosRevelar.forEach((elemento) => observador.observe(elemento));
} else {
  // Navegadores muy antiguos: mostramos todo directamente, sin animar
  elementosRevelar.forEach((elemento) => elemento.classList.add("visible"));
}

/* =====================================================================
   6. AVISO FLOTANTE
   ===================================================================== */

let temporizadorAviso; // guarda el temporizador para poder reiniciarlo si llega otro aviso

function mostrarAviso(texto) {
  avisoFlotante.textContent = texto;          // escribe el mensaje
  avisoFlotante.classList.add("mostrar");     // lo hace visible
  clearTimeout(temporizadorAviso);            // cancela el temporizador anterior (si había)
  temporizadorAviso = setTimeout(() => {
    avisoFlotante.classList.remove("mostrar"); // a los 5 segundos se oculta solo
  }, 5000);
}

/* =====================================================================
   7. FORMULARIO DE CONTACTO → WHATSAPP (misma funcionalidad del archivo original)
   ===================================================================== */

// Solo la página contacto.html tiene formulario; en las demás "formularioContacto" es null y no se hace nada
if (formularioContacto) {
formularioContacto.addEventListener("submit", (evento) => {
  evento.preventDefault(); // evita que el formulario recargue la página; el navegador ya validó los campos obligatorios

  // FormData lee todos los campos por su atributo name; fromEntries lo convierte en un objeto { nombre: "...", ... }
  const datos = Object.fromEntries(new FormData(formularioContacto).entries());

  // Arma el mensaje línea por línea; "||" pone un texto por defecto si el campo opcional quedó vacío
  const mensaje = [
    "Hola Iván, quisiera consultar sobre tus servicios multimedia.",
    "",
    `Nombre: ${datos.nombre}`,
    `Empresa: ${datos.empresa || "No especificada"}`,
    `Correo: ${datos.correo}`,
    `WhatsApp: ${datos.telefono}`,
    `Servicio: ${datos.servicio}`,
    `Presupuesto: ${datos.presupuesto || "Por conversar"}`,
    `Inicio: ${datos.fecha || "Sin definir"}`,
    `Proyecto: ${datos.necesidad}`
  ].join("\n"); // une las líneas con saltos de línea

  // encodeURIComponent convierte espacios, tildes y saltos de línea a un formato válido para la URL
  const enlace = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;

  window.open(enlace, "_blank", "noopener"); // abre WhatsApp en otra pestaña; la persona confirma el envío
  mostrarAviso("WhatsApp se abrió. Revisa el mensaje y envíalo para completar el contacto.");
});
} // fin del if (formularioContacto)

/* =====================================================================
   8. BOTÓN "VOLVER ARRIBA" DEL PIE DE PÁGINA
   ===================================================================== */

// El pie de página existe en las 3 páginas, pero por seguridad se comprueba que el botón exista
if (botonVolverArriba) {
  botonVolverArriba.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // sube hasta el inicio con desplazamiento suave
  });
}
