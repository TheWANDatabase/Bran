import { Request, Response, Router } from "express";
import firebase from "../../utilities/firebase"
import { Timer } from "../../utilities/performance"
import { ApiError, CommonError } from "../../utilities/error";
import spec from "./profile.spec";

// For documentaion see POST.apiDoc near bottom of file
async function GET(req: Request, res: Response) {
  console.log(req.body);
  res.status(200).end();
}



const router = Router();
router.get('/', GET);

export default {
  path: '/ytnotif',
  operations: spec,
  router
}