let $moreInfoPage = $(".product-info");
let $checkoutWrapper = $('.checkout-wrapper');
let $productWrapper = $('.product-wrapper');

const initializePage = () => {

    let $checkoutBtn = $("#checkoutBtn");
    let $productBtn = $("#productBtn");
    let $submitBtn = $("#square-button"); //submit form-button


//Switches between "product view" and "checkout view"
    $checkoutWrapper.hide();
    $moreInfoPage.hide();

    $productBtn.click(() => {
        $checkoutWrapper.hide();
        $productWrapper.show();
        $moreInfoPage.hide();
    });

    $checkoutBtn.click(() => {
        $productWrapper.hide();
        $checkoutWrapper.show();
        $moreInfoPage.hide();
        checkoutFunctions.renderCheckout();
    });


//Submit form btn
    $submitBtn.click(e => {
        e.preventDefault();
        formFunctions.validateForm();
    });
};


const appState = {
    cart: {
        cart_rows: [],
    },
    productCatalogue: [
        {
            productName: "Kettle bell",
            price: 2,
            description: "Lift it",
            image: "https://images-na.ssl-images-amazon.com/images/I/71LERlrOJ7L._SY355_.jpg",
            button: "Add To Cart",
            id: "id1"
        },
        {
            productName: "Running Shoe",
            price: 2,
            description: "Run faster",
            image: "https://c.static-nike.com/a/images/t_default/l0wccd0un22ifwhpriph/free-rn-flyknit-2017-big-kids-running-shoe-9LWVx3.jpg",
            button: "Add To Cart",
            id: "id2"
        },
        {
            productName: "Football",
            price: 2,
            description: "Kick it",
            image: "https://images-na.ssl-images-amazon.com/images/I/61F-Epj6A9L._SX355_.jpg",
            button: "Add To Cart",
            id: "id3"
        }
    ],
    reviews: [
        {
            name: "Kalle",
            rating: "5",
            comment: "Great! Kick it, you'll love it",
            productId: "id3",
        },
        {
            name: "Knut",
            rating: "5",
            comment: "Greatest! You can really lift it an infinite number of times without a problem",
            productId: "id1",
        },
        {
            name: "Pelle",
            rating: "1",
            comment: "Bad! It's heavy and it smells like sweat",
            productId: "id1",
        },
        {
            name: "John",
            rating: "5",
            comment: "Nice color!",
            productId: "id1",
        },
        {
            name: "Tim",
            rating: "5",
            comment: "Great! Makes you run faster than ever",
            productId: "id2",
        },
        {
            name: "Coco",
            rating: "1",
            comment: "Too small size",
            productId: "id2",
        },
        {
            name: "Nic",
            rating: "3",
            comment: "The football is round, anything can happen",
            productId: "id3",
        },
        {
            name: "Voltaire",
            rating: "5",
            comment: "Great colors!",
            productId: "id3",
        },
    ]
};

const productPage = {
    render: () => {
        let $productWrapper = $(".product-wrapper");

        appState.productCatalogue.map((product) => {
            $productWrapper.append(
                `<div class="product"> 
                <h2>${product.productName}</h2>
                <p>Price: ${product.price} kr</p>
                <img src=${product.image}>
                <p>${product.description}</p>
                <button id="addBtn-${product.id}">${product.button}</button>
                <button id="moreInfoBtn-${product.id}">More Info</button>
            </div> 
            `);

            $(`#addBtn-${product.id}`).click(() => {
                cartFunctions.addProduct(product.id);
                cartFunctions.updateCounter();
            });

            $(`#moreInfoBtn-${product.id}`).click(() => productPage.renderInfoPage(product.id));
        });
    },


    renderInfoPage: (productId) => {

        const product = appState.productCatalogue.find((e) => e.id === productId);
        const infoRow = $("<div class='productInfo-box'>"); //this is parent-div
        $productWrapper.hide();
        $checkoutWrapper.hide();
        $moreInfoPage.empty();

        infoRow.append(`
            
            <h2>${product.productName}</h2>
            <img src=${product.image}>
            <p>Description: ${product.description}</p>
            <p>Price: ${product.price} kr</p>
            <button id="addMoreBtn-${product.id}"> Add to Cart </button>
            <br>
            <h2>Let us know what you think, write a review:</h2>
            <label>Your name: </label>
            <input type="text" name="nameField">
            <label>Rating (1-5): </label>
            <select id="rating">
              <option value="1"> 1 </option>
              <option value="2"> 2 </option>
              <option value="3"> 3 </option>
              <option value="4"> 4 </option>
              <option value="5"> 5 </option>
            </select>
            
            <label>Comment: </label>
            <input type="text" name="reviewField">
            <button id="submitReview">Send Review</button>
            
            `);


        $moreInfoPage.append(infoRow);
        $moreInfoPage.append($('<div class="review-wrapper">'));
        $moreInfoPage.show();

        productPage.renderReviews(product.id);


        $(`#addMoreBtn-${product.id}`).click(() => {
            cartFunctions.addProduct(product.id);
            cartFunctions.updateCounter()
        });

        $(`#submitReview`).click(() => productPage.addReview(product.id));


    },
    renderReviews: (productId) => {
        let reviewWrapper = $('.review-wrapper');
        reviewWrapper.empty();
        const indexOfReview = appState.reviews.filter((e) => (e.productId === productId));
        indexOfReview.map((element) => {

            console.log(element.name);
            reviewWrapper.append(`
                
                <div>
                <p>Review from: ${element.name}</p>
                <p>Rating: ${element.rating} stars</p>
                <p>Comment: ${element.comment}</p>
                </div>
                `)
        });
    },


    addReview: (productId) => {

        appState.reviews.push({
            name: $('input[name=nameField]').val(),
            rating: $('#rating').val(),
            comment: $('input[name=reviewField]').val(),
            productId: productId,
        });
        productPage.renderReviews(productId);

        $('input[name=nameField]').val(""),
        $('input[name=ratingField]').val(""),
        $('input[name=reviewField]').val("")
    }
};


