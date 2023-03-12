const book = [];
const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';
const SAVED_EVENT = 'saved-book';

function generateBookObject(id, bookTitle, bookAuthor, bookYear, isComplete) {
    return {id, bookTitle, bookAuthor, bookYear, isComplete};
}

function generatedID(){
    return +new Date();
}

function findBook(ID_book){
    for (const All_book of book){
        if (All_book.id === ID_book){
            return All_book;
        }
    }
    return null;
}

function findBookIndex(ID_book){
    for (const index in book){
        if (book[index].id === ID_book){
            return index;
        }
    }
    return -1;
}

function isStorageExist(){
    if (typeof(Storage)===undefined){
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null){
        for (const All_book of data){
            book.push(All_book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener(SAVED_EVENT, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
});

function saveData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(book);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function addBookToCompleted(ID_book){
    const bookTarget = findBook(ID_book);
    if (bookTarget == null) return;
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(ID_book){
    const bookTarget = findBook(ID_book);
    if (bookTarget == null) return;
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBookFromCompleted(ID_book){
    const bookTarget = findBookIndex(ID_book);
    if (bookTarget == -1) return;

    book.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function makeBook(bookObject){
    const {id, bookTitle, bookAuthor, bookYear, isComplete} = bookObject;

    const title = document.createElement('h2');
    title.classList.add('book-title');
    title.innerText = bookTitle;

    const author = document.createElement('p');
    author.classList.add('book-author');
    author.innerText = 'Penulis : ' + bookAuthor;

    const year = document.createElement('p');
    year.classList.add('book-year');
    year.innerText = 'Tahun Terbit : ' + bookYear;

    const container = document.createElement('div');
    container.classList.add('list-items');
    container.setAttribute('id',`book-${id}`);
    container.append(title, author, year);

    if (isComplete){
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn-delete');
        deleteButton.innerText = 'Hapus Buku';
        deleteButton.addEventListener('click', function(){
            removeBookFromCompleted(id);
        });

        const unreadButton = document.createElement('button');
        unreadButton.classList.add('btn-unread');
        unreadButton.innerText = 'Belum Baca';  
        unreadButton.addEventListener('click', function(){
            undoBookFromCompleted(id);
        });

        container.append(unreadButton, deleteButton);
    } else {
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn-delete');
        deleteButton.innerText = 'Hapus Buku';
        deleteButton.addEventListener('click', function(){
            removeBookFromCompleted(id);
        });

        const readButton = document.createElement('button');
        readButton.classList.add('btn-read');
        readButton.innerText = 'Sudah Baca';
        readButton.addEventListener('click', function(){
            addBookToCompleted(id);
        });

        container.append(readButton, deleteButton);
    }

    return container;
}

function addBook(){
    const generateId = generatedID();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const year = document.getElementById('year').value;
    const check = document.getElementById('checkbook');

    if (check.checked == true){
        const bookTarget = generateBookObject(generateId, title, author, year, true);
        book.push(bookTarget);
    } else {
        const bookTarget = generateBookObject(generateId, title, author, year, false);
        book.push(bookTarget);
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function searchBookTitle(){
    const search = document.getElementById('bookTitle').value;
    const unreadBook = document.getElementById('unreadBook');
    const readBook = document.getElementById('readBook');
    
    unreadBook.innerHTML = '';
    readBook.innerHTML = '';

    for (const bookIist of book){
        if (bookIist.bookTitle.toLowerCase().includes(search.toLowerCase())){
            const bookLibrary = makeBook(bookIist);
            if(bookIist.isComplete){
                readBook.append(bookLibrary);
            } else {
                unreadBook.append(bookLibrary);
            }
        }
    }
}

document.addEventListener(RENDER_EVENT, function(){
    const unreadBook = document.getElementById('unreadBook');
    const readBook = document.getElementById('readBook');
    unreadBook.innerHTML = '';
    readBook.innerHTML = '';

    for (const bookIist of book){
        const bookLibrary =  makeBook(bookIist);
        if (bookIist.isComplete){
            readBook.append(bookLibrary);
        } else {
            unreadBook.append(bookLibrary);
        }
    }
});

document.addEventListener('DOMContentLoaded', function(){
    const submitForm = document.getElementById('addBook');
    submitForm.addEventListener('submit', function(event){
        event.preventDefault();
        addBook();
        submitForm.reset();
    });

    const submitsearchForm = document.getElementById('searchBook');
    submitsearchForm.addEventListener('submit', function(event){
        event.preventDefault();
        searchBookTitle();
        submitsearchForm.reset();
    });

    if (isStorageExist()){
        loadDataFromStorage();
    }
});