'use strict';

// Getting the id and image from music-group
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const img = urlParams.get('img');
console.log(id);
console.log(img);

import musicService from './service-music-groups.js';

const _musicService = new musicService(`https://music.api.public.seido.se/api`);

async function loadGroup() {
  const musicGroup = await _musicService.readMusicGroupAsync(id, false);
  renderMusicGroup(musicGroup.item);
  console.log(musicGroup);
}

loadGroup();

// Rendering the group info
function renderMusicGroup(group) {
  document.querySelector('#group-name').textContent = group.name;
  document.querySelector('#genre').textContent = group.strGenre;
  document.querySelector('#year').textContent = group.establishedYear;
  document.querySelector('#group-img').src = `images/m${img}.png`;

  // Rendering the artists and albums
  const artistList = document.querySelector('#artists-list');
  artistList.innerHTML = '';
  group.artists?.forEach(artist => {
    const li = document.createElement('li');
    li.textContent = `${artist.firstName} ${artist.lastName}`;
    artistList.appendChild(li);
  });

  const albumList = document.querySelector('#albums-list');
  albumList.innerHTML = '';
  group.albums?.forEach(album => {
    const li = document.createElement('li');
    li.textContent = album.name;
    albumList.appendChild(li);
  });
}
