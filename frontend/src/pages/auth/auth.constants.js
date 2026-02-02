export const initialLoginCredentials = {
    email: "",
    pass: "",
};

export const initialForgotPassData = {
    email: "",
    newPass: "",
    confirmNewPass: "",
}

export const initialRegisterData = {
    first_name: "",
    middle_name: "",
    last_name: "",
    sex: "male",
    program: "",
    id_number: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "",
};

export const initialLoginErrors = {
    email: false,
    pass: false,
};

export const initialForgotPassErrors = {
    email: false,
    newPass: false,
    confirmPass: false,
}

export const initialRegisterErrors = {
    first_name: false,
    middle_name: false,
    last_name: false,
    program: false,
    id_number: false,
    email: false,
    password: false,
    confirm_password: false,
};

export const fieldsByPart = {
    1: ["first_name", "middle_name", "last_name"],
    2: ["program", "id_number"],
    3: ["email", "password", "confirm_password"],
};
