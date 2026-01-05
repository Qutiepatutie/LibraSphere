//const API_URL = "https://librasphere-production.up.railway.app"; // Online
const API_URL = "http://127.0.0.1:8000/"; // Local

export async function getBooks() {
    const resp = await fetch(`${API_URL}/getBooks/`);

    if(!resp.ok){
        return ({"status":"failed", "message":"Connection to Server Failed"});
    }

    return await resp.json();
}

export async function getUserBorrowedBooks(id) {
    const resp = await fetch(`${API_URL}/getUserBorrowedBooks/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(id)
  });

  if(!resp.ok){
        return ({"status":"failed", "message":"Connection to Server Failed"});
    }

    return await resp.json();
}

export async function getAllBorrowedBooks() {
    const resp = await fetch(`${API_URL}/getAllBorrowedBooks/`);

    if(!resp.ok){
        return ({"status":"failed", "message":"Connection to Server Failed"});
    }

    const data = await resp.json();

    return data;
}

export async function editBook(data){
  const resp = await fetch(`${API_URL}/editBook/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if(!resp.ok){
        return ({"status":"failed", "message":"Connection to Server Failed"});
  }

  return await resp.json();
}

export async function autofillBookInfo(isbn) {
    const resp = await fetch(`${API_URL}/autofill/?isbn=${isbn}`);

    if(!resp.ok){
        return ({"status":"failed", "message":"Connection to Server Failed"});
    }

    return await resp.json();
}

export async function addBook(data){
  const resp = await fetch(`${API_URL}/addBook/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if(!resp.ok){
        return ({"status":"failed", "message":"Connection to Server Failed"});
    }

  return await resp.json();
}

export async function borrowBook(data){
  const resp = await fetch(`${API_URL}/borrowBook/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if(!resp.ok){
        return ({"status":"failed", "message":"Connection to Server Failed"});
  }

  return await resp.json();
}

export async function acceptBorrowedBook(isbn, call_num) {
    const resp = await fetch(`${API_URL}/acceptBorrowedBook/` , {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({isbn, call_num})
    });

    if(!resp.ok){
        return ({"status":"failed", "message":"Connection to Server Failed"});
    }

    return await resp.json();
}

export async function returnBook(isbn, call_num) {
    const resp = await fetch(`${API_URL}/returnBook/` , {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
      },
      body: JSON.stringify({isbn, call_num})
    });

    if(!resp.ok){
        return ({"status":"failed", "message":"Connection to Server Failed"});
    }

    return await resp.json();
}