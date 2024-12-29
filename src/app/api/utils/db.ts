import mongoose from "mongoose";

class DatabaseService {
    private static connectionReady: boolean = false;

    static async connect(): Promise<void> {
        if (mongoose.connection.readyState >= 1 || this.connectionReady) {
            console.log("MongoDB connection already established.");
            return;
        }

        try {
            const url = process.env.MONGODB_URI as string;
            await mongoose.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            } as any);

            this.connectionReady = true;
            console.log("MongoDB connected successfully.");
        } catch (error: any) {
            console.error("MongoDB connection error:", error.message || 'Unknown error');
            throw error;
        }
    }

    static async disconnect(): Promise<void> {
        if (mongoose.connection.readyState === 0) {
            console.log("No active MongoDB connection to disconnect.");
            return;
        }

        try {
            await mongoose.disconnect();
            this.connectionReady = false;
            console.log("MongoDB disconnected successfully.");
        } catch (error: any) {
            console.error("MongoDB disconnection error:", error.message || 'Unknown error');
        }
    }
}

export default DatabaseService;