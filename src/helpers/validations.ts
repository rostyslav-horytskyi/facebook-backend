import User from "../models/User";

export const validateEmail = (email: string) => {
    return String(email)
        .toLowerCase()
        .match(/^([a-z\d\.-]+)@([a-z\d-]+)\.([a-z]{2,12})(\.[a-z]{2,12})?$/);
};

export const validateLength = (text: string, min: number, max: number) => {
    if (text.length > max || text.length < min) {
        return false;
    }
    return true;
};

export const validateUsername = async (username: string) => {
    let a = false;

    do {
        let check = await User.findOne({ username });

        if (check) {
            username += (+new Date() * Math.random()).toString().substring(0, 1);
            a = true;
        } else {
            a = false;
        }
    } while (a);
    return username;
};
