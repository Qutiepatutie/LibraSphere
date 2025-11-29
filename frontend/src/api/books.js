/* export async function getBooks({ generalSearch="", category=""}) {
    let url = "http://127.0.0.1:8000/books?";

    if (generalSearch) {
        url += `generalsearch=${encodeURIComponent(generalSearch)}`;
    } else if (category) {
        url += `category=${encodeURIComponent(category)}`;
    }

    const res = await fetch(url);

    if(!res.ok) {
        throw new Error("Failed to fetch books");
    }
    return await res.json();
} */

export async function getBooks() {
    const resp = await fetch("http://127.0.0.1:8000/getBooks/");

    if(!resp.ok){
        throw new Error("Failed to fetch Books");
    }

    const data = await resp.json();

    return data;
}

export async function editBook(data){
  const response = await fetch('http://127.0.0.1:8000/editBook/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  return await response.json();
}


export async function viewBookInfo(work_key) {
    const resp = await fetch(`http://127.0.0.1:8000/viewBook/?work_key=${work_key}`);

    if(!resp.ok){
        throw new Error("Failed to retrieve data");
    }

    const data = await resp.json();
    
    if(!data){
        return null;
    }

    return data;
}

export async function autofillBookInfo(isbn) {
    const resp = await fetch(`http://127.0.0.1:8000/autofill/?isbn=${isbn}`);

    if(!resp.ok){
        throw new Error("Failed to retrieve data");
    }

    const data = await resp.json();
    
    if(!data){
        return null;
    }

    return data;
}

export async function addBook(data){
  const response = await fetch('http://127.0.0.1:8000/addBook/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  return await response.json();
}

export async function borrowBook(data){
  const response = await fetch('http://127.0.0.1:8000/borrowBook/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  return await response.json();
}

export async function getUserBorrowedBooks(id) {
    const response = await fetch('http://127.0.0.1:8000/getUserBorrowedBooks/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(id)
  });

    return response.json();
}

export async function getAllBorrowedBooks() {
    const resp = await fetch("http://127.0.0.1:8000/getAllBorrowedBooks/");

    if(!resp.ok){
        throw new Error("Failed to fetch Books");
    }

    const data = await resp.json();

    return data;
}

export async function acceptBorrowedBook(isbn, call_num) {
    const resp = await fetch("http://127.0.0.1:8000/acceptBorrowedBook/" , {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({isbn, call_num})
    });

    const data = await resp.json();

    return data;
}

export async function returnBook(isbn, call_num) {
    const resp = await fetch("http://127.0.0.1:8000/returnBook/" , {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({isbn, call_num})
    });

    const data = await resp.json();

    return data;
}