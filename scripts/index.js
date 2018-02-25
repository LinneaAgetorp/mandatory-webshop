const initializePage = () => {
    let checkoutWrapper = document.querySelector(".checkout-wrapper");
    let productWrapper = document.querySelector(".product-wrapper");
    let checkoutBtn = document.getElementById("checkoutBtn");
    let productBtn = document.getElementById("productBtn");
    let submitBtn = document.getElementById("square-button"); //submit form-button

//Switches between "product view" and "checkout view"
    checkoutWrapper.style.display = "none";

    productBtn.addEventListener("click", function () {
        checkoutWrapper.style.display = "none";
        productWrapper.style.display = "flex";
    });

    checkoutBtn.addEventListener("click", function () {
        productWrapper.style.display = "none";
        checkoutWrapper.style.display = "block";
        checkoutFunctions.renderCheckout();

    });
//Submit form btn
    submitBtn.addEventListener("click", function (e) {
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
};

const productPage = {
    render: () => {
        let productWrapper = document.querySelector(".product-wrapper");

        appState.productCatalogue.map((product) => {
            const productElement = document.createElement("div");
            productWrapper.appendChild(productElement);
            productElement.className = "product";

            const title = document.createElement("h2");
            title.innerHTML = product.productName;
            productElement.appendChild(title);

            const productPrice = document.createElement("p");
            productPrice.innerHTML = `Price: ${product.price} SEK`;
            productElement.appendChild(productPrice);

            const productImage = document.createElement("img");
            productImage.src = product.image;
            productElement.appendChild(productImage);

            const productDescription = document.createElement("p");
            productDescription.innerHTML = product.description;
            productElement.appendChild(productDescription);

            const addBtn = document.createElement("button");
            addBtn.innerHTML = product.button;
            productElement.appendChild(addBtn);

            addBtn.addEventListener("click", () => {
                cartFunctions.addProduct(product.id);
                cartFunctions.updateCounter();
            });
        });
    },
};

const formFunctions = {
    setErrStatus: (inputField, errMsg) => {
        document.getElementById(`${inputField}_err`).innerHTML = errMsg; //sets error-msg
        document.forms["myForm"][inputField].className = "form-control errorBorder"; //sets the border red
    },
    removeErrStatus: inputField => {
        document.getElementById(`${inputField}_err`).innerHTML = ""; //removes the error-msg
        document.forms["myForm"][inputField].className = "form-control"; //removes the red border
    },
    getValue: inputField => document.forms["myForm"][inputField].value, //gets value inside the input field
    validateForm: () => {
        const allFieldNames = Object.keys(form); //all keys of the form-object is now in "allFieldNames"
        allFieldNames.map((field) => {
            const isValid = form[field].validate(formFunctions.getValue(field)); //validates one at a time, each form-input
            if (isValid) {
                formFunctions.removeErrStatus(field)
            } else {
                formFunctions.setErrStatus(field, form[field].errorMsg)
            }
        });
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
        const allHtmlElements = [];
        let totalAmount = 0;
        const theCheckoutContainerElement = document.getElementById('checkoutCart');
        theCheckoutContainerElement.innerText = "";
        appState.cart.cart_rows.map((row) => {
            const product = appState.productCatalogue.find((e) => e.id === row.productId);

            const htmlRow = document.createElement("div"); //this is parent-div
            htmlRow.className = "checkout-row";

            const name = document.createElement("p");
            name.innerText = "Product: " + product.productName;
            htmlRow.appendChild(name);

            const count = document.createElement("p");
            count.innerText = "Nr of this product: " + row.count;
            htmlRow.appendChild(count);

            //create add button in the row
            const addProductBtn = document.createElement("button");
            addProductBtn.innerText = "+";
            htmlRow.appendChild(addProductBtn);
            addProductBtn.addEventListener("click", () => cartFunctions.increaseAmount(row.productId));

            //create remove button in the row
            const removeProductBtn = document.createElement("button");
            removeProductBtn.innerText = " - ";
            htmlRow.appendChild(removeProductBtn);
            removeProductBtn.addEventListener("click", () => cartFunctions.decreaseAmount(row.productId));


            const price = document.createElement("p");
            price.innerText = "Price per product: " + product.price + " kr";
            htmlRow.appendChild(price);

            const rowTotal = document.createElement("p");
            let rowSum = (product.price * row.count);
            rowTotal.innerText = "This row total: " + rowSum + " kr";
            htmlRow.appendChild(rowTotal);

            const eliminateRow = document.createElement("button");
            eliminateRow.innerText = "X";
            htmlRow.appendChild(eliminateRow);
            eliminateRow.addEventListener("click", () => cartFunctions.eliminatingThisRow(row.productId));

            allHtmlElements.push(htmlRow);

            totalAmount += rowSum; //adds up every rowSum into totalAmount

            theCheckoutContainerElement.appendChild(htmlRow); //makes current html-element a child of checkoutCart
        });


        const totalAmountElement = document.createElement("h2");
        totalAmountElement.innerText = "Total amount: " + totalAmount.toString() + " kr";
        theCheckoutContainerElement.appendChild(totalAmountElement);

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
        document.getElementById("itemsCounter").innerText = cartFunctions.getCount().toString();
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

    decreaseAmount: function (productId) { //hej2
        appState.cart.cart_rows.map((element) => { //cart_rows productId: hej2
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


