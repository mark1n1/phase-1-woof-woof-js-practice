document.addEventListener('DOMContentLoaded', () => {
  const URL = "http://localhost:3000/pups";
  const goodDogsButton = document.getElementById('good-dog-filter');
  let filterGoodDogs = false;

  goodDogsButton.addEventListener('click', () => {
    filterGoodDogs = !filterGoodDogs;
    goodDogsButton.innerText = filterGoodDogs ? "Filter good dogs: ON" : 
                                                  "Filter good dogs: OFF";
    fetch(URL).then((response) => response.json())
      .then((dogsObject) => {
        const goodDogs = dogsObject.filter((dogObject) => dogObject.isGoodDog === true);
        const div = document.getElementById('dog-bar');

        if(filterGoodDogs) {
          while(div.firstChild) {
            div.firstChild.remove();
          }
          addDogsToDOM(goodDogs);
        } else {
          while(div.firstChild) {
            div.firstChild.remove();
          }
          addDogsToDOM(dogsObject);
        }
      });
  });

  fetch(URL).then((response) => response.json())
    .then((dogsObject) => {
      addDogsToDOM(dogsObject);
    });

  function renderDog(id) {
    const div = document.getElementById('dog-info');
  
    while(div.firstChild) {
      div.firstChild.remove();
    }

    fetch(URL + `/${id}`).then((response) => response.json())
      .then((dogObject) => {
        const img = document.createElement("img");
        const name = document.createElement("h2");
        const button = document.createElement("button");

        img.src = dogObject.image;
        name.innerText = dogObject.name;
        button.innerText = dogObject.isGoodDog ? "Bad Dog!" : "Good Dog!";

        button.addEventListener("click", (event) => {
          let isGoodDog = dogObject.isGoodDog;
          updateDog(id, isGoodDog);
          // button.innerText = isGoodDog ? "Good Dog!" : "Bad Dog!";
        });
        
        div.append(img, name, button);
      });
  }

  function updateDog(id, isGoodDog) {
    // console.log(isGoodDog);
    const configObject = {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        Accept : "application/json"
      },
      body: JSON.stringify({
        isGoodDog: !isGoodDog
      })
    }

    fetch(URL + `/${id}`, configObject).then((response) => response.json())
      .then((dogObject) => renderDog(dogObject.id));
  }

  function addDogsToDOM(dogsObject) {
    const div = document.getElementById('dog-bar');

    dogsObject.map((dog) => {
      const span = document.createElement('span');

      span.innerText = dog.name;

      span.addEventListener('click', () => {
        renderDog(dog.id);
      });

      div.append(span);
    });
  }
});