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

var users = []; //Array de usuarios de la API

//? Obtener los usuarios de la API
axios.get(`${baseURL}/users`)//Obtengo los usuarios de la API
    .then(response => {
        renderUsers(response.data)
        users = response.data; //Guardo los usuarios agarrados por la API en el array
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

const tableHTML = document.getElementById('table-container'); //Selecciono el contenedor de la tabla
const tableBodyHTML = document.getElementById('table-body'); //Selecciono el cuerpo de la tabla

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
                <td class="user-active">${user.active}></td>
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
    updateEditButtons();
}

//? Eliminar un usuario

function deleteUser(idUser) {

    const indice = users.findIndex((user) => user.id == idUser);

    if (indice === -1) {//Si no lo encuentra, muestro un error
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se encontró el usuario a eliminar'
        })
        return;
    }

    users.splice(indice, 1);//Elimino el usuario del array
    renderUsers(users);//Vuelvo a mostrar la tabla
    axios.delete(`${baseURL}/users/${idUser}`)
        .then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Usuario eliminado',
                text: 'El usuario ha sido eliminado correctamente'
            });
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Algo salió mal al eliminar el usuario'
            });
            console.log(error);
        });
}

//? Editar un usuario

function updateEditButtons() {
    userButtonsEdit = document.querySelectorAll('button[data-edit]'); //Selecciono todos los botones con el atributo data-edit
    userButtonsEdit.forEach(button => { //Por cada botón, le agrego un evento click
        button.addEventListener('click', function (event) {
            event.preventDefault(); //Que no se recargue la página
            const id = event.currentTarget.dataset.edit; //Obtengo el id del usuario que fue clickeado
            completeUser(id); //Voy a la función de completar usuario con el id clickeado
        });
    });
}

//? Agregar un usuario cuando toco submit

let isEditing; //Variable para saber si estoy editando o agregando un usuario
let userToEdit; //Variable para saber qué usuario estoy editando
const userFormHTML = document.querySelector('#user-form'); //Selecciono el formulario de usuario
const btnSubmitHTML = userFormHTML.querySelector('button[type="submit"]'); //Selecciono el botón de submit del formulario
const formContainerHTML = document.querySelector('#form-container'); //Selecciono el contenedor del formulario para la estetica

userFormHTML.addEventListener('submit', (event) => { //Agrego un evento submit al formulario

    event.preventDefault(); //Evito que se recargue la página
    const element = event.target.elements; //Selecciono los elementos del formulario

    const newUser = { //Creo un objeto con los valores del formulario
        id: users.length + 1,
        fullname: element.fullname.value,
        email: element.email.value,
        location: element.location.value,
        bornDate: element.bornDate.value,
        active: element.active.value,
        image: element.image.value
    }; if (isEditing) {
        axios.put(`${baseURL}/users/${userToEdit}`, newUser)
            .then(response => {
                const index = users.findIndex(user => user.id === userToEdit);
                users[index] = response.data;
                renderUsers(users);
                resetForm();
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario editado',
                    text: 'El usuario ha sido editado correctamente'
                });
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salió mal al editar el usuario'
                });
                console.log(error);
            });
    } else {
        axios.post(`${baseURL}/users`, newUser)
            .then(response => {
                users.push(response.data);
                renderUsers(users);
                resetForm();
                Swal.fire({
                    icon: 'success',
                    title: 'Usuario agregado',
                    text: 'El usuario ha sido agregado correctamente'
                });
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salió mal al agregar el usuario'
                });
                console.log(error);
            });
    }
});

//? Completar el formulario con los datos del usuario a editar
function completeUser(idUser) {
    isEditing = idUser; //Estoy editando un usuario
    userToEdit = idUser;
    const user = users.find((usr) => usr.id === idUser); //Busco el usuario a editar

    if (!user) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se encontró el usuario a editar'
        });
        return;
    }
    //?Reemplazar los valores del formulario con los del usuario a editar
    const element = userFormHTML.elements; //Selecciono los elementos del formulario
    element.fullname.value = user.fullname; //Reemplazo el valor
    element.email.value = user.email; //Reemplazo el valor
    element.location.value = user.location; //Reemplazo el valor
    element.bornDate.value = user.bornDate; //Reemplazo el valor
    element.active.value = user.active //Reemplazo el valor
    element.image.value = user.image; //Reemplazo el valor

    //? Cambiar el texto del botón de submit

    formContainerHTML.classList.add('form-edit'); //Muestro el formulario
    btnSubmitHTML.classList.remove('btn-primary'); //Quito la clase btn-primary
    btnSubmitHTML.classList.add('btn-success'); //Agrego la clase btn-success
    btnSubmitHTML.innerText = 'Editar empleado'; //Cambio el texto del botón

    function resetForm() {
        userFormHTML.reset();
        isEditing = false;
        userToEdit = null;
        btnSubmitHTML.classList.remove('btn-success');
        btnSubmitHTML.classList.add('btn-primary');
        btnSubmitHTML.innerText = 'Agregar';
    }
}
