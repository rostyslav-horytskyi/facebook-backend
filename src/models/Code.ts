import mongoose, { Document, Schema, Model } from "mongoose";

const { ObjectId } = Schema;

interface ICode extends Document {
    code: string;
    user: mongoose.Types.ObjectId;
}

const codeSchema = new Schema<ICode>({
    code: {
        type: String,
        required: true,
    },
    user: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
});

const Code: Model<ICode> = mongoose.model<ICode>("Code", codeSchema);

export default Code;
