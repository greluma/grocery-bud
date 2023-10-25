// ****** SELECT ITEMS **********
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.querySelector("#grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// edit option
let editElement;
let editFlag = false;
let editId = "";

// ****** EVENT LISTENERS **********
// load initial items
window.addEventListener("DOMContentLoaded", setupItems);

// submitForm
form.addEventListener("submit", addItem);
// clear list
clearBtn.addEventListener("click", clearItems);

// ****** FUNCTIONS **********
function addItem(e) {
  e.preventDefault();
  const value = grocery.value;
  const id = new Date().getTime().toString();
  // ** new Item
  if (value && !editFlag) {
    const element = document.createElement("article");
    // add class
    element.classList.add("grocery-item");
    //   add id
    const attr = document.createAttribute("data-id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="title">${value}</p>
            <div class="btn-container">
              <button type="button" class="edit-btn">
                <i class="fas fa-edit"></i>
              </button>
              <button type="button" class="delete-btn">
                <i class="fas fa-trash"></i>
              </button>
            </div>`;

    // ** edit and delete selectors and listeners
    const deleteBtn = element.querySelector(".delete-btn");
    const editBtn = element.querySelector(".edit-btn");
    deleteBtn.addEventListener("click", deleteItem);
    editBtn.addEventListener("click", editItem);

    //   append child
    list.appendChild(element);
    //   display alert
    displayAlert("you have a new element", "success");
    //   show container
    container.classList.add("show-container");

    // ** add to local storage
    addToLocalStorage(id, value);
    setBackToDefault();
  }
  // ** edit Item
  else if (value && editFlag) {
    editElement.innerHTML = value;
    displayAlert("value changed", "success");
    // editLocalStorage
    editLocalStorage(editId, value);
    setBackToDefault();
  } else {
    displayAlert("please enter value", "danger");
  }
}

function displayAlert(text, action) {
  alert.textContent = text;
  alert.classList.toggle(`alert-${action}`);
  //   remove alert
  setTimeout(function () {
    alert.textContent = "";
    alert.classList.toggle(`alert-${action}`);
  }, 1000);
}

// set input back to default
function setBackToDefault() {
  grocery.value = "";
  editFlag = false;
  editId = "";
  submitBtn.textContent = "submit";
}

// clear list
function clearItems() {
  const items = document.querySelectorAll(".grocery-item");
  items.forEach((element) => {
    element.remove();
  });
  container.classList.remove("show-container");
  displayAlert("empty list", "danger");
  setBackToDefault();
  localStorage.removeItem("list");
}

// edit item
function editItem(e) {
  const item = e.target.parentNode.parentNode.parentNode;
  // set edit item
  editElement = item.querySelector("p");
  // set form value
  grocery.value = editElement.textContent;
  editFlag = true;
  editId = item.dataset.id;
  submitBtn.textContent = "edit";
}

// delete single item
function deleteItem(e) {
  const item = e.target.parentNode.parentNode.parentNode;
  const id = item.dataset.id;
  item.remove();
  if (!document.querySelectorAll(".grocery-item").length) {
    container.classList.remove("show-container");
  }
  displayAlert("item removed", "danger");
  setBackToDefault();
  //   remove from local storage
  removeFromLocalStorage(id);
}

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value) {
  const grocery = { id, value };
  let items = localStorage.getItem("list")
    ? JSON.parse(localStorage.getItem("list"))
    : [];
  items.push(grocery);
  localStorage.setItem("list", JSON.stringify(items));
}

function removeFromLocalStorage(id) {
  let items = JSON.parse(localStorage.getItem("list"));

  const res = items.filter((item) => item.id != id);
  localStorage.setItem("list", JSON.stringify(res));
}

function editLocalStorage(id, value) {
  let items = JSON.parse(localStorage.getItem("list"));
  items.forEach((element) => {
    if (element.id == id) {
      element.value = value;
    }
  });
  localStorage.setItem("list", JSON.stringify(items));
}

// ****** SETUP ITEMS **********
function setupItems() {
  // ** my solution
  let res = ``;
  let items = JSON.parse(localStorage.getItem("list"));
  if (items) {
    container.classList.add("show-container");
    items.forEach((element) => {
      res += ` <article class="grocery-item" data-id="${element.id}"><p class="title">${element.value}</p>
              <div class="btn-container">
                <button type="button" class="edit-btn">
                  <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="delete-btn">
                  <i class="fas fa-trash"></i>
                </button>
              </div></article>`;
    });
    list.innerHTML = res;
    displayAlert(
      `${items.length} items loaded from the local storage`,
      "success"
    );
    const delB = document.querySelectorAll(".delete-btn");
    const edB = document.querySelectorAll(".edit-btn");
    delB.forEach((el) => {
      el.addEventListener("click", deleteItem);
    });
    edB.forEach((el) => {
      el.addEventListener("click", editItem);
    });
  }
}
