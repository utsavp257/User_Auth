import mongoose from "mongoose";

const connect = async () => {
    try {
        console.log("attempting to connect to db");
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log("Connected to db");
    } catch (error) {
        console.log("Failed to connect to db", error.message);
        process.exit(1);
    }
};

export default connect;