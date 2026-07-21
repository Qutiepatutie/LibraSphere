const API_URL = import.meta.env.VITE_API_URL;

async function returnData(resp) {
    const data = await resp.json();
    const status = resp.status;

    return ({"status": status, "message": data.message, "data": data});
}

export async function login(email, pass) {
    try {
        const response = await fetch(`${API_URL}/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: pass
            })
        });

        return await returnData(response);
        
    } catch {
        return ({"status": 500, "message":"Server Connection Error"});
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
        
        return await returnData(response);

    } catch (error) {
        console.log(error);
        return ({"status": 500, "message":"Server Connection Error"});
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

        return await returnData(response);
        
    } catch {
        return ({"status": 500 ,"message":"Server Connection Error"});
    }
}