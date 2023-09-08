import { Request, Response, Router } from "express";
import firebase from "../../utilities/firebase"
import { Timer } from "../../utilities/performance"
import { ApiError, CommonError } from "../../utilities/error";
import spec from "./profile.spec";

// For documentaion see POST.apiDoc near bottom of file
async function GET(req: Request, res: Response) {
  const timer = new Timer();

  try {
    let refs = await firebase.db.collection("banners")
      .where("expires", ">=", Date.now()/1000)
      .orderBy("expires", "asc")
      .get()
      
    let banners = refs.docs.map((m) => m.data())

    timer.resolve(req, res, banners)
  } catch (e: unknown) {
    timer.reject(req, res, new ApiError(CommonError.GENERAL, e), 500)
  }
}



const router = Router();
router.get('/', GET);

export default {
  path: '/banners',
  operations: spec,
  router
}