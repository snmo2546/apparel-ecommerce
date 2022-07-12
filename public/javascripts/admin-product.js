const addStockRowBtn = document.getElementById('addStockRowBtn')
const stockFormRow = document.getElementById('stockFormRow')

function addStockRow() {
  let newStockRow = document.createElement('div')
  newStockRow.innerHTML = `
    <div class="col-md-4">
      <input type="text" class="form-control" name="color" id="color">
      <input type="hidden" name="stockId">
    </div>
    <div class="col-md-4">
      <select class="form-select" name="size">
        <option>請選擇尺寸</option>
        <option value="S">S</option>
        <option value="M">M</option>
        <option value="L">L</option>
        <option value="XL">XL</option>
        <option value="Free">Free</option>
      </select>
    </div>
    <div class="col-md-4">
      <input type="number" class="form-control" name="quantity" id="quantity">
    </div>
  `
  newStockRow.classList.add('row', 'mb-3')
  stockFormRow.appendChild(newStockRow)
}

addStockRowBtn.addEventListener('click', () => {
  addStockRow()
})