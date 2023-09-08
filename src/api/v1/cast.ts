import { Request, Response, Router } from "express";
import firebase from "../../utilities/firebase"
import { Timer } from "../../utilities/performance"
import { ApiError, CommonError } from "../../utilities/error";
import spec from "./profile.spec";
import { resolveCast } from "../../utilities/entities/cast";

// For documentaion see POST.apiDoc near bottom of file
async function GET(req: Request, res: Response) {
  const timer = new Timer();

  try {
    let refs = await firebase.db.collection("cast")
      .orderBy("priorit", "asc")
      .get()

    let c = await resolveCast(refs.docs.map((m) => m.id))

    timer.resolve(req, res, c)
  } catch (e: unknown) {
    timer.reject(req, res, new ApiError(CommonError.GENERAL, e), 500)
  }
}



const router = Router();
router.get('/', GET);

export default {
  path: '/cast',
  operations: spec,
  router
}