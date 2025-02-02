import mongoose from "mongoose"

export interface IForgotPassword {
  token: string
  email: string
  expires_at: Date
}

const ResetPasswordSchema = new mongoose.Schema<IForgotPassword>({
  token: { type: String, required: true },
  email: { type: String, required: true },
  expires_at: { type: Date, required: true }, // expires in 15min
})

export default mongoose.models.ResetPasswordSchema ||
  mongoose.model("ResetPasswordSchema", ResetPasswordSchema)
