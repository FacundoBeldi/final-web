const baseURL = 'https://66677fa2a2f8516ff7a7a5f0.mockapi.io/productos' //URL de la API

var products = []; //Array de productos de la API

//? Obtener los productos de la API
axios.get(`${baseURL}/products`)//Obtengo los productos de la API
    .then(response => {
        renderProds(response.data)
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

//?Renderizado de productos en products

cardBodyHTML = document.getElementById('carda-wrap');

function renderProds(arrayProducts) {
  arrayProducts.forEach(product => { // Recorro el array de productos, por cada producto lo marco en una card
      cardBodyHTML.innerHTML += `
      <div class="card-container">
        <div class="card__image-container" style="background-image: url('${product.image}');">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="card__svg">
            <path d="M20 5H4V19L13.2923 9.70649C13.6828 9.31595 14.3159 9.31591 14.7065 9.70641L20 15.0104V5ZM2 3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082C21.556 3 22 3.44495 22 3.9934V20.0066C22 20.5552 21.5447 21 21.0082 21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934ZM8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11Z"></path>
          </svg>
        </div>
        <div class="card__content">
          <p class="card__title">${product.name}</p>
          <div class="card__info">
            <p class="card__price">${product.price}</p>
            <p class="card__points">${product.points}</p>
          </div>
          <p class="card__description">${product.description}</p>
          <a href="https://wa.me/1234567890" class="card__contact">
            <i class="fab fa-whatsapp"></i> 
          </a>
        </div>
      </div>`;
  });
}

