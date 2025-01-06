import mongoose from "mongoose";

class DatabaseService {
    private static instance: typeof mongoose | null = null;

    static async connect() {
        if (!this.instance) {
            this.instance = await mongoose.connect(process.env.MONGODB_URI as string, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            } as mongoose.ConnectOptions );
        }
    }

    static async disconnect() {
        if (this.instance) {
            await mongoose.disconnect();
            this.instance = null;
        }
    }
}

export default DatabaseService;
