const URL = 'https://654c35d877200d6ba8589e5d.mockapi.io';
const ENDPOINT = '/users';
const [getForm, postForm, putForm] = Array.from(
  document.querySelectorAll('form')
);
const resultTable = document.querySelector('#results');

// The right names should be like this
// getForm.name === inputGet
// postForm.name === inputPost
// putForm.name === inputPut

// This function has two roles,
// 1. Get the whole data when you don't provide the id
// 2. Get the specific data by id
const getData = async (url, endpoint, id) => {
  if (id) {
    return fetch(url + endpoint + `/${id}`)
      .then((res) => res.json())
      .then((data) => data)
      .catch((error) => error);
  }

  return fetch(url + endpoint)
    .then((res) => res.json())
    .then((data) => data)
    .catch((error) => error);
};

// Creates a new entry in the database
const postData = async (url, endpoint, sendData) => {
  return fetch(url + endpoint, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    method: 'POST',
    body: JSON.stringify(sendData),
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((error) => error);
};

// Updates a database's entry
const updateData = async (url, endpoint, id, sendData) => {
  return fetch(url + endpoint + `/${id}`, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    method: 'PUT',
    body: JSON.stringify(sendData),
  })
    .then((res) => res.json())
    .catch((error) => error);
};

// If you want to check if the form name is right,
// just in case the html code changes
const isFormNameRight = (form, name) =>
  form.some((input) => input.name === name);

// Renders the list
const showList = (array) => {
  resultTable.innerHTML = '';

  array.forEach(({ id, name, lastName }) => {
    id !== undefined
      ? (resultTable.innerHTML += `
          <li class="list-group-item bg-dark text-white">
            <div>ID: ${id}</div>
              <div>Name: ${name}</div>
            <div>Last name: ${lastName}</div>
          </li>
      `)
      : (resultTable.innerHTML += `
          <li class="list-group-item bg-dark text-white">
            <div>El valor ingresado no existe en la base de datos.</div>
          </li>
      `);
  });
};

document.addEventListener('DOMContentLoaded', (e) => {
  // Get functionality
  getForm.addEventListener('submit', async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const { value } = getForm.querySelector('input');
    let data = [];

    value !== ''
      ? data.push(await getData(URL, ENDPOINT, value))
      : (data = await getData(URL, ENDPOINT));

    showList(data);
  });

  // Post functionality
  postForm.addEventListener('submit', async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const [inputName, inputLastName] = Array.from(
      postForm.querySelectorAll('input')
    );

    const userData = { name: inputName.value, lastName: inputLastName.value };
    postData(URL, ENDPOINT, userData);

    const data = await getData(URL, ENDPOINT);
    showList(data);
  });

  // Put functionality
});
