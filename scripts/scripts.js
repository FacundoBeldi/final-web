//TODO: Funcion de Login

function login(event) { //funcion del login, paso como parametro event para la funcion de abajo
    event.preventDefault(); //Evita que se recargue la página al enviar el formulario, si lo saco se recarga la página y se borra lo que se escribió en los inputs
    const username = document.getElementById('username').value; // Obtiene el valor del input con id username
    const password = document.getElementById('password').value; // Obtiene el valor del input con id password

    if (username === 'admin' && password === 'admin') { // Si el usuario y contraseña son iguales a admin (admin lo puse yo a modo de ejemplo)
        document.getElementById('login-container').classList.remove('show'); //Hago que no se vea el login-container
        document.getElementById('crud-container').classList.add('show'); //Hago que se vea el crud de usuarios
    } else {
        document.getElementById('alert').style.display = 'block'; // Si el usuario y contraseña no son iguales a admin, muestro el alert de error
    }
}

//TODO: Funciones del Crud

const baseURL = 'https://66677fa2a2f8516ff7a7a5f0.mockapi.io' //URL de la API

//? Obtener los usuarios de la API
axios.get(`${baseURL}/users`)//Obtengo los usuarios de la API
.then(response => {
    renderUsers(response.data)
    }) //Si la respuesta es correcta, muestro los usuarios en la tabla
.catch(error => {
    Swal.fire({
    icon: "error",
    title: "Oops...",
    text: "Algo salió mal!",
    footer: "No estamos recibiendo correctamente la información de la API, por favor intenta más tarde"
});
console.log(error);
}); //Si hay un error, lo muestro con esta alerta de swal.fire

//? Rellenar la tabla de usuarios de la API, y los agregados por el usuario

const tableHTML = document.getElementById('table-container');
const tableBodyHTML = document.getElementById('table-body');

function renderUsers(arrayUsers) {
    tableBodyHTML.innerHTML = ''; //Limpio la tabla
    arrayUsers.forEach(user => { //Recorro el array de usuarios, por cada usuario agrego una fila a la tabla
        tableBodyHTML.innerHTML += `
            <tr>
                 <td class="user-image">
                    <img src="${user.image}" alt ="${user.fullname} avatar">
                 </td>
                <td class="user-name"> ${user.fullname}</td>
                <td class="user-mail"> ${user.email}</td>
                <td class="user-city"> ${user.location}</td>
                <td class="user-age"> ${user.bornDate}</td>
                <td class="cont-btn">
                    <button class="btn btn-danger btn-sm" onclick="deleteUser('${user.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <button class="btn btn-primary btn-sm" data-edit="${user.id}">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                </td>
            </tr>`;
    });
    //updateEditButtons();
}

//? Editar un usuario

function updateEditButtons(){
    userButtonsEdit = document.querySelectorAll('button[data-edit]'); //Selecciono todos los botones con el atributo data-edit
    userButtonsEdit.forEach(button => { //Por cada botón, le agrego un evento click
        button.addEventListener('click', function(event){
            event.preventDefault(); //Que no se recargue la página
            const id = event.currentTarget.dataset.edit; //Obtengo el id del usuario que fue clickeado
            completeUser(id); //Voy a la función de completar usuario con el id clickeado
        });
    });
}

//? Agregar un usuario

function completeUser(){
    
}