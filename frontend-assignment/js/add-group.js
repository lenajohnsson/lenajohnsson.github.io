'use strict';

import musicService from './service-music-groups.js';

const form = document.querySelector('#add-group-form');

const _musicService = new musicService(`https://music.api.public.seido.se/api`);

form.addEventListener('submit', async event => {
  event.preventDefault();

  const name = document.querySelector('#group-name').value.trim();
  const genre = document.querySelector('#group-genre').value.trim();
  const year = document.querySelector('#group-year').value.trim();

  // Validation
  if (!name || !genre || !year) {
    alert('Alla fält måste fyllas i!');
    return;
  }

  if (isNaN(year) || year < 1900 || year > 2026) {
    alert('Ange ett giltigt år mellan 1900 och 2026!');
    return;
  }

  // Create new music group object
  let newItem = {
    name: name,
    genre: Number(genre),
    establishedYear: Number(year),
    seeded: true
  };

  // Send the new music group to the API
  let data = await _musicService.createMusicGroupAsync(newItem);

  if (data) {
    window.location.href = 'musicgroups.html';
  }
});
