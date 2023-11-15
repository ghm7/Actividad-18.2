const URL = 'https://654c35d877200d6ba8589e5d.mockapi.io';
const ENDPOINT = '/users';
const rightNameForm = ['get-form', 'post-form', 'put-form', 'modal'];
const [getForm, postForm, putForm, modalForm] = Array.from(
  document.querySelectorAll('form')
).filter((form) => rightNameForm.find((name) => name === form.id));
const resultTable = document.querySelector('#results');
const modal = new bootstrap.Modal('#dataModal');

// This function has two roles,
// 1. Get the whole data when you don't provide the id
// 2. Get the specific data by id
const getData = async (url, endpoint, id) => {
  if (id) {
    return fetch(url + endpoint + `/${id}`)
      .then((res) => {
        if (!res.ok) {
          showAlert('El valor no existe en la base de datos.', 'danger');

          throw new Error(`${res.status} ${res.statusText}`);
        }

        return res.json();
      })
      .then((data) => data)
      .catch((error) => {
        throw new Error(error);
      });
  }

  return fetch(url + endpoint)
    .then((res) => {
      if (!res.ok) {
        showAlert('Error de conexión con el servidor', 'danger');

        throw new Error(`${res.status} ${res.statusText}`);
      }

      return res.json();
    })
    .then((data) => data)
    .catch((error) => {
      throw new Error(error);
    });
};

// Creates a new entry in the database
const postData = async (url, endpoint, sendData) => {
  return fetch(url + endpoint, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    method: 'POST',
    body: JSON.stringify(sendData),
  })
    .then((res) => {
      if (!res.ok) {
        showAlert('Error de conexión con la base de datos', 'danger');

        throw new Error(`${res.status} ${res.statusText}`);
      }

      return res.json();
    })
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
    .then((res) => {
      if (!res.ok) {
        showAlert(
          'Error al editar element, no existe en la base de datos',
          'danger'
        );

        throw new Error(`${res.status} ${res.statusText}`);
      }

      return res.json();
    })
    .catch((error) => {
      throw new Error(error);
    });
};

// If you want to check if the form name is right,
// just in case the html code changes
const isFormNameRight = (form, name) =>
  form.some((input) => input.name === name);

// Renders the list
const showList = (array) => {
  resultTable.innerHTML = '';

  if (!(array instanceof Array)) return;

  array.forEach(({ id, name, lastName }) => {
    resultTable.innerHTML += `
      <li class="list-group-item bg-dark text-white">
        <div>ID: ${id}</div>
          <div>Name: ${name}</div>
        <div>Last name: ${lastName}</div>
      </li>
    `;
  });
};

const showAlert = (alertMessage, alertType) => {
  const alert = document.createElement('div');

  alert.innerHTML = `
      <div class="alert alert-${alertType} alert-dismissible fade show" role="alert">
        ${alertMessage}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;

  document.querySelector('main').appendChild(alert);
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
  putForm.addEventListener('submit', async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const { value } = putForm.querySelector('input');

    // Fetching data
    const data = await getData(URL, ENDPOINT, value);
    const dataArray = Object.values(data).slice(0, 2);

    console.log(data);

    modal.show();
    modal._element
      .querySelectorAll('input')
      .forEach((input, index) => (input.value = dataArray[index]));
    document.querySelector('#modal').classList.remove('d-none');
    document.querySelector('#place-holder').classList.add('d-none');

    // Update data
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const [name, lastName] = modalForm.querySelectorAll('input');

      updateData(URL, ENDPOINT, value, {
        name: name.value,
        lastName: lastName.value,
      });

      modal.hide();
    });
  });
});

modal._element.addEventListener('shown.bs.modal', () => {
  modal._element.querySelector('input').focus();
});

modal._element.addEventListener('hidden.bs.modal', () => {
  document.querySelector('#modal').classList.add('d-none');
  document.querySelector('#place-holder').classList.remove('d-none');
});
