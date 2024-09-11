import jwt from "jsonwebtoken";

export const generateToken = (payload: {id: string}, expires: string) => {
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: expires });
};
