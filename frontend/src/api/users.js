const API_URL = "https://librasphere-production.up.railway.app";

export async function login(email, pass) {
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

  if(!response.ok){
    return ({"status":"failed", "message":"Server Connection Error"});
  }

  const data = await response.json();
  return data;
}

export async function register(data){
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
}

export async function changePass(email, newPass){
  const response = await fetch(`${API_URL}/changePass/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email:email,
      newPass:newPass
    })
  });

  if(!response.ok){
    return ({"status":"failed","message":"Server Connection Error"});
  }

  return await response.json();
}
