const URL = 'https://654c35d877200d6ba8589e5d.mockapi.io';
const ENDPOINT = '/users';
const forms = Array.from(document.querySelectorAll('form'));
const resultTable = document.querySelector('#results');

document.addEventListener('DOMContentLoaded', (e) => {
  // Function get
  const [getForm] = forms.filter((form) => form.id === 'get-box');

  getForm.addEventListener('submit', async (e) => {
    e.stopPropagation();
    e.preventDefault();

    const { value } = getForm.querySelector('input');
    let data = [];

    value !== ''
      ? data.push(
          await fetch(URL + ENDPOINT + `/${value}`)
            .then((res) => res.json())
            .then((data) => data)
            .catch((error) => error)
        )
      : (data = await fetch(URL + ENDPOINT)
          .then((res) => res.json())
          .then((data) => data)
          .catch((error) => error));

    resultTable.innerHTML = '';

    data.forEach(({ id, name, lastName }) => {
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
  });
});
