//TODO: Funcion de Login

function login(event) { //funcion del login, paso como parametro event para la funcion de abajo
    event.preventDefault(); //Evita que se recargue la página al enviar el formulario, si lo saco se recarga la página y se borra lo que se escribió en los inputs
    const username = document.getElementById('username').value; // Obtiene el valor del input con id username
    const password = document.getElementById('password').value; // Obtiene el valor del input con id password

    if (username === 'admin' && password === 'admin') { // Si el usuario y contraseña son iguales a admin (admin lo puse yo a modo de ejemplo)
        document.getElementById('login-container').classList.remove('shows'); //Hago que no se vea el login-container
        document.getElementById('crud-container').classList.add('shows'); //Hago que se vea el crud de usuarios
    } else {
        document.getElementById('alert').style.display = 'block'; // Si el usuario y contraseña no son iguales a admin, muestro el alert de error
    }
}

//TODO: Funciones del Crud

const baseURL = 'https://66677fa2a2f8516ff7a7a5f0.mockapi.io/productos' //URL de la API

var products = []; //Array de productos de la API

//? Formateo de fechas

function formateaFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const año = fecha.getFullYear();
    const fechaFormato = `${dia}-${mes}-${año}`;
    return fechaFormato;
}

//? Obtener los productos de la API

axios.get(`${baseURL}/products`)//Obtengo los productos de la API
    .then(response => {
        renderProducts(response.data)
        products = response.data; //Guardo los productos agarrados por la API en el array
    }) //Si la respuesta es correcta, muestro los productos en la tabla
    .catch(error => {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Algo salió mal!",
            footer: "No estamos recibiendo correctamente la información de la API, por favor intenta más tarde"
        });
        console.log(error);
    }); //Si hay un error, lo muestro con esta alerta de swal.fire

//? Rellenar la tabla de productos de la API, y los agregados por el usuario

const tableHTML = document.getElementById('table-container'); //Selecciono el contenedor de la tabla
const tableBodyHTML = document.getElementById('table-body'); //Selecciono el cuerpo de la tabla

