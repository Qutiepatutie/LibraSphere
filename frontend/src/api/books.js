const API_URL = import.meta.env.VITE_API_URL;

export async function autofillBookInfo(isbn) {
    try {
        const resp = await fetch(`${API_URL}/autofill/?isbn=${isbn}`);
    
        if(!resp.ok){
            return ({"status":"failed", "message":"Connection to Server Failed"});
        }
    
        return await resp.json();
    } catch(error) {
        return ({"status":"failed", "message":"Connection to Server Failed"});
    }
}

export async function addBook(data){
    try {
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
    } catch(error) {
        return ({"status":"failed", "message":"Connection to Server Failed"});
    }
}

export async function getBooks() {
    try {
        const resp = await fetch(`${API_URL}/getBooks/`);
    
        if(!resp.ok){
            return ({"status":"failed", "message":"Connection to Server Failed"});
        }
    
        return await resp.json();
    } catch(error) {
        return ({"status":"failed", "message":"Connection to Server Failed"});
    }
}

export async function editBook(data){
    try {
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
    } catch(error) {
        return ({"status":"failed", "message":"Connection to Server Failed"});
    }
}

export async function getAllBorrowers() {
    try {
        const resp = await fetch(`${API_URL}/getAllBorrowedBooks/`);
    
        if(!resp.ok){
            return ({"status":"failed", "message":"Connection to Server Failed"});
        }
    
        const data = await resp.json();
    
        return data;
    } catch(error) {
        return ({"status":"failed", "message":"Connection to Server Failed"});
    }
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
    try {
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
    } catch(error) {
        return ({"status":"failed", "message":"Connection to Server Failed"});
    }
}

export async function borrowBook(data){
    try {
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
    } catch(error) {
        return ({"status":"failed", "message":"Connection to Server Failed"});
    }
}