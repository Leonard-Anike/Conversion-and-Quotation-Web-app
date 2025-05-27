// This script takes inputs froms the input fields and renders them on a table as quotation
// It renders the total quantity and total price of the quotation 
// It equally stores the input on a local storage and seesion storage


// Variable declaration
const clientInputName = document.getElementById("client-input-name")
const textArea = document.getElementById("textarea") 
const materialQuantity = document.getElementById("material-quantity") 
const unitPrice = document.getElementById("unit-price") 
const sendBtn = document.getElementById("send-quotation")
const quotationContainer = document.getElementById("quotation-container")
let hasSaved = false
let quotationHtml = "" 
let quotationArray = []

// Eventlisteners
document.addEventListener("click", function(e){
    if (e.target.dataset.delete !== undefined) {
        const index = parseInt(e.target.dataset.delete)
        if (!isNaN(index)){
        deleteRow(index)
        }
    } 

    if (e.target.id === "save-quotation") {
        saveQuotation()
    }
    if (e.target.id === "delete-quotation") {
        deleteQuotation()
    }
})

// For scrolling of the quotation table
quotationContainer.insertAdjacentHTML ("afterbegin", quotationHtml)
quotationContainer.scrollTop = quotationContainer.scrollHeight

// For flexibility of the textarea to enhance the UI
const minHeight = textArea.offsetHeight
textArea.addEventListener("input", () => {
    const newHeight = Math.min(textArea.scrollHeight, 50)
    textArea.style.height = Math.max(newHeight,minHeight) + "px"
})


// Function for adding items to the quotationArray if the item doesn't exist
function addItem() {
    const clientName = clientInputName.value.trim()
    const materialName = textArea.value.trim()
    const qty = parseFloat(materialQuantity.value)
    const price = parseFloat(unitPrice.value)

    if (clientName && materialName && !isNaN(qty) && !isNaN(price)) {
        quotationArray.push ({
            clientName : clientName,
            materialName: materialName,
            qty: qty,
            unitPrice: price,
            unitTotalPrice: qty * price
        })
        renderQuotation()
    }
}

// Function that adds the inputs on their respective columns on the table element
// It equally gets the summary - both for total quantity and price
function getQuotation() {
    let totalQuantity = 0
    let totalPrice = 0

    quotationArray.map((item) =>{
        quotationHtml = ` <div class="quotation-area">
            <div>
                <p id="client-name"> ${item.clientName} </p>
            </div>`
    }).join('')
    quotationHtml += `
        <div class="table-container">
            <table id="table">
                <thead>
                    <tr>
                        <th> S/N </th>
                        <th> Name of <span> Material </span> </th>
                        <th> Qty </th>
                        <th> Unit <span> Price(#) </span> </th>
                        <th> Total <span> Price(#) </span> </th>
                        <th id="delete-column"> Del </th>
                    </tr>
                </thead>
                <tbody>
    `
    quotationArray.forEach((item, index) =>{
        const {qty, unitTotalPrice} = item
        totalQuantity += qty
        totalPrice += unitTotalPrice
        quotationHtml += `
            <tr> 
                <td> ${index + 1} </td>
                <td> ${item.materialName} </td>
                <td> ${item.qty} </td>
                <td> ${item.unitPrice} </td>
                <td> ${item.unitTotalPrice} </td>
                <td><button data-delete=${index} class="delete-btn"> X </button></td>
            </tr>
        `
    })
    quotationHtml += `</tbody> </table> </div>`
    quotationHtml += `
            <div class="summary">
                <button id="save-quotation"> Save quotation</button>
                <button id="delete-quotation"> Delete quotation </button>
                <h4> Summary </h4> 
                <p class="total-el"> Total Quantity: <span class="total"> ${totalQuantity} <span> </p> 
                <p class="total-el"> Total Price: <span class="total"> #${totalPrice} <span> </p>
                <div id="contact"> 
                    <p> Contractor: Engr. Michael </p>
                    <div> <i class="fa-solid fa-phone"></i> +2349095584834 <span> <i class="fa-brands fa-whatsapp"></i> +2349095584834 </span></div>
                </div>
            </div>
        </div>
    `
    if (quotationArray.length === 0) {
        return ""
    }
    return quotationHtml
}

// Eventlistener that updates the table each time new row is to the added
sendBtn.addEventListener("click", addItem)

// Function that deletes the row if not needed
function deleteRow(index) {
    if (!confirm("Are you sure you want to delete this item?")) return
    quotationArray.splice(index, 1)
    renderQuotation()
}

// This takes the inputs value and saves them in the session sessionStorage
document.querySelectorAll("input, textarea").forEach (input => {
    input.addEventListener("input", () => {
        sessionStorage.setItem(input.name || input.id, input.value)
    })
})

// This gets the items saved in the session storage and displays them as long as the session has not been closed or ended 
window.addEventListener ("load", function() {
    const savedArray = sessionStorage.getItem("quotationArray")
    if (savedArray){
        quotationArray = JSON.parse(savedArray)
        renderQuotation()
    }

    document.querySelectorAll("input, textarea").forEach (input => {
        const key = input.name || input.id
        const savedValue = sessionStorage.getItem(key)
        if (savedValue !== null) {
            input.value = savedValue
        }
    })
})

// The function that saves the quotation made to localStorage
// It deletes the Delete column and row as well as DeleteBtn on the quotation before saving
function saveQuotation() {
    if (hasSaved) {
        alert("You've already saved this quotation!")
        return
    }

    const createdQuotation = document.getElementById("quotation-container")
    const newQuotationCloned = createdQuotation.cloneNode(true)

    const deleteColumn = newQuotationCloned.querySelector("#delete-column")
    const column = deleteColumn.closest ("th")
    if (column) column.remove()

    const deleteRow = newQuotationCloned.querySelectorAll(".delete-btn")
    deleteRow.forEach(btn => {
        const row = btn.closest ("td")
        if (row) row.remove()

    const deleteQuotationBtn = newQuotationCloned.querySelector("#delete-quotation")
    if (deleteQuotationBtn) deleteQuotationBtn.remove()

    const deleteSaveBtn = newQuotationCloned.querySelector("#save-quotation")
    if (deleteSaveBtn) deleteSaveBtn.remove()
    })

    const newQuotation = newQuotationCloned.innerHTML

    const existingQuotation = JSON.parse(localStorage.getItem("savedQuotationList")) || []
    
    existingQuotation.push({
        id: Date.now(),
        quotation: newQuotation,
        savedAt: Date.now()
    })
        localStorage.setItem("savedQuotationList", JSON.stringify(existingQuotation))
        hasSaved = true
        alert("Quotation saved!")
}

// Function that deletes the entire quotation, clear the Dom, quotationArray and the input fields
function deleteQuotation() {
    if (!confirm("Are you sure you want to delete this quotation?")) return
    quotationArray = []
    quotationHtml = ""
    quotationContainer.innerHTML = quotationHtml
    sessionStorage.clear()
    clientInputName.value = ""
    materialQuantity.value = ""
    unitPrice.value = ""
    textArea.value = ""
    renderQuotation()
}

// Function the renders the quotation to the Dom
function renderQuotation() {
    quotationContainer.innerHTML = getQuotation()
    sessionStorage.setItem("currentQuotation", getQuotation())
    sessionStorage.setItem("quotationArray", JSON.stringify(quotationArray))
}