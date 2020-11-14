var auth = firebase.auth();
var db = firebase.firestore();
var storage = firebase.storage();
var yourPosts = document.getElementById('your-Posts');
// var uid;
var userEmail = document.getElementById('userEmail');
var userPassword = document.getElementById('userPassword');
var btnForEntryInDBMS = document.getElementById('btnForDataAddingDBMS');
var unsubscribe;
var locationToSignOut = document.getElementById('locationOfPageChange');
var addProducts = document.getElementById('products');
var productImage = document.getElementById('file-Upload');
var editAndAddBtn = document.getElementById('btnD');
var rowToappend = document.getElementById('edited-TO');
var editKey;
console.log(productImage);

console.log(locationToSignOut);
console.log(auth);
console.log(addProducts);
console.log(btnForEntryInDBMS);

// var customProduct = `<div class="col-md-4 mb-2">
// <div class="card" style="width: 18rem;">
//     <img src="./p1.webp" class="card-img-top" alt="...">
//     <div class="card-body">
//         <h5 class="card-title">Card title</h5>
//         <p class="card-text">Some quick example text to build on the card title and make up the bulk of
//             the
//             card's content.</p>
//         <p class="card-text">Contact Number</p>
//     </div>
// </div>
// </div>`;


// var loginUserProduct = `<div class="col-md-4 mb-2">
// <div class="card" style="width: 18rem;">
//     <img src="./p1.webp" class="card-img-top" alt="...">
//     <div class="card-body">
//         <h5 class="card-title">Card title</h5>
//         <p class="card-text">Some quick example text to build on the card title and make up the bulk of
//             the
//             card's content.</p>
//         <p class="card-text">Contact Number</p>
//         <a href="#" class="btn btn-primary">EDIT</a>
//         <a href="#" class="btn btn-primary">DELETE</a>
//     </div>
// </div>
// </div>`;

var bodyOfElement = document.childNodes[1].childNodes[2];
// var aElement = document.childNodes[1].childNodes[10].childNodes[5].childNodes[1].childNodes[5].childNodes[3];
// var newEl = aElement.getAttribute('href');
console.log(bodyOfElement);
// console.log(aElement);
// console.log(newEl);

function register() {
    console.log(userEmail.value);
    console.log(userPassword.value);
    auth.createUserWithEmailAndPassword(userEmail.value, userPassword.value);
    userEmail.innerHTML = '';
    userPassword.innerHTML = '';
    swal("Congratulations!", "You Signed Up Successfully! Now Just CLick On LOG IN", "success");

}

function LogIn() {
    console.log(userEmail.value);
    console.log(userPassword.value);
    var newEmail = userEmail.value;
    var newPassword = userPassword.value;
    console.log(newEmail, newPassword);
    auth.signInWithEmailAndPassword(newEmail, newPassword)
        .then(function (user) {
            console.log(`USER ID: ${user.user.uid}`);
            userEmail.innerHTML = '';
            userPassword.innerHTML = '';
            swal("Congratulations!", "You Loged In Successfully!", "success");
            redirect();
        })
        .catch(function (error) {
            console.log('Error: ', error);
            swal("Error!", "Your Password is Incorrect", "error");

        })
}


function redirect() {
    localStorage.setItem('userInfo', JSON.stringify(auth.currentUser));
    // bodyOfElement.setAttribute('onload', 'getAllData();getAllDataOfUSer()');

    window.location.href = './index.html';
    // btnForEntryInDBMS.setAttribute('onclick', 'addDataOfUserSignedIn()');
    // console.log(btnForEntryInDBMS);

    // setTimeout(function () {
    //     btnForEntryInDBMS.setAttribute('onclick', 'addDataOfUserSignedIn()');
    //     console.log(btnForEntryInDBMS);
    // }, 1);
}
// setTimeout(function () {
//     btnForEntryInDBMS.setAttribute('onclick', 'addDataOfUserSignedIn()');
//     // bodyOfElement.setAttribute('onload', 'getAllData();getAllDataOfUSer()');
//     console.log(btnForEntryInDBMS);
//     console.log(bodyOfElement);
// }, 10000);


