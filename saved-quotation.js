// This scripts displays the quotation saved to the localstorage
// It offers delete function two for deleting the save quotation

// Function that displays quotation saved
function displayQuotation() {
    let savedQuotation = JSON.parse(localStorage.getItem("savedQuotationList")) || []

    if (savedQuotation.length === 0) {
        document.querySelector(".view-mode").innerHTML = "<p> No quotation found. </p>"
        return   
    }

    // This ensures that the last saved is displayed first
    savedQuotation.sort((a, b) => b.savedAt - a.savedAt)

    document.querySelector(".view-mode").innerHTML = savedQuotation.map( item => {
        const date = new
        Date(item.savedAt).toLocaleString()
        return `
            <div class="saved-quotation">
                <button id="delete-quotation-btn" onclick="deleteQuotation(${item.id})"> Delete </button>
                <div> ${item.quotation} </div>
                <p id="date"><strong> Saved on: </strong> ${date} </p>
            </div>
        `
    }).join("")
}

// This funtion deletes the quotation saved to the localStorage
function deleteQuotation(id) {
    if(confirm("Are you sure you want to delete this quotation?")) {
        let savedQuotation = JSON.parse(localStorage.getItem("savedQuotationList")) || []
        const updatedSavedQuotation = savedQuotation.filter(item => item.id !== id)
        localStorage.setItem("savedQuotationList", JSON.stringify(updatedSavedQuotation))
        displayQuotation()
    }
}