function renderProducts(arrayProducts) {
    tableBodyHTML.innerHTML = ''; //Limpio la tabla
    arrayProducts.forEach(products => { //Recorro el array de productos, por cada producto agrego una fila a la tabla
        tableBodyHTML.innerHTML += `
            <tr>
                 <td class="product-image">
                    <img src="${products.image}" alt ="${products.name}">
                 </td>
                <td class="product-name"> ${products.name}</td>
                <td>${formateaFecha(products.created_at)}</td>
                <td class="product-category"> ${products.category}</td>
                <td class="product-description"> ${products.description}</td>
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

//? Eliminar un producto

function deleteProduct(idProduct) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Se eliminará el producto seleccionado",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const indice = products.findIndex((product) => product.id == idProduct);

            if (indice === -1) {//Si no lo encuentra, muestro un error
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se encontró el producto a eliminar'
                });
                return;
            }

            products.splice(indice, 1);//Elimino el producto del array
            renderProducts(products);//Vuelvo a mostrar la tabla
            axios.delete(`${baseURL}/products/${idProduct}`)
                .then(() => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Producto eliminado',
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
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Cancelado',
                text: 'La eliminación del producto ha sido cancelada'
            });
        }
    });
}

//? Editar un producto

function updateEditButtons() {
    productButtonsEdit = document.querySelectorAll('button[data-edit]'); //Selecciono todos los botones con el atributo data-edit
    productButtonsEdit.forEach(button => { //Por cada botón, le agrego un evento click
        button.addEventListener('click', function (event) {
            event.preventDefault(); //Que no se recargue la página
            const id = event.currentTarget.dataset.edit; //Obtengo el id del producto que fue clickeado
            completeProduct(id); //Voy a la función de completar producto con el id clickeado
        });
    });
}

//? Mécanica de Submit (Agregar/Editar)

let isEditing = false; //Variable para saber si estoy editando o agregando un producto
let productToEdit = null; //Variable para saber qué producto estoy editando
const productFormHTML = document.querySelector('#product-form'); //Selecciono el formulario de producto
const btnSubmitHTML = productFormHTML.querySelector('button[type="submit"]'); //Selecciono el botón de submit del formulario
const formContainerHTML = document.querySelector('.formulario'); //Selecciono el contenedor del formulario para la estetica

productFormHTML.addEventListener('submit', (event) => { //Agrego un evento submit al formulario

    event.preventDefault(); //Evito que se recargue la página
    const element = event.target.elements; //Selecciono los elementos del formulario
    const name = element.name.value.trim(); //Obtengo el valor del input name y le quito los espacios al principio y al final
    const description = element.description.value.trim(); //Obtengo el valor del input description y le quito los espacios al principio y al final

    if (name.length > 35) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'El nombre del producto no puede tener más de 35 caracteres'
        });
        return;
    }

    if (description.length > 250) {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'La descripción del producto no puede tener más de 250 caracteres'
        });
        return;
    }

    const newProduct = { //Creo un objeto con los valores del formulario
        //el id lo asigna la API
        name: name,
        image: element.image.value,
        category: element.category.value,
        description: description,
        price: element.price.value,
        points: element.points.value,
        created_at: Date.now()
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
                resetForm(); //Reseteo el formulario
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

//? Completar el formulario con los datos del producto a editar

function completeProduct(idProduct) {
    isEditing = true; //Estoy editando un producto
    productToEdit = idProduct;//Guardo el id del producto a editar
    const product = products.find((prod) => prod.id === idProduct); //Busco el producto a editar

    if (!product) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se encontró el producto a editar'
        });
        return;
    }

    //?Reemplazar los valores del formulario con los del producto a editar

    const element = productFormHTML.elements; //Selecciono los elementos del formulario
    element.name.value = product.name; //Reemplazo el valor
    element.image.value = product.image; //Reemplazo el valor
    element.category.value = product.category; //Reemplazo el valor
    element.description.value = product.description; //Reemplazo el valor
    element.price.value = product.price; //Reemplazo el valor
    element.points.value = product.points; //Reemplazo el valor

    //? Cambiar el texto del botón de submit

    formContainerHTML.classList.add('form-edit'); //Muestro el formulario con otra  estética
    btnSubmitHTML.classList.remove('btn-primary'); //Cambio el color del botón, quito
    btnSubmitHTML.classList.add('btn-naranja-fuerte'); //Cambio el color del botón, agrego
    btnSubmitHTML.innerText = 'Editar producto';//Cambio texto del boton
}

//?Reseteo el formulario, lo limpio y cambio estéticas

function resetForm() {
    productFormHTML.reset(); //Limpio el formulario
    isEditing = false;
    productToEdit = null;
    btnSubmitHTML.classList.remove('btn-naranja-fuerte'); //Cambio el color del botón, quito
    btnSubmitHTML.classList.add('btn-primary'); //Cambio el color del botón, agrego
    formContainerHTML.classList.remove('form-edit'); //Muestro el formulario con otra  estética
    btnSubmitHTML.innerText = 'Agregar'; //Cambio texto del boton
}

//? Busqueda de producto

function inputSearch(event) {
    event.preventDefault(); //No se recarga la página
    const search = event.target.value.toLocaleLowerCase(); //agarro el valor del input y lo paso a minúsculas
    const filtro = products.filter((prod) => { //Filtro los productos
        if (prod.name.toLocaleLowerCase().includes(search)) { //Si el nombre del producto incluye la búsqueda
            return 1; //verdadero
        } else {
            return 0;//falso
        }
    });
    renderProducts(filtro);//Muestro los productos filtrados
}

//? Ordenar productos

const filterButton = document.getElementById('filter-button2');
document.getElementById('filter-button2').classList.add('btn-naranja-fuerte'); //Estetica

filterButton.addEventListener('click', function () { //Evento para mostrar el filtro
  const filterOptions = document.getElementById('filter-options');
  filterOptions.style.display = filterOptions.style.display === 'none' ? 'flex' : 'none'; //Mostrar o no el filtro. Si está oculto ('none'), lo cambia a flex para mostrarlo, y si está visible ('flex'), lo cambia a none para ocultarlo
});

// Evento para aplicar el filtro seleccionado

const applyFilterButton = document.getElementById('apply-filter');
document.getElementById('apply-filter').classList.add('btn-naranja-fuerte'); //Estetica
applyFilterButton.addEventListener('click', function () {
  const filterType = document.getElementById('filter-type').value;
  applyFilter(filterType); // Aplicar el filtro seleccionado
});

// Función para aplicar el filtro

function applyFilter(filterType) {
  
  const collator = new Intl.Collator(undefined, { sensitivity: 'base' }); //Realizar operaciones de comparación sensibles

  switch (filterType) {
    case 'price-asc':
      products.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      products.sort((a, b) => b.price - a.price);
      break;
    case 'points-asc':
      products.sort((a, b) => a.points - b.points);
      break;
    case 'points-desc':
      products.sort((a, b) => b.points - a.points);
      break;
    case 'name-asc':
      products.sort((a, b) => collator.compare(a.name, b.name));
      break;
    case 'name-desc':
      products.sort((a, b) => collator.compare(b.name, a.name));
      break;
  }
  renderProducts(products); // Renderizar los productos ordenados según el filtro seleccionado
}