// function changeAttribute() {
//     bodyOfElement.setAttribute('onload', 'getAllData();getAllDataOfUSer()');
//     console.log(bodyOfElement);
// }
// function changeId() {
//     console.log(btnForEntryInDBMS);
//     if (auth.currentUser.uid) {
//         btnForEntryInDBMS.setAttribute('onclick', 'addDataOfUserSignedIn()');
//         console.log(btnForEntryInDBMS);
//     } else {
//         console.log('Hi No Change');
//     }
// }
// changeId();


function signOut() {
    unsubscribe();
    auth.signOut()
        .then(function () {
            localStorage.clear();
            btnForEntryInDBMS.setAttribute('onclick', 'addData()');
            console.log(btnForEntryInDBMS);
            window.location.href = './userlogin.html';
            swal("Congratulations!", "You Are Successfully SIGNED OUT!", "success");
        })

    // alert('You Are Successfully Signed Out..')
}

var resetEmail = document.getElementById('resetEmail');

function passWordReset() {
    var email = resetEmail.value;
    console.log(email);
    firebase.auth().sendPasswordResetEmail(email)
        .then(function () {
            swal("Congratulations!", "Password Reset Email Is Been Sent Succeddfully!", "success");
            redirectToLoginPage();
        })
        .catch(function (error) {
            swal("Error!", "Your Email Address is not suitable", "error");

        });
}

function redirectToLoginPage() {
    window.location.href = './userlogin.html';
}

var prNameCustom = document.getElementById('productName');
var prPriceCustom = document.getElementById('productPrice');
var prDescription = document.getElementById('productDescription');
var contactNumberCustom = document.getElementById('contactNumber');

// function addData() {


//     db.collection("Custom Product").add({
//             productName: prNameCustom.value,
//             priceCustom: prPriceCustom.value,
//             productDescription: prDescription.value,
//             contactNumber: contactNumberCustom.value
//         })
//         .then(function (docRef) {
//             console.log("Document written with ID: ", docRef.id);
//             prNameCustom.value = '';
//             prPriceCustom.value = '';
//             prDescription.value = '';
//             contactNumberCustom.value = '';
//         })
//         .catch(function (error) {
//             console.error("Error adding document: ", error);
//         });
// }


function addDataOfUserSignedIn() {
    var file = productImage.files[0];
    console.log(file);
    if (file.value !== null && prNameCustom.value !== null && prPriceCustom.value !== null && prDescription.value !== null && contactNumberCustom.value !== null) {
        var imagesRef = storage.ref().child('images/' + productImage.files[0].name);
        var uploadTask = imagesRef.put(file);
        uploadTask.snapshot.ref.getDownloadURL()
            .then(function (url) {
                console.log('URL => ', url);
                db.collection("User Product").add({
                        productName: prNameCustom.value,
                        priceCustom: prPriceCustom.value,
                        productDescription: prDescription.value,
                        contactNumber: contactNumberCustom.value,
                        uid: auth.currentUser.uid,
                        productImg: url
                    })
                    .then(function (docRef) {
                        console.log("Document written with ID: ", docRef.id);
                        prNameCustom.value = '';
                        prPriceCustom.value = '';
                        prDescription.value = '';
                        contactNumberCustom.value = '';
                        swal("Congratulations!", "Your Desired Product Is Added Successfully!", "success");
                        // getAllDataOfUSer();
                    })
                    .catch(function (error) {
                        console.error("Error adding document: ", error);
                    });

            })

    }
    else{
        swal("Error!", "Some Fields are been empty please fill to add the data", "error");

    }


    console.log(btnForEntryInDBMS);
    // db.collection("User Product").add({
    //         productName: prNameCustom.value,
    //         priceCustom: prPriceCustom.value,
    //         productDescription: prDescription.value,
    //         contactNumber: contactNumberCustom.value,
    //         uid: auth.currentUser.uid
    //     })
    //     .then(function (docRef) {
    //         console.log("Document written with ID: ", docRef.id);
    //         prNameCustom.value = '';
    //         prPriceCustom.value = '';
    //         prDescription.value = '';
    //         contactNumberCustom.value = '';
    //         // getAllDataOfUSer();
    //     })
    //     .catch(function (error) {
    //         console.error("Error adding document: ", error);
    //     });
}



