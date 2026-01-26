const API_URL = import.meta.env.VITE_API_URL;

export async function login(email, pass) {
    try {
        const response = await fetch(`${API_URL}/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            email: email,
            password: pass,
            }),
        });
    
        if(!response.ok) {
            return ({"status":"failed", "message":"Server Connection Error"});
        }

        return await response.json();

   } catch (error) {
        return ({"status":"failed", "message":"Server Connection Error"});
   }
}

export async function changePass(email, newPass){
    try {
        const response = await fetch(`${API_URL}/changePass/`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            email: email,
            newPass: newPass
            })
        });
    
        if(!response.ok) {
            return ({"status":"failed", "message":"Server Connection Error"});
        }
    
        return await response.json();

    } catch (error) {
        return ({"status":"failed", "message":"Server Connection Error"});
    }
}

export async function register(data){
    try {
        const response = await fetch(`${API_URL}/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
    
        if(!response.ok){
            return ({"status":"failed","message":"Server Connection Error"});
        }
    
        return await response.json();

    } catch (error) {
        return ({"status":"failed","message":"Server Connection Error"});
    }
}