const productCatalogue = [
    {
        productName: "Kettle bell",
        price: 2,
        description: "Lift it",
        image: "https://images.pexels.com/photos/221247/pexels-photo-221247.jpeg",
        button: "Add To Cart"
    },
    {
        productName: "Running Shoe",
        price: 2,
        description: "Run faster",
        image: "https://images.pexels.com/photos/57421/running-shoe-shoe-asics-highly-functional-57421.jpeg",
        button: "Add To Cart"
    },
    {
        productName: "Football",
        price: 2,
        description: "Kick it",
        image: "https://images.pexels.com/photos/51971/football-the-ball-sport-game-51971.jpeg",
        button: "Add To Cart"
    }
];

let checkoutWrapper = document.querySelector(".checkout-wrapper");
let productWrapper = document.querySelector(".product-wrapper");
let checkoutBtn = document.getElementById("checkoutBtn");
let productBtn = document.getElementById("productBtn");
let submitBtn = document.getElementById("square-button");

checkoutWrapper.style.display = "none";

productBtn.addEventListener("click", function () {
    checkoutWrapper.style.display = "none";
    productWrapper.style.display = "flex";
});

checkoutBtn.addEventListener("click", function () {
    productWrapper.style.display = "none";
    checkoutWrapper.style.display = "block";
});


for (let i = 0; i < productCatalogue.length; i++) {
    let product = document.createElement("div");
    productWrapper.appendChild(product);
    product.className = "product";

    let title = document.createElement("h2");
    title.innerHTML = productCatalogue[i].productName;
    product.appendChild(title);

    let productPrice = document.createElement("p");
    productPrice.innerHTML = `Price: ${productCatalogue[i].price} SEK`;
    product.appendChild(productPrice);

    let productImage = document.createElement("img");
    productImage.src = productCatalogue[i].image;
    product.appendChild(productImage);

    let productDescription = document.createElement("p");
    productDescription.innerHTML = productCatalogue[i].description;
    product.appendChild(productDescription);

    let addBtn = document.createElement("button");
    addBtn.innerHTML = productCatalogue[i].button;
    product.appendChild(addBtn);
}

submitBtn.addEventListener("click", function (e) {
    e.preventDefault();
    validateForm();
});



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



const setErrStatus = (inputField, errMsg) => {
    document.getElementById(`${inputField}_err`).innerHTML = errMsg;
    document.forms["myForm"][inputField].className = "form-control errorBorder";
};

const removeErrStatus = inputField => {
    document.getElementById(`${inputField}_err`).innerHTML = "";
    document.forms["myForm"][inputField].className = "form-control";
};

const getValue = inputField => document.forms["myForm"][inputField].value;

const validateForm = () => {
    const allFieldNames = Object.keys(form);
    allFieldNames.map((field) => {
        const isValid = form[field].validate(getValue(field));
        if (isValid) {
            removeErrStatus(field)
        } else {
            setErrStatus(field, form[field].errorMsg)
        }
    });
};