function getAllDataOfUSer() {
    // var uid = JSON.parse(localStorage.getItem('userInfo')).uid;
    unsubscribe = db.collection("User Product")
        .onSnapshot(function (snapshot) {
            snapshot.docChanges().forEach(function (change) {
                if (change.type === 'added') {
                    console.log('New Product Added: ', change.doc.data());
                    makeProductFromSignedUser(change.doc);
                }
                if (change.type === 'modified') {
                    console.log('Modified Data: ', change.doc.data(), change.doc.id);
                    updateCardOnDOM(change.doc.id, change.doc);
                }

                if (change.type === 'removed') {
                    console.log('Removed Data: ', change.doc.data(), change.doc.id);
                    deleteFromDOM(change.doc.id);
                }
            })
        })
}

function getDataOFSignedUser() {
    var uid = JSON.parse(localStorage.getItem('userInfo')).uid;
    db.collection("User Product").where('uid', '==', uid)
        .onSnapshot(function (snapshot) {
            snapshot.docChanges().forEach(function (change) {
                if (change.type === 'added') {
                    console.log('New Product Added: ', change.doc.data());
                    makeProductFromSignedInUser(change.doc);
                }
                if (change.type === 'modified') {
                    console.log('Modified Data: ', change.doc.data(), change.doc.id);
                    updateCardOnDOM(change.doc.id, change.doc);
                }

                if (change.type === 'removed') {
                    console.log('Removed Data: ', change.doc.data(), change.doc.id);
                    deleteFromDOM(change.doc.id);
                }
            })
        })
}


function makeProductFromSignedInUser(data) {
    console.log(data.data());
    var itemData = data.data();
    itemData.id = data.id;
    var cardDiv = document.createElement('div')
    cardDiv.className = "col-md-4 mb-2";
    var cardDivD = document.createElement('div');
    cardDivD.className = "card";
    cardDivD.style.width = "18rem";
    var cardImg = document.createElement('img');
    cardImg.setAttribute('src', itemData.productImg);
    cardImg.className = "card-img-top";
    var cardDivS = document.createElement('div');
    cardDivS.className = "card-body";
    cardDivS.setAttribute('id', itemData.id);
    var cardHeading = document.createElement('h5');
    cardHeading.className = "card-title";
    var cardHeadingText = document.createTextNode(itemData.productName);
    cardHeading.appendChild(cardHeadingText);
    var cardDescription = document.createElement('p');
    cardDescription.className = "card-text";
    var cardDescriptionText = document.createTextNode(itemData.productDescription);
    cardDescription.appendChild(cardDescriptionText);
    var contactNumberP = document.createElement('p');
    contactNumberP.className = "card-text";
    var contactNumberPText = document.createTextNode(itemData.contactNumber);
    contactNumberP.appendChild(contactNumberPText);
    var priceHeading = document.createElement('h5');
    priceHeading.className = "card-title";
    var priceHeadingText = document.createTextNode(itemData.priceCustom);
    priceHeading.appendChild(priceHeadingText);
    var btnDelete = document.createElement('button');
    var btnDeleteText = document.createTextNode('DELETE');
    btnDelete.appendChild(btnDeleteText);
    btnDelete.className = "btn btn-danger py-2 px-2 mr-2";
    btnDelete.setAttribute('onclick', 'deleterUserData(this)');
    var btnEdit = document.createElement('button');
    var btnEditText = document.createTextNode('EDIT');
    btnEdit.className = "btn btn-primary py-2 px-2 mr-2";
    btnEdit.appendChild(btnEditText);
    btnEdit.setAttribute('onclick', 'editCardOfUser(this)');

    cardDivS.appendChild(cardHeading);
    cardDivS.appendChild(cardDescription);
    cardDivS.appendChild(contactNumberP);
    cardDivS.appendChild(priceHeading);
    // var uid = JSON.parse(localStorage.getItem('userInfo')).uid;
    cardDivS.appendChild(btnDelete);
    cardDivS.appendChild(btnEdit);
    cardDivD.appendChild(cardImg);
    cardDivD.appendChild(cardDivS);
    cardDiv.appendChild(cardDivD);
    rowToappend.appendChild(cardDiv);
}




