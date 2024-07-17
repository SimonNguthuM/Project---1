document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/food')
    .then(res => res.json())
    .then(data =>print(data[0]))
    .catch(error => console.error('Error:', error))


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
        <div class ="buttons" style = "display: none;"></div>
        </div>
        <h2 class="head">${obj.name}</h2>
        <p><ul class = "ings">${ingredientsList}</ul></p>
        <p class ="instructions">Instructions: ${obj.instructions}</p>
        `
        const del = document.querySelector('.delete-button')
        del.addEventListener('click', () => deleteRecipe(obj.id))

        const update = document.querySelector('.update-button')
        const buttons = document.querySelector('.buttons')

        update.addEventListener('click', () => {        
            buttons.innerHTML = `
            <button class="name-button">Update Name</button>
            <button class="img-button">Update Image</button>
            <button class="ins-button">Update Instructions</button>
            <button class="ing-button">Update Ingredients</button>
            `
            toggleButtons()
        })
        function toggleButtons () {
            if (buttons.style.display === 'none') {
                buttons.style.display = 'block'
              } else {
                buttons.style.display = 'none'
              }
            }

        buttons.addEventListener('click', (event) => {
            const targetButton = event.target
            if (targetButton.classList.contains('name-button')) {
                const nameField = document.createElement('input')
                nameField.type = 'text'
                nameField.value = obj.name;
                nameField.classList.add('name-input')
                nameField.style.height = '50px'
                nameField.style.width = '200px'
                const head = document.querySelector('.head')
                head.replaceWith(nameField)
        
                nameField.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        updateRecipe({ name: nameField.value })
                    }
                })
            } 
            else if (targetButton.classList.contains('img-button')) {
                const imgField = document.createElement('input')
                imgField.type = 'text'
                imgField.value = obj.image;
                imgField.classList.add('img-input')
                imgField.style.height = '100px'
                imgField.style.width = '500px'
                const image = document.querySelector('.image1')
                image.replaceWith(imgField)
        
                imgField.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        updateRecipe({ image: imgField.value })
                    }
                })
            } 
            else if (targetButton.classList.contains('ins-button')) {
                const insField = document.createElement('textarea')
                insField.value = obj.instructions
                insField.classList.add('ins-input')
                insField.style.height = '200px'
                insField.style.width = '600px'
                const instruc = document.querySelector('.instructions')
                instruc.replaceWith(insField)
        
                insField.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        updateRecipe({ instructions: insField.value })
                    }
                })
            } 
            else if (targetButton.classList.contains('ing-button')) {
                const ingField = document.createElement('textarea')
                ingField.value = obj.ingredients.join('\n')
                ingField.classList.add('ing-input')
                ingField.style.height = '200px'
                ingField.style.width = '600px'
                const ings = document.querySelector('.ings')
                ings.replaceWith(ingField)
        
                ingField.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        const ingredients = ingField.value.split('\n').map(ingredient => ingredient.trim())
                        updateRecipe({ ingredients: ingredients })
                    }
                })
                }
            })

        function updateRecipe(updatedFields) {
            const updatedRecipe = { ...obj, ...updatedFields };
            fetch(`http://localhost:3000/food/${obj.id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify(updatedRecipe)
            })
            .then(res => res.json())
            .then(data => {
                print(data)
                toggleButtons()
                })
            .catch(error => console.error('Error:', error))
            }
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
    


    // const insertion = document.querySelector('.inputer')
    // insertion.addEventListener('input', () => {
    //     const searchTerm = searchInput.value.toLowerCase().trim()

    //     fetch('http://localhost:3000/food')
    //     .then(res => res.json())
    //     .then(data => data.forEach(recipe => {
    //         if (recipe.ingredients.some(ingredient => ingredient.toLowerCase().includes(searchTerm))) {
    //             printList(recipe);
    //         }
    //     }))
    // })       
    }
)
