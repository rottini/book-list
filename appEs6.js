class Book {
    constructor(title,author,isbn){  
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI { // here so as there are no parameters, you don't need a constructor. The call of functions and their respective commands enters directly.
    addBookToList(book){
        const list = document.getElementById('book-list'); // keeping in the variable list the body of the table that will be the active element.

        // create a tr (row) and with 3 columns (td) and inside that td 4 values ​​that are passed by users

        const row = document.createElement('tr'); // Here the line was created
        row.innerHTML = `<td>${book.title}</td> <td>${book.author}</td> <td>${book.isbn}</td> <td><a href="#" class="delete">X</a>`;  // aqui vamos adicionar as colunas com valores do input
        list.appendChild(row); // appending the row to it´s parent Element list

                           // remembering that this command will respond to the submit eventListerner.
    }

    showAlert(message,className){

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));

        form.appendChild(div),
        container.insertBefore(div,form);

        setTimeout(function(){
            document.querySelector('.alert').remove();
        },3000);
        
    }

    deleteBook(target){

        if(target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }

    clearFields(){
        
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

class Store {

   static getBooks() {
        let books;
      if(localStorage.getItem('books') === null){
          books = [];
      } else {
          books = JSON.parse(localStorage.getItem('books'));
      }
      return books;
    }

    static displayBooks(){
        const books = Store.getBooks();

        books.forEach(function(book){
            const ui = new UI();

            ui.addBookToList(book);
        })
    }

    static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }
   

    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach(function(book,index){
            if(book.isbn === isbn){
                books.splice(index,1);
            }
        });
       localStorage.setItem('books', JSON.stringify(books));
    }
}


document.addEventListener('DOMContentLoaded', Store.displayBooks);

document.getElementById('book-form').addEventListener('submit', function (e) {  // The click Event call the function below

    // Get the element´s ID
    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value

    //Instantiating Book 
    const book = new Book(title, author, isbn); // Now the book object is instantiated to the Book class.

    // Instantiating UI
    const ui = new UI();

    // Create here a validation of the situation, if fields are empty execute this function:
    if (title === '' || author === '' || isbn === '') {
        ui.showAlert(`Please fill in the fields`, 'error');
    } else {
        // important note, these functions below add the book must be inside the else.
        // otherwise the above error message will be sent but it will still be added
        // an empty field in the table, and we only want it to be added if the fields have been filled.
        ui.addBookToList(book);
        Store.addBook(book);
        ui.showAlert(`Book Add!`, 'success');
        ui.clearFields();
    }
    e.preventDefault();
});

document.getElementById('book-list').addEventListener('click', function (e) {

    const ui = new UI(); // important note, we always have to instantiate the ui, as it is the one who calls the prototypes,
    //if it is not present in the scope of the function we cannot use it to "call the function" ui.deleteBook.

    ui.deleteBook(e.target); // the parameter here is the e.target which is the anchor tag "<a href="#" class="delete">X</a>"
    ui.showAlert(`Book, removed!`, `success`);
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    e.preventDefault();
});