function makeProductFromSignedUser(data) {
    console.log(data.data());
    var itemData = data.data();
    itemData.id = data.id;
    var cardDiv = document.createElement('div')
    cardDiv.className = "col-md-4 mb-2";
    var cardDivD = document.createElement('div');
    cardDivD.className = "card";
    cardDivD.style.width = "18rem";
    var cardImg = document.createElement('img');
    cardImg.setAttribute('src', itemData.productImg);
    cardImg.className = "card-img-top";
    var cardDivS = document.createElement('div');
    cardDivS.className = "card-body";
    cardDivS.setAttribute('id', itemData.id);
    var cardHeading = document.createElement('h5');
    cardHeading.className = "card-title";
    var cardHeadingText = document.createTextNode(itemData.productName);
    cardHeading.appendChild(cardHeadingText);
    var cardDescription = document.createElement('p');
    cardDescription.className = "card-text";
    var cardDescriptionText = document.createTextNode(itemData.productDescription);
    cardDescription.appendChild(cardDescriptionText);
    var contactNumberP = document.createElement('p');
    contactNumberP.className = "card-text";
    var contactNumberPText = document.createTextNode(itemData.contactNumber);
    contactNumberP.appendChild(contactNumberPText);
    var priceHeading = document.createElement('h5');
    priceHeading.className = "card-title";
    var priceHeadingText = document.createTextNode(itemData.priceCustom);
    priceHeading.appendChild(priceHeadingText);
    var btnDelete = document.createElement('button');
    var btnDeleteText = document.createTextNode('DELETE');
    btnDelete.appendChild(btnDeleteText);
    btnDelete.className = "btn btn-danger py-2 px-2 mr-2";
    btnDelete.setAttribute('onclick', 'deleterUserData(this)');
    var btnEdit = document.createElement('button');
    var btnEditText = document.createTextNode('EDIT');
    btnEdit.className = "btn btn-primary py-2 px-2 mr-2";
    btnEdit.appendChild(btnEditText);
    btnEdit.setAttribute('onclick', 'editCardOfUser(itemData)');

    cardDivS.appendChild(cardHeading);
    cardDivS.appendChild(cardDescription);
    cardDivS.appendChild(contactNumberP);
    cardDivS.appendChild(priceHeading);
    // var uid = JSON.parse(localStorage.getItem('userInfo')).uid;
    // if (auth.currentUser !== null) {
    //     cardDivS.appendChild(btnDelete);
    //     cardDivS.appendChild(btnEdit);
    // }
    cardDivD.appendChild(cardImg);
    cardDivD.appendChild(cardDivS);
    cardDiv.appendChild(cardDivD);
    rowToappend.appendChild(cardDiv);
}




function getAllData() {
    db.collection("Custom Product")
        .onSnapshot(function (snapshot) {
            snapshot.docChanges().forEach(function (change) {
                if (change.type === 'added') {
                    console.log('New Product Added: ', change.doc.data());
                    makeProductForCustomUser(change.doc);
                }
            })
        })
}


