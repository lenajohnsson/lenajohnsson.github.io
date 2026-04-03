'use strict';

import musicService from './service-music-groups.js';

(async () => {
  // Initializing the musicService
  const _musicService = new musicService(`https://music.api.public.seido.se/api`);

  // ---VARIABLES---
  const listElement = document.querySelector('#music-list');
  const searchForm = document.querySelector('#search-form');
  const checkBox = document.querySelector('#check-box');

  // Getting URL-params to save the state of the page when going back
  // from the groupinfo page or searching for something
  const urlParams = new URLSearchParams(window.location.search);
  const savedPage = Number(urlParams.get('page'));
  const savedSearch = urlParams.get('search');

  // If the user have searched for something
  let currentSearch = savedSearch || null;
  // If the user have been on a page before
  let currentPage = savedPage || 0;
  // Total pages, will be updated when loading the groups
  let totalPages = 1;

  // ---FUNCTIONS---
  // getting the groups from the API
  async function loadGroups(filter = null) {
    const pageSize = 10;
    // Get the value of the checkbox
    const seeded = checkBox.checked;

    const data = await _musicService.readMusicGroupsAsync(
      filter,
      currentPage,
      pageSize,
      false,
      seeded
    );

    // Limiting the total pages to the amount of pages there are with the filter,
    // or 10 if there is no filter
    if (filter) {
      totalPages = Math.min(data.pageCount, 10);
    } else {
      totalPages = 10;
    }

    renderList(data.pageItems);
    renderPagination(totalPages);

    // Displaying the number of results
    const resultElement = document.querySelector('#search-result');
    // If there is a filter, show the number of results, otherwise clear the text
    if (filter) {
      resultElement.textContent = `${data.dbItemsCount} träffar för "${filter}"`;
    } else {
      resultElement.textContent = '';
    }

    // Update the URL with the current page and search filter
    history.replaceState(null, '', `?page=${currentPage}${filter ? `&search=${filter}` : ''}`);
  }

  // Building the list of groups in the DOM
  function renderList(musicGroups) {
    listElement.innerHTML = '';

    let imageCount = 1;
    for (const group of musicGroups) {
      const li = document.createElement('li');

      li.innerHTML = `
        <img class="thumb-nails" src="images/m${imageCount}.png" alt="" />
                <div class="div-music-list">
                    <div>
                        <a href="groupinfo.html?id=${group.musicGroupId}&img=${imageCount}">${group.name}</a>
                    </div>
                    <div>
                        <p>Genre: ${group.strGenre}</p>
                    </div>
                    <div>
                        <p>Etableringsår: ${group.establishedYear}</p>
                    </div>
                    <div>
                        <p>Släppta album: ${group.albums?.length ?? 0}</p>
                    </div>
                </div>
                <div class="div-info-button">
                    <a href="groupinfo.html?id=${group.musicGroupId}&img=${imageCount}">
                        <button class="margin-inline-start-10">Mer information</button>
                    </a>
                </div>`;

      listElement.appendChild(li);
      imageCount++;
    }
  }

  // Building the pagination buttons
  function renderPagination(totalPages) {
    const pageButtonContainer = document.querySelector('#page-btn');
    pageButtonContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.classList.add('page-button');
      button.textContent = i;

      if (i === currentPage + 1) {
        button.classList.add('active-page-btn');
      }

      button.addEventListener('click', () => {
        currentPage = i - 1;
        loadGroups(currentSearch);
      });
      pageButtonContainer.appendChild(button);
    }
  }

  // ---EVENT LISTENERS---
  // Previous button
  document.querySelector('#prev-btn').addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      loadGroups(currentSearch);
    }
  });

  // Next button
  document.querySelector('#next-btn').addEventListener('click', () => {
    if (currentPage < totalPages) {
      currentPage++;
      loadGroups(currentSearch);
    }
  });

  // Search function - resets to page 0 and loads the groups with the search filter
  searchForm.addEventListener('submit', async event => {
    event.preventDefault();

    let searchInput = document.querySelector('#input-txt').value.toLowerCase().trim();
    console.log(searchInput);
    currentPage = 0;
    currentSearch = searchInput;
    loadGroups(currentSearch);
  });

  // Checkbox function - reloads the groups based on the seeded value
  checkBox.addEventListener('change', () => {
    loadGroups(currentSearch);
  });

  // ---INIT---
  // Load the groups when the page is loaded, with the saved search filter
  // if there is one
  loadGroups(savedSearch);
})();
