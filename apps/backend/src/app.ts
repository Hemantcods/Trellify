import express from "express"
import { errorHandler } from "./middleware/error.middleware"
import authRoutes from "./modules/auth/auth.routes"
import { notFoundHandler } from "./middleware/notFound.middleware"
import cookieParser from "cookie-parser"
const app = express()
app.use(express.json())
app.use(cookieParser())
// Routes
app.use("/api/auth", authRoutes)

// Not found middleware
app.use(notFoundHandler)

// Error Handling Middleware
app.use(errorHandler)
export default app