//Book Class: Represents a book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

// UI Class: Handles UI Task
class UI {
  static displayBooks() {
    const books = Store.getBook();

    books.forEach((book) => UI.addBookToTable(book));
  }

  static alertUser(message, classOfElement) {
    const div = document.createElement("div");
    div.className = `alert alert-${classOfElement}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);

    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearForm() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }

  static addBookToTable(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete-book">X</a></td>
    `;

    list.appendChild(row);
  }

  static removeBookInTable(targetElement) {
    if (targetElement.classList.contains("delete-book")) {
      targetElement.parentElement.parentElement.remove();
    }
  }
}

// Storage Class: Handles Storage

class Store {
  //Get Book
  static getBook() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }

    return books;
  }

  //Add book

  static addBook(book) {
    const books = Store.getBook();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  //Remove book
  static removeBook(isbn) {
    const books = Store.getBook();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
        console.log(books.isbn);
      }
    });

    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Event: Display Book

document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Event: Add Book
document.querySelector("#book-form").addEventListener("submit", (e) => {
  e.preventDefault();

  //Get  form values
  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const isbn = document.querySelector("#isbn").value;

  //Validate forms
  if (title === "" || author === "" || isbn === "") {
    //Show error alert
    UI.alertUser("Hello! Please fill in all the fields", "danger");
  } else {
    //Instantiate books
    const book = new Book(title, author, isbn);
    console.log(book);

    //Add the submitted book to the table
    UI.addBookToTable(book);

    //Add the submitted book to local storage
    Store.addBook(book);
    //Show success alert
    UI.alertUser(
      "Congrats! Your book is now stored in the Library of Alexandria",
      "success"
    );

    //Clear the field after submitting
    UI.clearForm();
  }
});

// Event: Remove Book

document.querySelector("#book-list").addEventListener("click", (e) => {
  UI.removeBookInTable(e.target);

  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
  //   console.log(e.target.parentElement.previousElementSibling.textContent);

  UI.alertUser(
    "Book successfully removed from the Library of Alexandria :(",
    "warning"
  );
});
