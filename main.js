/*
When the page loads
    Get list of pokemon types.
    render type list out (need type name and url to get all pokemon of that type)
    attach a listener to respond to a click on the type.
        when clicked it should pull the type url and retrieve the data
        render the list of pokemon
        style the clicked type as active
        filter out types with no pokemon (shadow and unknown)


*/

// we have to convert the response fetch sends back into the appropriate type. In this case the API sends back json...so we process it as json and send it back


// Home Slideshow:
let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides(slideIndex += n);
};

function currentSlide(n) {
  showSlides(slideIndex = n);
};

function showSlides() {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1
  }
  slides[slideIndex - 1].style.display = "block";

  setTimeout(showSlides, 2500); // Change image every 2.5 seconds
};




function convertToJson(response) {
  if (response.ok) {
    return response.json();
  } else {
    throw new Error('bad response');
  }
}

// once we have the data, we need to do something with it. This won't always be the same thing though. With a callback (function passed into a function) we can change the behavior as needed.

async function getData(url, callback) {
  const data = await fetch(url);
  const json = await convertToJson(data);
  // console.log(json);
  if (callback) {
    callback(json);
  }
}

// getData("https://pokeapi.co/api/v2/type");

// keep things from happening until the DOM is ready
// another alternative would be to add 'defer' to our script element

window.addEventListener('load', function () {
  getData("https://pokeapi.co/api/v2/type", renderTypeList);

  document.getElementById('typeList').addEventListener("click", typeClickHandler);
});

// create simple html markup to display a list
function renderTypeList(list) {
  const element = document.getElementById("typeList");

  const cleanList = cleanTypeList(list.results);

  cleanList.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.name}`;
    li.setAttribute("data-url", item.url);
    element.appendChild(li);
  });

}


// create click handler
function typeClickHandler(event) {
  console.log(event.target);
  console.log(event.currentTarget);

  const selectType = event.target;
  const url = selectType.dataset.url;
  getData(url, renderPokeList);
  setActive(url);
}


// render the list

function renderPokeList(list) {
  const element = document.getElementById('pokeList');

  element.innerHTML = "";

  const header = document.createElement('h2');
  header.innerHTML = `${list.name} (${list.pokemon.length})`;
  element.appendChild(header);
  list.pokemon.forEach((item) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.pokemon.name}`; //the .name part shows the element you want to see such as .url, .name, .type, etc.
    li.setAttribute('data-url', item.pokemon.url);
    element.appendChild(li);
  })

  // do a forEach to print out all the documents in the type bellow the html file.
}

// set active item

function setActive(type) {
  const allTypes = document.querySelectorAll('.types > li'); // the > means direct decendent!!!
  allTypes.forEach((item) => {
    if (item.dataset.url === type) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  })
}

// there are no pokemon in unknown and shadow. Let's remove them from the list.

function cleanTypeList(list) {
  return list.filter((item) => item.name != 'shadow' && item.name != 'unknown');
}