const formFunctions = {
    setErrStatus: (inputField, errMsg) => {
        $(`#${inputField}_err`).html(errMsg); //sets error-msg
        $(`input[name=${inputField}]`).addClass("errorBorder"); //sets the border red
    },
    removeErrStatus: inputField => {
        $(`#${inputField}_err`).empty(); //removes the error-msg
        $(`input[name=${inputField}]`).removeClass("errorBorder"); //removes the red border
    },
    getValue: inputField => $(`input[name=${inputField}]`).val(),
    validateForm: () => {
        const allFieldNames = Object.keys(form); //all keys of the form-object is now in "allFieldNames"
        allFieldNames.map((field) => {

            const isValid = form[field].validate(formFunctions.getValue(field)); //validates one at a time, each form-input
            if (isValid) {
                formFunctions.removeErrStatus(field)
            } else {
                formFunctions.setErrStatus(field, form[field].errorMsg)
            }
        })
    },
};

//Validation form-inputs
const form = {
    "fName": {
        validate: (inputValue) => inputValue !== "",
        errorMsg: "Enter first name"
    },
    "lName": {
        validate: (inputValue) => inputValue !== "",
        errorMsg: "Enter last name"
    },
    "email": {
        validate: (inputValue) => inputValue.includes("@") || inputValue.length > 4,
        errorMsg: "Enter valid email"
    },
    "street": {
        validate: (inputValue) => inputValue !== "",
        errorMsg: "Enter street"
    },
    "zipCode": {
        validate: (inputValue) => inputValue !== "",
        errorMsg: "Enter zip code"
    },
    "city": {
        validate: (inputValue) => inputValue !== "",
        errorMsg: "Enter city"
    },
};
//end form validation

const checkoutFunctions = {
    renderCheckout: () => {

        let totalAmount = 0;
        const theCheckoutContainerElement = $('#checkoutCart');
        theCheckoutContainerElement.empty();
        appState.cart.cart_rows.map((row) => {
            const product = appState.productCatalogue.find((e) => e.id === row.productId);
            const htmlRow = $("<div class='checkout-row'>"); //this is parent-div
            let rowSum = (product.price * row.count);
            totalAmount += rowSum; //adds up every rowSum into totalAmount


            htmlRow.append(`
            
            <p>Product: ${product.productName}</p>
            <div id="cartItems"><p>Nr of this product: ${row.count}</p>
            <button id="plusOneBtn${product.id}"> + </button>
            <button id="minusOneBtn${product.id}"> - </button></div>
            <p>Price per product: ${product.price} kr</p>
            <p>This row total: ${rowSum} kr</p>
            <button id="deleteBtn${product.id}"> X </button>
            `);


            theCheckoutContainerElement.append(htmlRow); //makes current html-element a child of checkoutCart

            $(`#plusOneBtn${product.id}`).click(() => cartFunctions.increaseAmount(product.id));
            $(`#minusOneBtn${product.id}`).click(() => cartFunctions.decreaseAmount(product.id));
            $(`#deleteBtn${product.id}`).click(() => cartFunctions.eliminatingThisRow(product.id));

        });


        theCheckoutContainerElement.append(
            `
            <h2>Total amount: ${totalAmount} kr</h2>
      `);

    },

};

const cartFunctions = {
    addProduct: (productId) => { //which productId depends on which button you clicked
        const indexOfCartRow = appState.cart.cart_rows.findIndex((e) => (e.productId === productId));
        if (indexOfCartRow === -1) { //if the productId you clicked does not exist in cart, a new row is added
            appState.cart.cart_rows.push({productId: productId, count: 1}) //with cart_rows.count set to 1
        } else {
            appState.cart.cart_rows[indexOfCartRow].count++;// else, increase cart_rows.count by 1 on the found element
        }
    },
    getCount: () => { //adds up total number of all cart_rows.count
        return appState.cart.cart_rows.reduce((acc, row) => acc + row.count, 0);
    },
    updateCounter: () => { //sends total of cart_rows.count to the "cart icon-counter"
        $("#itemsCounter").text(cartFunctions.getCount().toString());
    },
    increaseAmount: function (productId) {
        appState.cart.cart_rows.map((element) => {
            if (productId === element.productId) {
                element.count++;
            }
        });
        cartFunctions.updateCounter();
        checkoutFunctions.renderCheckout();
    },

    decreaseAmount: function (productId) {
        appState.cart.cart_rows.map((element) => {
            if (productId === element.productId) {
                element.count--;
                if (element.count < 0) {
                    cartFunctions.eliminatingThisRow(productId);
                }
            }
        });
        cartFunctions.updateCounter();
        checkoutFunctions.renderCheckout();
    },
    eliminatingThisRow: (productId) => {
        appState.cart.cart_rows.map((element, i) => {
            if (productId === element.productId) {
                appState.cart.cart_rows.splice(i, 1);
            }
        });
        cartFunctions.updateCounter();
        checkoutFunctions.renderCheckout();
    },
};

// Start Page
initializePage();
productPage.render();


