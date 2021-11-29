
//Data
let modalQt = 1; 
let cart = [];
let modalKey = 0;

//Events
pizzaJson.map((item, index)=>{
    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);
    //Pizza Molde Data
    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
    //Open Modal
    pizzaItem.querySelector('a').addEventListener('click', openModal)

    document.querySelector('.pizza-area').append(pizzaItem);
});

document.querySelectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach(item=>{
    item.addEventListener('click', closeModal);
});

document.querySelector('.pizzaInfo--qtmenos').addEventListener('click', modalQtRemove)
document.querySelector('.pizzaInfo--qtmais').addEventListener('click', modalQtAdd)

document.querySelectorAll('.pizzaInfo--size').forEach((size,sizeIndex)=>{
    size.addEventListener('click', e=>{
        document.querySelector('.pizzaInfo--size.selected').classList.remove('selected')
        size .classList.add('selected')
    })
});

document.querySelector('.pizzaInfo--addButton').addEventListener('click', updateCartArray)

document.querySelector('.menu-openner').addEventListener('click', openMobileCart)
document.querySelector('.menu-closer').addEventListener('click', closeMobileCart)

//functions
function openModal(event){
    event.preventDefault();
    const target = event.target.closest('.pizza-item').getAttribute('data-key');
    modalQt = 1;

    const pizzaModalArea = document.querySelector('.pizzaWindowArea');
    pizzaModalArea.style.opacity = 0;
    pizzaModalArea.style.display = 'flex';
    setTimeout(()=>pizzaModalArea.style.opacity = 1 , 100);

    updateModal(target);
};

function closeModal(){
    const pizzaModalArea = document.querySelector('.pizzaWindowArea');
    pizzaModalArea.style.opacity = 0;
    setTimeout(()=>pizzaModalArea.style.display = 'none', 500)
}

function updateModal(key){
    modalKey = key

    document.querySelector('.pizzaBig img').src = pizzaJson[key].img
    document.querySelector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    document.querySelector('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    document.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2)}`;
 
    updateModalQt()

    document.querySelector('.pizzaInfo--size.selected').classList.remove('selected');
    document.querySelectorAll('.pizzaInfo--size').forEach((size,sizeIndex)=>{
        if(sizeIndex == 2){
            size.classList.add('selected');
        }
        size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    });
}

function modalQtRemove(){
    if(modalQt > 1){
        modalQt--
        updateModalQt()
        updateModalPrice()
    } else {
        closeModal()
    }
}

function modalQtAdd(){
    modalQt++;
    updateModalQt()
    updateModalPrice()
}

function updateModalQt(){
    document.querySelector('.pizzaInfo--qt').innerHTML = modalQt;
}

function updateModalPrice(){
    const atualPrice = modalQt * pizzaJson[modalKey].price
    document.querySelector('.pizzaInfo--actualPrice').innerHTML = `R$ ${atualPrice.toFixed(2)}`;
}

function updateCartArray(){
    const pizzaSize = parseInt(document.querySelector('.pizzaInfo--size.selected').getAttribute('data-key'));
    const identifier = pizzaJson[modalKey].id +'@'+pizzaSize;
    const key = cart.findIndex(item => item.identifier == identifier)

    if(key > -1){
        cart[key].amount += modalQt;
    } else {
        cart.push({
            identifier,
            id:pizzaJson[modalKey].id,
            size: pizzaSize,
            amount: modalQt
        });
    }
    updateCart();
    closeModal();
}

function updateCart(){
    document.querySelector('.cart').innerHTML = '';
    document.querySelector('.menu-openner span').innerHTML = cart.length;
    if(cart.length > 0){
        document.querySelector('aside').classList.add('show');
        updateCartInfo()
    } else {
        document.querySelector('aside').classList.remove('show');
        document.querySelector('aside').style.left = '100vw';
    }
    
}

function updateCartInfo() {
    let subtotal = 0;
    for(let i in cart){
        const pizzaData = pizzaJson.find(item => item.id == cart[i].id);
        subtotal += pizzaData.price * cart[i].amount;

        const cartItem = document.querySelector('.models .cart--item').cloneNode(true);

        let pizzaSizeName;
        switch(cart[i].size) {
            case 0:
                pizzaSizeName = 'P';
                break;
            case 1:
                pizzaSizeName = 'M';
                break;
            case 2:
                pizzaSizeName = 'G';
                break;
        }

        cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', event =>{
           if(cart[i].amount > 1){
                cart[i].amount--;
           } else {
               cart.splice(i , 1)
           }
            updateCart()
        })
        cartItem.querySelector('.cart--item-qtmais').addEventListener('click', event => {
            cart[i].amount++;
            updateCart()
        })

        const pizzaName = `${pizzaData.name} | ${pizzaSizeName}`

        cartItem.querySelector('img').src = pizzaData.img;
        cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
        cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].amount;
        document.querySelector('.cart').append(cartItem);
    }
    updateValues(subtotal);
};

function updateValues(subtotal){
    let discount = subtotal * 0.1;
    let total = subtotal - discount;

    document.querySelector('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
    document.querySelector('.desconto span:last-child').innerHTML = `R$ ${discount.toFixed(2)}`;
    document.querySelector('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
}

function openMobileCart(){
    if(cart.length > 0){
        document.querySelector('aside').style.left = '0'
    }
}

function closeMobileCart(){
    document.querySelector('aside').style.left = '100vw'
}