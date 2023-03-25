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
  console.log(event.target);
  console.log(event.currentTarget);

  const selectType = event.target;
  const url = selectType.dataset.url;
  getData(url, renderPokeList);
  setActive(url);
}

// create click handler for pokémon card
async function pokemonClickHandler(event) {
  console.log(event.target);
  console.log(event.currentTarget);

  const selectPokemon = event.target;
  const url = selectPokemon.dataset.url;
  const data = await fetch(url);
  const json = await convertToJson(data);
  console.log(json)

  getData(url, renderPokeModal);
  setActive(url);
}

async function renderPokeModal(data){
  console.log("this the data from renderPokeModal")
  console.log(data)
  // all the model staff goes here
  const body = document.querySelector("body");
  const overlay = document.createElement("div");
  overlay.setAttribute("id", "overlay");
  body.appendChild(overlay);

  const modalDiv = document.querySelector(".modal");
  modalDiv.classList.add("active");
  // leftDiv the img div
  const leftDiv = document.createElement("div");
  leftDiv.setAttribute('class', 'leftDiv');

  // mlTop modal left top
  const mlTop = document.createElement('div');
  mlTop.setAttribute("class", "mlTop");
  leftDiv.appendChild(mlTop);
  // lCircle
  const lCircle = document.createElement("div");
  lCircle.setAttribute("class", "lCircle");
  mlTop.appendChild(lCircle);

  //mlBody
  const mlBody = document.createElement('div');
  mlBody.setAttribute("class", "mlBody");
  leftDiv.appendChild(mlBody);
  // mlImg
  const mlImg = document.createElement("div");
  mlImg.setAttribute("class", "mlImg");
  mlBody.appendChild(mlImg);

  const img = document.createElement("img");
  img.setAttribute("alt", "Selected Pokémon");
  img.setAttribute("src",data.sprites.other.dream_world.front_default);
  mlImg.appendChild(img);
  //mlBottom
  const mlBottom = document.createElement('div');
  mlBottom.setAttribute("class", "mlBottom");
  leftDiv.appendChild(mlBottom);
  //BottomCircle
  const BottomCircle = document.createElement('div');
  BottomCircle.setAttribute("class", "BottomCircle");
  mlBottom.appendChild(BottomCircle);
  //plusControl
  const plusControl = document.createElement('div');
  plusControl.setAttribute("class", "plusControl");
  mlBottom.appendChild(plusControl);

  modalDiv.appendChild(leftDiv)
  // rightDiv the info div
  const rightDiv = document.createElement("div");
  rightDiv.setAttribute('class', 'rightDiv');
  modalDiv.appendChild(rightDiv);
  // mrTop modal right top
  const mrTop = document.createElement("div");
  mrTop.setAttribute('class', 'mrTop');
  rightDiv.appendChild(mrTop);
  //mrTopCircle 
  const mrTopCircle = document.createElement("div");
  mrTopCircle.setAttribute('class', 'mrTopCircle');
  const p = document.createElement("p");
  p.innerHTML = "X";
  mrTopCircle.appendChild(p);
  mrTop.appendChild(mrTopCircle);
  //mrBody
  const mrBody = document.createElement("div");
  mrBody.setAttribute('class', 'mrBody');
  const mrBodyDetails = document.createElement("div");
  mrBodyDetails.setAttribute('class', 'mrBodyDetails');
  //pokeName
  const pokeName = document.createElement("h1");
  pokeName.innerHTML = data.name;
  mrBodyDetails.appendChild(pokeName);
  // abilities
  const abilitiesUl = document.createElement("ul");
  const abilitiesH2 = document.createElement("h2");
  abilitiesH2.innerHTML = "Abilities";
  abilitiesUl.appendChild(abilitiesH2);
  mrBodyDetails.appendChild(abilitiesUl);
  for(let i =0; i<2; i++){
    const abilitiesLi = document.createElement("li");
    abilitiesLi.innerHTML = data.abilities[i].ability.name;
    abilitiesUl.appendChild(abilitiesLi);
  }
  //description
  const info = await getData(data.species.url);
  console.log(info)
  const description = document.createElement("p");
  description.innerHTML = info.flavor_text_entries[0].flavor_text
  mrBodyDetails.appendChild(description);


  
  
  mrBody.appendChild(mrBodyDetails);
  rightDiv.appendChild(mrBody);
  // mrBottom
  const mrBottom = document.createElement("div");
  mrBottom.setAttribute('class', 'mrBottom');
  // add to my team!
  const button = document.createElement("a");
  button.setAttribute("class", "addTeam");
  button.setAttribute("href", "algunOtroView");
  const content = document.createElement("p");
  content.innerHTML = "Add to my Team!";
  button.appendChild(content);
  mrBottom.appendChild(button);
  rightDiv.appendChild(mrBottom);



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


