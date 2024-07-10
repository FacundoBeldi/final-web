const baseURL = 'https://66677fa2a2f8516ff7a7a5f0.mockapi.io/productos/products' //URL de la API

var products = []; //Array de productos de la API

//? Obtener los productos de la API
axios.get(baseURL)//Obtengo los productos de la API
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
  cardBodyHTML.innerHTML = ''; // Limpiar el contenedor antes de renderizar los productos
  arrayProducts.forEach(product => {
    const stars = getStars(product.points); // Obtener las estrellas según el puntaje
      cardBodyHTML.innerHTML += `
      <div class="card-container">
        <div class="card__image-container">
          <img src="${product.image}" alt="${product.name}" class="card__image">
        </div>
        <div class="card__content">
          <p class="card__title">${product.name}</p>
          <div class="card__info">
            <p class="card__price">$${product.price}</p>
            <div class="card__stars">${stars}</div>
          </div>
          <p class="card__description">${product.description}</p>
          <a href="https://wa.me/541164674381" class="card__contact">
            <i class="fab fa-whatsapp"></i> 
          </a>
        </div>
      </div>`;
  });
}


document.getElementById('search').classList.add('btn-naranja-fuerte');

function inputSearch(event){
  event.preventDefault(); //No se recarga la página
  const search = event.target.value.toLocaleLowerCase(); //agarro el valor del input y lo paso a minúsculas
  const filtro = products.filter((prod) =>{ //Filtro los productos
      if(prod.name.toLocaleLowerCase().includes(search)){ //Si el nombre del producto incluye la búsqueda
          return 1; //verdadero
      }else{
          return 0;//falso
      }
  });
  renderProds(filtro);//Muestro los productos filtrados
}

// Función para obtener las estrellas según el puntaje
function getStars(points) {
  const totalStars = 5;
  let starsHTML = ''; // Variable para guardar el HTML de las estrellas
  for (let i = 1; i <= totalStars; i++) { // Recorrer las 5 estrellas 
    if (i <= points) { 
      starsHTML += '<i class="fas fa-star filled"></i>'; // Agregar estrella llena
    } else {
      starsHTML += '<i class="fas fa-star"></i>'; // Agregar estrella vacía
    }
  }
  return starsHTML;
}