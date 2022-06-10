const shipmentMethod = document.getElementById('shipmentMethod')
const shipmentFee = document.getElementById('shipmentFee')
const productTotal = document.getElementById('productTotal')
const displayTotal = document.getElementById('displayTotal')
const inputTotal = document.getElementById('inputTotal')

function displayShipmentFee() {
  shipmentFee.innerText = shipmentMethod.value.split('-')[1]
}

function updateOrderTotal() {
  displayTotal.innerText = Number(productTotal.innerText) + Number(shipmentFee.innerText)
  inputTotal.value = Number(productTotal.innerText) + Number(shipmentFee.innerText)
}

shipmentMethod.addEventListener('change', () => {
  displayShipmentFee()
  updateOrderTotal()
})

displayShipmentFee()
updateOrderTotal()
