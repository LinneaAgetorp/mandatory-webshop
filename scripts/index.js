// Get products from database:
fetch('https://demo.edument.se/api/products')
    .then(response => response.json())
    .then(products => {
        appState.productCatalogue = products;
        productPage.render();
    })
    .catch(err => console.log(err));

// Get reviews from database:
fetch('https://demo.edument.se/api/reviews')
    .then(response => response.json())
    .then(reviews => {
        appState.Reviews = reviews;
    })
    .catch(err => console.log(err));


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
    $submitBtn.click((e) => {
        e.preventDefault();
        formFunctions.validateForm();
        checkoutFunctions.createOrder();
    });
};

//this is where shopping cart, products and reviews are "saved"
const appState = {
    cart: {
        cart_rows: [],
    },
    productCatalogue: [],
    Reviews: []
};

const productPage = {
    render: () => {

        let $productWrapper = $(".product-wrapper");

        appState.productCatalogue.map((product) => {
            $productWrapper.append(
                `<div class="product"> 
                <h2>${product.Name}</h2>
                <p>Price: ${product.Price} kr</p>
                <img src=${product.Image}>
                <p>${product.Description}</p>
                <button id="addBtn-${product.Id}">Add to Cart</button>
                <button id="moreInfoBtn-${product.Id}">More Info</button>
            </div> 
            `);

            $(`#addBtn-${product.Id}`).click(() => {
                cartFunctions.addProduct(product.Id);
                cartFunctions.updateCounter();
            });

            $(`#moreInfoBtn-${product.Id}`).click(() => productPage.renderInfoPage(product.Id));
        });
    },


    renderInfoPage: (productId) => {
        const product = appState.productCatalogue.find((e) => e.Id === productId);
        const infoRow = $("<div class='productInfo-box'>"); //this is parent-div
        $productWrapper.hide();
        $checkoutWrapper.hide();
        $moreInfoPage.empty();

        infoRow.append(`
            
            <h2>${product.Name}</h2>
            <img src=${product.Image}>
            <p>Description: ${product.Description}</p>
            <p>Price: ${product.Price} kr</p>
            <button id="addMoreBtn-${product.Id}"> Add to Cart </button>
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

        productPage.renderReviews(product.Id);


        $(`#addMoreBtn-${product.Id}`).click(() => {
            cartFunctions.addProduct(product.Id);
            cartFunctions.updateCounter()
        });

        $(`#submitReview`).click(() => productPage.addReview(product.Id));


    },
    renderReviews: (productId) => {
        let reviewWrapper = $('.review-wrapper');
        reviewWrapper.empty();
        const reviews = appState.Reviews.filter(review => (review.ProductID === productId));

        reviews.map((review) => {

            reviewWrapper.append(`
            
            <div>
            <p>Review from: ${review.Name}</p>
            <p>Rating: ${review.Rating} stars</p>
            <p>Comment: ${review.Comment}</p>
            </div>
            `)

        })

    },

    postReview: (review) => {
        return fetch('https://demo.edument.se/api/reviews',
            {
                method: 'POST',
                body: JSON.stringify(review),
                headers: new Headers({'Content-Type': 'application/json'})
            });
    },


    addReview: (productId) => {
        const newReview = {
            ProductID: productId,
            Name: $('input[name=nameField]').val(),
            Comment: $('input[name=reviewField]').val(),
            Rating: parseInt($('#rating').val()),
        };

        $('input[name=nameField]').val("");
        $('input[name=ratingField]').val("");
        $('input[name=reviewField]').val("");

        productPage.postReview(newReview);
        appState.Reviews.push(newReview); //this is to make the new review
        productPage.renderReviews(productId);//appear directly to the page, without reloading

    },

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
            const product = appState.productCatalogue.find((e) => e.Id === row.productId);
            const htmlRow = $("<div class='checkout-row'>"); //this is parent-div
            let rowSum = (product.Price * row.count);
            totalAmount += rowSum; //adds up every rowSum into totalAmount


            htmlRow.append(`
            
            <p>Product: ${product.Name}</p>
            <div id="cartItems"><p>Nr of this product: ${row.count}</p>
            <button id="plusOneBtn${product.Id}"> + </button>
            <button id="minusOneBtn${product.Id}"> - </button></div>
            <p>Price per product: ${product.Price} kr</p>
            <p>This row total: ${rowSum} kr</p>
            <button id="deleteBtn${product.Id}"> X </button>
            `);


            theCheckoutContainerElement.append(htmlRow); //makes current html-element a child of checkoutCart

            $(`#plusOneBtn${product.Id}`).click(() => cartFunctions.increaseAmount(product.Id));
            $(`#minusOneBtn${product.Id}`).click(() => cartFunctions.decreaseAmount(product.Id));
            $(`#deleteBtn${product.Id}`).click(() => cartFunctions.eliminatingThisRow(product.Id));

        });

        theCheckoutContainerElement.append(
            `
            <h2>Total amount: ${totalAmount} kr</h2>
      `);

    },
    submitOrder: (order) => {
        return fetch('https://demo.edument.se/api/orders',
            {
                method: 'POST',
                body: JSON.stringify(order),
                headers: new Headers({'Content-Type': 'application/json'})
            });

    },

    createOrder: () => {
        const products = appState.cart.cart_rows.map((row) =>
            appState.productCatalogue.find((product) => row.productId === product.Id)
        );
        const newOrder = {
            FirstName: $('input[name=fName]').val(),
            LastName: $('input[name=lName]').val(),
            Email: $('input[name=email]').val(),
            Phone: $('input[name=phoneNr]').val(),
            StreetAddress: $('input[name=street]').val(),
            ZipCode: $('input[name=zipCode]').val(),
            City: $('input[name=city]').val(),
            Comment: $('input[name=comment]').val(),
            OrderItems: products
        };

        console.log(newOrder);


        checkoutFunctions
            .submitOrder(newOrder)
            .then(response => {
                console.log(response);
                alert('Success! You have placed your order! ', JSON.stringify(newOrder, null, 2));

                const theCheckoutContainerElement = $('#checkoutCart');
                theCheckoutContainerElement.empty();
                //empty shopping cart
                appState.cart.cart_rows = [];
                cartFunctions.updateCounter();
            });

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

//productPage.render(products);