function makeProductForCustomUser(data) {
    console.log(data.data());
    var cardDiv = document.createElement('div')
    cardDiv.className = "col-md-4 mb-2";
    var cardDivD = document.createElement('div');
    cardDivD.className = "card";
    cardDivD.style.width = "18rem";
    var cardImg = document.createElement('img');
    cardImg.src = "./p1.webp";
    cardImg.className = "card-img-top";
    var cardDivS = document.createElement('div');
    cardDivS.className = "card-body";
    var cardHeading = document.createElement('h5');
    cardHeading.className = "card-title";
    var cardHeadingText = document.createTextNode(data.data().productName);
    cardHeading.appendChild(cardHeadingText);
    var cardDescription = document.createElement('p');
    cardDescription.className = "card-text";
    var cardDescriptionText = document.createTextNode(data.data().productDescription);
    cardDescription.appendChild(cardDescriptionText);
    var contactNumberP = document.createElement('p');
    contactNumberP.className = "card-text";
    var contactNumberPText = document.createTextNode(data.data().contactNumber);
    contactNumberP.appendChild(contactNumberPText);
    var priceHeading = document.createElement('h5');
    priceHeading.className = "card-title";
    var priceHeadingText = document.createTextNode(data.data().priceCustom);
    priceHeading.appendChild(priceHeadingText);

    cardDivS.appendChild(cardHeading);
    cardDivS.appendChild(cardDescription);
    cardDivS.appendChild(contactNumberP);
    cardDivS.appendChild(priceHeading);
    cardDivD.appendChild(cardImg);
    cardDivD.appendChild(cardDivS);
    cardDiv.appendChild(cardDivD);
    rowToappend.appendChild(cardDiv);
}



function deleterUserData(itemToDelete) {
    console.log('Item', itemToDelete.parentNode.id);
    var docId = itemToDelete.parentNode.id;
    db.collection("User Product").doc(docId).delete()
        .then(function () {
            console.log("Document successfully deleted!");
        }).catch(function (error) {
            console.error("Error removing document: ", error);
        });

}

function deleteFromDOM(id) {
    var itemToDelete = document.getElementById(id);
    console.log(id);
    console.log(itemToDelete.parentNode.parentNode);
    var newdEL = itemToDelete.parentNode.parentNode;
    rowToappend.removeChild(newdEL);

}

function editCardOfUser(elementToEdit) {
    // console.log(elementToEdit);
    // console.log(elementToEdit.parentNode);
    // console.log(elementToEdit.parentNode.childNodes);
    editKey = elementToEdit.parentNode.id;
    console.log(editKey);
    window.location.href = './addProducts.html';
    console.log(elementToEdit.parentNode);
    console.log(elementToEdit.parentNode.parentNode);
    editKey = elementToEdit.parentNode.parentNode;
    console.log(editKey);
    editKey.id = elementToEdit.parentNode.id;
    console.log(editKey);
    console.log(editKey.childNodes[1].id);
    editKey = elementToEdit.parentNode.id;
    console.log(editKey);
    console.log(elementToEdit.parentNode.childNodes[0].innerHTML);
    console.log(elementToEdit.parentNode.childNodes[1].innerHTML);
    console.log(elementToEdit.parentNode.childNodes[2].innerHTML);
    console.log(elementToEdit.parentNode.childNodes[3].innerHTML);
    localStorage.setItem('userName', JSON.stringify(elementToEdit.parentNode.childNodes[0].innerHTML));
    localStorage.setItem('userDescription', JSON.stringify(elementToEdit.parentNode.childNodes[1].innerHTML));
    localStorage.setItem('userContactNumber', JSON.stringify(elementToEdit.parentNode.childNodes[2].innerHTML));
    localStorage.setItem('userPrice', JSON.stringify(elementToEdit.parentNode.childNodes[3].innerHTML));
    localStorage.setItem('editKey', JSON.stringify(elementToEdit.parentNode.id));
    // prNameCustom.value = elementToEdit.parentNode.childNodes[0].innerHTML;
    // prDescription.value = elementToEdit.parentNode.childNodes[1].innerHTML;
    // contactNumberCustom.value = elementToEdit.parentNode.childNodes[2].innerHTML;
    // prPriceCustom.value = elementToEdit.parentNode.childNodes[3].innerHTML;
    console.log(prNameCustom);
    console.log(prDescription);
    console.log(contactNumberCustom);
    console.log(prPriceCustom);
    // prNameCustom.value = JSON.parse(localStorage.getItem('userName'));
    // prDescription.value = JSON.parse(localStorage.getItem('userDescription'));
    // contactNumberCustom.value = JSON.parse(localStorage.getItem('userContactNumber'));
    // prPriceCustom.value = JSON.parse(localStorage.getItem('userPrice'));
    // prNameCustom.value = elementToEdit.productName;
    // prDescription.value = elementToEdit.prDescription;
    // contactNumberCustom.value = elementToEdit.contactNumber;
    // prPriceCustom.value = elementToEdit.priceCustom;
    editAndAddBtn.value = 'Save';
    editAndAddBtn.setAttribute('onclick', 'updateCard(this)');
}

