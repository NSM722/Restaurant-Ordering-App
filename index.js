import { menuArray } from './data.js';
const paymentForm = document.getElementById('payment-form');
const orderDiv = document.getElementById('order-container')
const orderCompleteDiv = document.getElementById('order-complete')
const completeOrderBtn = document.getElementById('purchase-btn')

/**
 * Stores checkout menu items
 */
const orderArray = []


/**
 * Listens for clicks on the document
 */
document.addEventListener('click', function (event) {
    if (event.target.dataset.add) {
        handleAddBtnClick(event.target.dataset.add)
    }
    else if (event.target.dataset.remove) {
        handleRemoveBtnClick(event.target.dataset.remove)
    }

})

/**
 * Clears innerHTML
 */
const clearInnerHtml = element => element.innerHTML = ""

/**
 * Sets element display style to "none"
 */
const setDisplayToNone = element => element.style.display = "none"

/**
 * Deletes order item from ordered list of items
 */
function handleRemoveBtnClick(targetId) {
    let target = orderArray.findIndex(order => {
        return Number.parseInt(targetId) === order.id
    })

    // Alter the array by removing the target item
    orderArray.splice(target, 1)

    const targetElement = document.querySelector(`[data-remove="${targetId}"]`)
    const targetParentElement = targetElement.parentElement
    const targetParentSiblingElement = targetParentElement.nextElementSibling
    targetParentElement.remove(targetElement)
    targetParentSiblingElement.remove()
    if (orderArray.length > 0) {
        orderCompleteDiv.innerHTML = `
        <div class="order-complete-items">
            <div>Total price:</div>
            <div>${orderArray.length > 0 ? totalOrderPrice(orderArray) :
                0}</div>
        </div>`
    } else {
        setDisplayToNone(orderCompleteDiv)
        setDisplayToNone(completeOrderBtn)
        clearInnerHtml(orderDiv)
    }
    renderMenuItems()

}
/**
 * Calculates total order price
 */
const totalOrderPrice = (arrayOfOrders) => {
    return arrayOfOrders.reduce((total, currentOrder) => {
        return total + currentOrder.price
    }, 0)
}

/**
 * Adds clicked item to checkout list
 */
function handleAddBtnClick(itemId) {
    const orderedFood = menuArray.filter(menuItem => {
        return menuItem.id === Number.parseInt(itemId)
    })[0]

    orderArray.push(orderedFood)
    const orderHtml = orderArray.map(order => {
        return `
        <div class="checkout-item">
            <div class="row-1">
                <div class="checkout-item-name">${order.name}
                </div>
                <button class="del-btn" data-remove="${order.id}">remove</button>
            </div>
            <div class="checkout-item-price">$${order.price}</div>
        </div>`
    }).join('')
    orderDiv.innerHTML = `<h3>Your Order</h3>` + orderHtml
    orderCompleteDiv.style.display = "block"
    orderCompleteDiv.innerHTML = `<div class="order-complete-items">
                                    <div>Total price:</div>
                                    <div>${totalOrderPrice(orderArray)}</div>
                                </div>`

    completeOrderBtn.style.display = "block"
    renderMenuItems()
}

/**
 * Listens for click event on the complete order button
 */
completeOrderBtn.addEventListener('click', () => paymentForm.style.display = 'inline')

/**
 * Saving relevant customer payment details and listening
 * for submit event on the payment form/modal
 */
paymentForm.addEventListener('submit', function (e) {
    e.preventDefault()
    const data = new FormData(paymentForm)
    const dataName = data.get('name')
    setDisplayToNone(paymentForm)
    clearInnerHtml(orderDiv)
    clearInnerHtml(orderCompleteDiv)
    setDisplayToNone(completeOrderBtn)
    orderDiv.innerHTML = `
    <div class="success-msg">
        <p>Thanks,&nbsp${dataName}!&nbsp-&nbspYour order is on its way!</p>
    </div>
    `
    // Clears all the values of the form elements
    paymentForm.reset()

    setTimeout(() => {
        clearInnerHtml(orderDiv)
        setDisplayToNone(orderCompleteDiv)
        orderArray.length = 0;
    }, 3000)
})

/**
 * Renders menu items to the page
 */
function renderMenuItems() {
    let menuHtml = ``
    menuArray.forEach(function (item) {
        menuHtml += `
              <div class="item-container">
                <div class="item-image">${item.emoji}</div>
                <div>
                  <p class="item-title">${item.name}</p>
                  <p class="item-ingredients">${item.ingredients}</p>
                  <p class="item-price">$${item.price}</p>
                </div>
                <button class="add-btn" data-add="${item.id}">+</button>
              </div>
              <hr class="border-bottom">
            `
    })
    document.getElementById('menu-container').innerHTML = menuHtml;
}

renderMenuItems();




