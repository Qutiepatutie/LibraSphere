const API_URL = "https://librasphere-production.up.railway.app";

export async function getBooks() {
    const resp = await fetch(`${API_URL}/getBooks/`);

    if(!resp.ok){
        throw new Error("Failed to fetch Books");
    }

    const data = await resp.json();

    return data;
}

export async function editBook(data){
  const response = await fetch(`${API_URL}/editBook/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  return await response.json();
}


/* export async function viewBookInfo(work_key) {
    const resp = await fetch(`${API_URL}/viewBook/?work_key=${work_key}`);

    if(!resp.ok){
        throw new Error("Failed to retrieve data");
    }

    const data = await resp.json();
    
    if(!data){
        return null;
    }

    return data;
} */

export async function autofillBookInfo(isbn) {
    const resp = await fetch(`${API_URL}/autofill/?isbn=${isbn}`);

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
  const response = await fetch(`${API_URL}/addBook/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  return await response.json();
}

export async function borrowBook(data){
  const response = await fetch(`${API_URL}/borrowBook/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  return await response.json();
}

export async function getUserBorrowedBooks(id) {
    const response = await fetch(`${API_URL}/getUserBorrowedBooks/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(id)
  });

    return response.json();
}

export async function getAllBorrowedBooks() {
    const resp = await fetch(`${API_URL}/getAllBorrowedBooks/`);

    if(!resp.ok){
        throw new Error("Failed to fetch Books");
    }

    const data = await resp.json();

    return data;
}

export async function acceptBorrowedBook(isbn, call_num) {
    const resp = await fetch(`${API_URL}/acceptBorrowedBook/` , {
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
    const resp = await fetch(`${API_URL}/returnBook/` , {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({isbn, call_num})
    });

    const data = await resp.json();

    return data;
}