function updateCard(updateData) {
    console.log(updateData);
    editKey = JSON.parse(localStorage.getItem("editKey"));
    console.log(editKey);
    var file = productImage.files[0];
    var imagesRef = storage.ref().child('images/' + productImage.files[0].name);
    var uploadTask = imagesRef.put(file);
    uploadTask.snapshot.ref.getDownloadURL()
        .then(function (url) {
            console.log('URL => ', url);
            db.collection("User Product").doc(editKey).update({
                    productName: prNameCustom.value,
                    priceCustom: prPriceCustom.value,
                    productDescription: prDescription.value,
                    contactNumber: contactNumberCustom.value,
                    uid: auth.currentUser.uid,
                    productImg: url
                })
                .then(function () {
                    editAndAddBtn.value = 'ADD';
                    editAndAddBtn.setAttribute('onclick', 'addDataOfUserSignedIn(this)');
                    // btnForEntryInDBMS.setAttribute('onclick', 'addDataOfUserSignedIn(this)');
                    prNameCustom.value = '';
                    prPriceCustom.value = '';
                    prDescription.value = '';
                    contactNumberCustom.value = '';
                    editKey = undefined;
                    swal("Congratulations!", "Your Desired Product is UPDATED Successfully!", "success");
                    localStorage.clear();
                    localStorage.setItem('userInfo', JSON.stringify(auth.currentUser.uid));
                })
        })
}


function updateCardOnDOM(dataCard, dateGet) {
    var elementToUpdate = document.getElementById(dataCard);
    console.log(elementToUpdate);
    console.log(dateGet.data());
    console.log(elementToUpdate.childNodes);
    elementToUpdate.childNodes[0].innerHTML = dateGet.data().productName;
    elementToUpdate.childNodes[1].innerHTML = dateGet.data().productDescription;
    elementToUpdate.childNodes[2].innerHTML = dateGet.data().contactNumber;
    elementToUpdate.childNodes[3].innerHTML = 'RS. ' + dateGet.data().priceCustom;
}


function checkUserSignIn() {
    var uid = JSON.parse(localStorage.getItem('userInfo')).uid;
    if (uid) {
        locationToSignOut.innerHTML = 'SIGN OUT';
        locationToSignOut.setAttribute('onclick', 'signOut()');
        addProducts.setAttribute('href', './addProducts.html');
        yourPosts.setAttribute('href', './yourPost.html');
    } else {
        console.log('no use');
    }
}


function checkEditSection() {
    if (localStorage.getItem("userName") !== null && localStorage.getItem("userDescription") !== null && localStorage.getItem("userContactNumber") !== null && localStorage.getItem("userPrice") !== null) {
        prNameCustom.value = JSON.parse(localStorage.getItem("userName"));
        prDescription.value = JSON.parse(localStorage.getItem("userDescription"));
        contactNumberCustom.value = JSON.parse(localStorage.getItem("userContactNumber"));
        prPriceCustom.value = JSON.parse(localStorage.getItem("userPrice"));
        editAndAddBtn.value = 'Save';
        editAndAddBtn.setAttribute('onclick', 'updateCard(this)');
    } else {
        console.error('Please check something went wrong');
    }
}