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

const baseURL = 'https://66677fa2a2f8516ff7a7a5f0.mockapi.io/productos' //URL de la API

var products = []; //Array de usuarios de la API

//? Obtener los usuarios de la API
axios.get(`${baseURL}/products`)//Obtengo los usuarios de la API
    .then(response => {
        renderProducts(response.data)
        products = response.data; //Guardo los usuarios agarrados por la API en el array
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

function renderProducts(arrayProducts) {
    tableBodyHTML.innerHTML = ''; //Limpio la tabla
    arrayProducts.forEach(products => { //Recorro el array de usuarios, por cada usuario agrego una fila a la tabla
        tableBodyHTML.innerHTML += `
            <tr>
                 <td class="product-image">
                    <img src="${products.image}" alt ="${products.name}">
                 </td>
                <td class="product-name"> ${products.name}</td>
                <td class="product-category"> ${products.category}</td>
                <td class="product-price"> ${products.price}</td>
                <td class="product-points"> ${products.points}</td>
                <td class="cont-btn">
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct('${products.id}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                    <button class="btn btn-primary btn-sm" data-edit="${products.id}">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                </td>
            </tr>`;
    });
    updateEditButtons();
}

//? Eliminar un usuario

function deleteProduct(idProduct) {

    const indice = products.findIndex((product) => product.id == idProduct);

    if (indice === -1) {//Si no lo encuentra, muestro un error
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se encontró el producto a eliminar'
        })
        return;
    }

    products.splice(indice, 1);//Elimino el usuario del array
    renderProducts(products);//Vuelvo a mostrar la tabla
    axios.delete(`${baseURL}/products/${idProduct}`)
        .then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Usuario eliminado',
                text: 'El producto ha sido eliminado correctamente'
            });
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Algo salió mal al eliminar el producto'
            });
            console.log(error);
        });
}

//? Editar un usuario

function updateEditButtons() {
    productButtonsEdit = document.querySelectorAll('button[data-edit]'); //Selecciono todos los botones con el atributo data-edit
    productButtonsEdit.forEach(button => { //Por cada botón, le agrego un evento click
        button.addEventListener('click', function (event) {
            event.preventDefault(); //Que no se recargue la página
            const id = event.currentTarget.dataset.edit; //Obtengo el id del usuario que fue clickeado
            completeProduct(id); //Voy a la función de completar usuario con el id clickeado
        });
    });
}

//? Agregar un usuario cuando toco submit

let isEditing = false; //Variable para saber si estoy editando o agregando un usuario
let userToEdit = null; //Variable para saber qué usuario estoy editando
const userFormHTML = document.querySelector('#user-form'); //Selecciono el formulario de usuario
const btnSubmitHTML = userFormHTML.querySelector('button[type="submit"]'); //Selecciono el botón de submit del formulario
const formContainerHTML = document.querySelector('.formulario'); //Selecciono el contenedor del formulario para la estetica

userFormHTML.addEventListener('submit', (event) => { //Agrego un evento submit al formulario

    event.preventDefault(); //Evito que se recargue la página
    const element = event.target.elements; //Selecciono los elementos del formulario

    const newProduct = { //Creo un objeto con los valores del formulario
        //el id lo asigna la API
        name: element.name.value,
        image: element.image.value,
        category: element.category.value,
        price: element.price.value,
        points: element.points.value
    }

    if (isEditing) { //Si estoy editando, PUT y cartel de editar
        axios.put(`${baseURL}/products/${productToEdit}`, newProduct)
            .then(response => {
                const index = products.findIndex(product => product.id === productToEdit);
                products[index] = response.data;
                renderProducts(products);
                resetForm();
                Swal.fire({
                    icon: 'success',
                    title: 'Producto editado',
                    text: 'El producto ha sido editado correctamente'
                });
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salió mal al editar el producto'
                });
                console.log(error);
            });
    } else { //Si estoy agregando, POST y cartel de agregar
        axios.post(`${baseURL}/products`, newProduct)
            .then(response => {
                products.push(response.data);
                renderProducts(products);
                resetForm();
                Swal.fire({
                    icon: 'success',
                    title: 'Producto agregado',
                    text: 'El producto ha sido agregado correctamente'
                });
            })
            .catch(error => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salió mal al agregar el producto'
                });
                console.log(error);
            });
    }
});

//? Completar el formulario con los datos del usuario a editar

function completeProduct(idProduct) {
    isEditing = true; //Estoy editando un usuario
    productToEdit = idProduct;
    const product = products.find((prod) => prod.id === idProduct); //Busco el usuario a editar

    if (!product) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se encontró el producto a editar'
        });
        return;
    }

    //?Reemplazar los valores del formulario con los del usuario a editar
    const element = userFormHTML.elements; //Selecciono los elementos del formulario
    element.name.value = product.name; //Reemplazo el valor
    element.image.value = product.image; //Reemplazo el valor
    element.category.value = product.category; //Reemplazo el valor
    element.price.value = product.price; //Reemplazo el valor
    element.points.value = product.points; //Reemplazo el valor

    //? Cambiar el texto del botón de submit
    formContainerHTML.classList.add('form-edit'); //Muestro el formulario con otra  estética
    btnSubmitHTML.classList.remove('btn-primary');
    btnSubmitHTML.classList.add('btn-naranja-fuerte');
    btnSubmitHTML.innerText = 'Editar empleado';
}

//?Reseteo el formulario, lo limpio y cambio estéticas
function resetForm() {
    userFormHTML.reset();
    isEditing = false;
    productToEdit = null;
    btnSubmitHTML.classList.remove('btn-naranja-fuerte');
    btnSubmitHTML.classList.add('btn-primary');
    formContainerHTML.classList.remove('form-edit');
    btnSubmitHTML.innerText = 'Agregar';
}

//? Busqueda de empleado
function inputSearch(event){
    event.preventDefault(); //Noserecarga la página
    const search = event.target.value.toLocaleLowerCase(); //agarro el valor del input y lo paso a minúsculas
    const filtro = products.filter((prod) =>{ //Filtro los usuarios
        if(prod.name.toLocaleLowerCase().includes(search)){ //Si el nombre del usuario incluye la búsqueda
            return 1; //verdadero
        }else{
            return 0;//falso
        }
    });
    renderProducts(filtro);//Muestro los usuarios filtrados
}