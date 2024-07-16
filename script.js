document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/food')
    .then(res => res.json())
    .then(data =>print(data[0]))


    const recipes = document.querySelector('#recipes')
    const menu = document.querySelector('#recipe-menu')
    const container = document.querySelector('.list-container')

    fetch('http://localhost:3000/food')
    .then(res => res.json())
    .then(data => {
        data.forEach(recipe => printList(recipe))
        container.style.display = 'none'
    })

    function printList(obj){
        const li = document.createElement('li')
        li.classList.add('recipe-list')
        li.innerText = `${obj.name}`
        recipes.appendChild(li)
        li.addEventListener('click', () => {
            fetch (`http://localhost:3000/food/${obj.id}`)
            .then(res => res.json())
            .then(data => print(data))
        })
     }

    menu.addEventListener('click', () => {
        container.style.display = (container.style.display === 'none') ? 'block' : 'none'
    })

    function print (obj){
        const div2 = document.querySelector('.recipe-container')
        const ingredientsList = obj.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')
        div2.innerHTML = `
        <div class = "relative">
        <img src = "${obj.image}" class = 'image1'>
        <div class="button-container">
                <button class="update-button">Update</button>
                <button class="delete-button">Delete</button>
        </div>
        </div>
        <h2>${obj.name}</h2>
        <p>Ingredients: <ul>${ingredientsList}</ul></p>
        <p class ="instructions">Instructions: ${obj.instructions}</p>
        `
        const del = document.querySelector('.delete-button')
        del.addEventListener('click', () => {
            deleteRecipe(obj.id)
        })
    }

    const form = document.querySelector('.add-recipe')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const name = form.querySelector('input[name="name"]').value
        const image = form.querySelector('input[name="image"]').value
        const instruction = form.querySelector('input[name="instruction"]').value
        const ingredients = form.querySelector('input[name="ingredients"]').value.split('  ').map(ingredient => ingredient.trim())

        fetch("http://localhost:3000/food", {
            method:'POST',
            headers:
            {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify({
                name: name,
                instruction: instruction,
                image: image,
                ingredients: ingredients
              })
        })
        .then(res => res.json())
        .then(data => print(data))
        .catch(error => console.error('Error:', error))
        form.reset()
    })
  
    function deleteRecipe(id) {
        const div2 = document.querySelector('.recipe-container')
        const adminPassword = prompt("Enter admin password:");
        
        if (adminPassword === "password") {
            div2.remove()
            fetch(`http://localhost:3000/food/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                }
            })
            .then(res => res.json())
            .then(data => print(data[0]))}
            else {
                alert ('Incorrect Password')
            }
        }
    const insertion = document.querySelector('.inputer')
    insertion.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase().trim()

        fetch('http://localhost:3000/food')
        .then(res => res.json())
        .then(data => data.forEach(recipe => {
            if (recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm))) {
                printList(recipe);
            }
        }))
    })       
    }
)
