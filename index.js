import { initializeApp  } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://playground-4d068-default-rtdb.firebaseio.com/"
}
const app = initializeApp(appSettings)
const database = getDatabase(app)
const dataRef = ref(database, "shoppingList")
const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shopList = document.getElementById("shopping-list")
const boughtList = document.getElementById("bought-list")

onValue(dataRef, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
    
        clearList()

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]

            appendItem(currentItem)
        }
    } else {
        shopList.innerHTML = `<p class="empty-list">No items to buy!</p>`
        boughtList.innerHTML = ""
    }
})

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value
    if (inputValue) {
        autoCap(inputValue)
    }
})

function clearInput() {
    inputFieldEl.value = ""
}

function appendItem(x) {
    let itemID = x[0]
    let itemVal = x[1]
    let newLi = document.createElement("li")
    let span = document.createElement("span")
    let button = document.createElement("button")

    span.append(itemVal)
    button.setAttribute("class","delete-btn")
    button.setAttribute("aria-label", "delete item")
    button.append("X")
    newLi.append(span, button)    
    //newLi.innerHTML = `<span>${itemVal}</span><button class="delete-btn" aria-label="delete item">X</button>`

    
    span.addEventListener("click", function() {
        let parentID = newLi.parentNode.id
        if (parentID === "shopping-list") {
            boughtList.append(newLi)
        } else if (parentID === "bought-list") {
            shopList.append(newLi)
        }
    })

    button.addEventListener("click", function() {
        let itemLocation = ref(database, `shoppingList/${itemID}`)
        remove(itemLocation)
    })

    shopList.append(newLi)
}

function clearList() {
    shopList.innerHTML = ""
}

function autoCap(x) {
    let valueArr = x.split(" ")

    for (let i = 0; i < valueArr.length; i++) {
        let value = valueArr[i]
        let firstLetter = value[0].toUpperCase()
        let remainder = value.slice(1).toLowerCase()
        valueArr[i] = firstLetter + remainder
    }
    let newValue = valueArr.join(" ")
    push(dataRef, newValue)
    clearInput()

    console.log(`${newValue} added to database`)
}