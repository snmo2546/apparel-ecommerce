const shipmentMethod = document.getElementById('shipmentMethod')
const shipmentFee = document.getElementById('shipmentFee')
const orderTotal = document.getElementById('orderTotal')
const productTotal = document.getElementById('productTotal')

function displayShipmentFee() {
  shipmentFee.innerText = shipmentMethod.value
}

function displayOrderTotal() {
  const total = Number(productTotal.innerText) + Number(shipmentFee.innerText)
  orderTotal.innerText = total
}

shipmentMethod.addEventListener('change', () => {
  displayShipmentFee()
  displayOrderTotal()
})

displayShipmentFee()
displayOrderTotal()