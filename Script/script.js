'use strict';

const menu = document.querySelector('#menu');
const burger = document.querySelector('#burger');

menu.style.display = 'none';

burger.addEventListener('click', function () {
  burger.classList.toggle('active');
  if (menu.style.display === 'none') {
    menu.style.display = 'block';
  } else {
    menu.style.display = 'none';
  }
});
