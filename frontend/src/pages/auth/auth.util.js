export function checkEmail(registerData) {

    if(!registerData.email.includes("fatima.edu.ph")){
        return { valid : false };
    }
    
    const first = registerData.first_name.toLowerCase().charAt(0);
    const second = (registerData.middle_name) ? registerData.middle_name.toLowerCase().charAt(0) : "";
    const last = registerData.last_name.toLowerCase();
   
    let role = "";
    let email = "";

    if(registerData.email.includes("student.fatima.edu.ph")){
        const num = registerData.student_number.substring(7);
        email = `${first}${second}${last}${num}lag@student.fatima.edu.ph`;
        role = "student";

    }else{
        email = `${first}${last}@fatima.edu.ph`; 
        role = "faculty";
    }

    if(registerData.email !== email) {
        return { valid : false };
    }

    return ({ valid: true, role: role, email: email });
}