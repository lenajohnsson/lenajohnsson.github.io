'use strict';

function musicService(url) {
  this.url = url;

  this._myMusicFetch = async function (url, method = null, body = null) {
    try {
      // if method is null or undefined --> default to GET
      method ??= 'GET';

      // fetch(url, options) sends an HTTP-request to the server
      // await waiting for the server respond
      let result = await fetch(url, {
        // HTTP method = GET, POST, PUT or DELETE
        method: method,
        // HTTP headers = metadata describing the request,
        // 'content-type' tells the server that the body is JSON
        headers: { 'content-type': 'application/json' },
        // body = the actual data sent to the server
        // if body exists --> convert object to JSON text
        // if no body --> send null
        body: body ? JSON.stringify(body) : null
      });

      if (result.ok) {
        console.log(`${method} OK ${url}`);

        // if result succeded read JSON and return data
        let data = await result.json();
        return data;
      } else {
        console.log(`Failed to recieved data from server: ${result.status}`);
        alert(`Failed to recieved data from server: ${result.status}`);
      }
    } catch (error) {
      console.log(`Failed to recieved data from server: ${error.message}`);
      alert(`Failed to recieved data from server: ${error.message}`);
    }
  };

  // Helpers
  this._readItemsAsync = async function (requestedUrl, filter, pageNr, pageSize, flat, seeded) {
    // ? = where the endpoint stops and the query parameters starts
    // pageNr, pageSize and flat = required - filter = not required
    requestedUrl += `?pageNr=${pageNr}&pageSize=${pageSize}&flat=${flat}&seeded=${seeded}`;
    if (filter != null) {
      requestedUrl += `&filter=${filter}`;
    }
    let data = await this._myMusicFetch(requestedUrl);
    return data;
  };

  this._readItemAsync = async function (requestedUrl, id, flat) {
    requestedUrl += `?id=${id}&flat=${flat}`;
    let data = await this._myMusicFetch(requestedUrl);
    return data;
  };

  this._createItemAsync = async function (requestedUrl, newItem) {
    let data = await this._myMusicFetch(requestedUrl, 'POST', newItem);
    return data;
  };

  // Methods
  this.readMusicGroupsAsync = async (
    filter = null,
    pageNr,
    pageSize = 10,
    flat = false,
    seeded = true
  ) => this._readItemsAsync(`${this.url}/MusicGroups/Read`, filter, pageNr, pageSize, flat, seeded);

  this.readMusicGroupAsync = async (id, flat = true) =>
    this._readItemAsync(`${this.url}/MusicGroups/ReadItem`, id, flat);

  this.createMusicGroupAsync = async newItem =>
    this._createItemAsync(`${this.url}/MusicGroups/CreateItem`, newItem);
}

export default musicService;
