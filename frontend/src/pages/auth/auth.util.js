export function checkEmail(registerData) {

    if(!registerData.email.endsWith("fatima.edu.ph")){
        return { valid : false };
    }
    
    const first = registerData.first_name.toLowerCase().charAt(0);
    const second = (registerData.middle_name) ? registerData.middle_name.toLowerCase().charAt(0) : "";
    const last = registerData.last_name.toLowerCase();
   
    let role = "";
    let email = "";

    if(registerData.email.endsWith("@student.fatima.edu.ph")){
        const num = registerData.id_number.substring(7);
        email = `${first}${second}${last}${num}lag@student.fatima.edu.ph`;
        role = "student";

    }else if(registerData.email.endsWith("@fatima.edu.ph")){
        email = `${first}${last}@fatima.edu.ph`; 
        role = "faculty";
    }

    if(registerData.email !== email) {
        return { valid : false };
    }

    return ({ valid: true, role: role, email: email });
}

export function logout() {
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = "/";
}

export function getStorage() {
    return localStorage.getItem("access")
        ? localStorage
        : sessionStorage;
}

export function getAccessToken() {
    return getStorage().getItem("access");
}

export function getRefreshToken() {
    return getStorage().getItem("refresh");
}

export async function restoreSession() {
    const API_URL = import.meta.env.VITE_API_URL;
    
    const refresh = getRefreshToken();

    if (!refresh) {
        return false;
    }

    const refreshResponse = await fetch(`${API_URL}/token/refresh/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            refresh,
        })
    });

    if (!refreshResponse.ok) {
        logout();
        return false;
    }

    const data = await refreshResponse.json();

    getStorage().setItem("access", data.access);

    return true;
}