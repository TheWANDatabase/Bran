import v1 from './v1';
import { Router } from "express";

export const apiRouter = Router()


apiRouter.use(v1.path, v1.router)