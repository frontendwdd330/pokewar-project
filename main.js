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
  }else{
    return json
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
// create click handler for pokémon type
function typeClickHandler(event) {
  const selectType = event.target;
  const url = selectType.dataset.url;
  getData(url, renderPokeList);
  setActive(url);
}

// create click handler for pokémon card
async function pokemonClickHandler(event) {
  const selectPokemon = event.target;
  const url = selectPokemon.dataset.url;
  getData(url, renderPokeModal);
  setActive(url);
}
// parameter example
// (div, class, childDiv, parentDiv )
function appendNewElement(htmlTag, 
  attribute, 
  attributeName, 
  appendTo, 
  content = null, 
  attribute2 =null, 
  attributeName2=null){

  let parent = document.querySelector(appendTo);
  let element = document.createElement(htmlTag);
  element.setAttribute(attribute, attributeName);
  if(content){
    element.innerHTML = content;
  }
  if(attribute2){
    element.setAttribute(attribute2, attributeName2);
  }
  parent.appendChild(element);
}
  // turn on the modal and overlay
  function modalOn(){
    const modalDiv = document.querySelector(".modal");
    const overlay = document.querySelector("#overlay");
    modalDiv.classList.add("active");
    overlay.classList.add("active");
  }
  // turn off the modal and overlay
  function modalOffListener(){
    const circle = document.querySelector(".mrTopCircle");
    circle.addEventListener("click", modalOff);
    const overlay = document.querySelector("#overlay");
    overlay.addEventListener("click", modalOff);
  }
  function modalOff(){
    const modalDiv = document.querySelector(".modal");
    const overlay = document.querySelector("#overlay");
    modalDiv.classList.remove("active");
    overlay.classList.remove("active");
    document.querySelector(".leftDiv").remove();
    document.querySelector(".rightDiv").remove();
  }

  function findEn(entry){
    return entry.language.name === "en";
  }

  function findImage(data){
    var image;
    if(data.sprites.other.dream_world.front_default != null){
        image = data.sprites.other.dream_world.front_default;
    } else if(data.sprites.other.home.front_default != null){
      image = data.sprites.other.home.front_default
    } else if(data.sprites.front_default !=null){
      image = data.sprites.front_default;
    }
    return image;
  }

async function renderPokeModal(data){
  console.log("this the data from renderPokeModal")
  console.log(data)
  // all the model staff goes here
  appendNewElement("div","id", "overlay","body");

  // leftDiv the img div
  appendNewElement("div","class", "leftDiv",".modal");

  // mlTop modal left top
  appendNewElement("div", "class", "mlTop", ".leftDiv");

  // lCircle
  appendNewElement("div", "class", "lCircle", ".mlTop");

  //mlBody
  appendNewElement("div", "class", "mlBody", ".leftDiv"); 

  // mlImg
  appendNewElement("div", "class", "mlImg", ".mlBody");
  //img
  const pokeImg = findImage(data);
  console.log(pokeImg)
  appendNewElement("img", "alt", "Selected Pokémon", ".mlImg",null, "src", pokeImg);

  //mlBottom
  appendNewElement("div", "class", "mlBottom", ".leftDiv");

  //BottomCircle
  appendNewElement("div", "class", "BottomCircle", ".mlBottom");

  //plusControl
  appendNewElement("div", "class", "plusControl", ".mlBottom");

  //plusImg
  appendNewElement("img", "alt", "plusImg", ".plusControl",null, "src", "/images/plus.png");

  // rightDiv the info div
  appendNewElement("div", "class", "rightDiv", ".modal");

  // mrTop modal right top
  appendNewElement("div", "class", "mrTop", ".rightDiv");

  //mrTopCircle 
  appendNewElement("div", "class", "mrTopCircle", ".mrTop");

  // x button
  appendNewElement("p", "class", "pClass", ".mrTopCircle", "X");
  // turn on the modal
  modalOn();
  // turn off the modal
  modalOffListener();

  //mrBody
  appendNewElement("div", "class", "mrBody", ".rightDiv");

  // mrBodyDetails
  appendNewElement("div", "class", "mrBodyDetails", ".mrBody");

  //pokeName
  appendNewElement("h1", "class", "h1Class", ".mrBodyDetails", data.name);
  
  // abilities/ul
  appendNewElement("ul", "class", "abilitiesUl", ".mrBodyDetails");
  
  // abilities/h2
  appendNewElement("h2", "class", "h2Class", ".abilitiesUl", "Abilities");
  // abilities/li
  data.abilities.forEach(element => {
    appendNewElement("li", "class", "liClass", ".abilitiesUl", element.ability.name )
  });
  //description
  const info = await getData(data.species.url);
  const textEntry = info.flavor_text_entries.find(entry => findEn(entry))
  appendNewElement("p", "class", "pClass", ".mrBodyDetails", textEntry.flavor_text);
  
  // mrBottom
  appendNewElement("div", "class", "mrBottom", ".rightDiv");

  // add to my team!/a
  appendNewElement("a", "class", "addTeam", ".mrBottom",null,"href", "algunOtroView");

  // add to my team!/p
  appendNewElement("p", "class", "pClass", ".addTeam", "Add to my Team!");
}

// render the list
function renderPokeList(list) {
  const element = document.getElementById('pokeList');
  element.addEventListener("click", pokemonClickHandler);

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
  const allTypes = document.querySelectorAll('.types > li'); // the > means direct descendant!!!
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


