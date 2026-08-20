import express from "express"
import cors from "cors"
import { errorHandler } from "./middleware/error.middleware"
import authRoutes from "./modules/auth/auth.routes"
import organisationRoutes from "./modules/organisation/organisation.routes"
import boardRoutes from "./modules/board/board.routes"
import { notFoundHandler } from "./middleware/notFound.middleware"
import cookieParser from "cookie-parser"
import { env } from "./config/env"
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: env.FRONTEND_URL.replace(/\/$/, ""),
    credentials: true,
  }),
)
// Routes
app.use("/api/auth", authRoutes)
app.use("/api/organisation",organisationRoutes)
app.use("/api/board", boardRoutes)
// Not found middleware
app.use(notFoundHandler)

// Error Handling Middleware
app.use(errorHandler)
export default app