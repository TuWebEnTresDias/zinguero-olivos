'use strict';
// Destinatario fijo: no se aceptan parámetros de URL para reemplazarlo.
const phone = '5491157949291';
const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navegacion');
menu.hidden = false;
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  nav.dataset.collapsed = 'true';
}
closeMenu();
menu.addEventListener('click', () => {
  const expanded = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(expanded));
  nav.dataset.collapsed = String(!expanded);
});
nav.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
const form = document.querySelector('#consulta');
const notice = document.querySelector('#form-notice');
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const name = document.querySelector('#nombre').value.trim();
  const area = document.querySelector('#zona').value.trim();
  const message = document.querySelector('#mensaje').value.trim();
  if (!name || !area || !message) {
    notice.textContent = 'Completá los campos con tu nombre, zona y consulta.';
    return;
  }
  if (name.length > 70 || area.length > 100 || message.length > 900) return;
  const url = new URL('https://wa.me/' + phone);
  url.searchParams.set('text', `Hola, soy ${name}. Vi su web y quiero consultar por un trabajo.\nZona: ${area}\nConsulta: ${message}`);
  notice.textContent = 'Abrimos WhatsApp con tu consulta preparada. Todavía tenés que enviarla allí.';
  window.location.assign(url.href);
});
// Sin JS o con script ausente: campos deshabilitados, sin nombres serializables,
// sin navegación nativa con datos; el enlace directo a WhatsApp sigue disponible.
document.querySelector('#campos').disabled = false;
notice.textContent = 'Al continuar, se abrirá WhatsApp. El mensaje no se envía automáticamente.';
const dialog = document.querySelector('#visor');
if (typeof dialog.showModal === 'function') {
  const image = document.querySelector('#visor-image');
  const caption = document.querySelector('#visor-caption');
  document.querySelectorAll('[data-gallery]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const source = link.querySelector('img');
      image.src = link.getAttribute('href');
      image.alt = source.alt;
      caption.textContent = source.alt;
      dialog.showModal();
    });
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    image.removeAttribute('src');
    image.alt = '';
  });
}
