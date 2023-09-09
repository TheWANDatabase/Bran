import { Request, Response, Router } from "express";
import firebase from "../../utilities/firebase"
import { Timer } from "../../utilities/performance"
import { ApiError, CommonError } from "../../utilities/error";
import spec from "./profile.spec";
import { resolveCast } from "../../utilities/entities/cast";

interface PlayerRequestBody {
  id: string
}

function isValid(body: PlayerRequestBody | any): body is PlayerRequestBody {
  return body.id !== undefined
}

// For documentaion see POST.apiDoc near bottom of file
async function POST(req: Request, res: Response) {
  const timer = new Timer();

  try {
    if (isValid(req.body)) {
      let docuCol = await firebase.db.collection('episodes').doc(req.body.id);
      let docuRef = await docuCol.get();
      if (docuRef.exists) {
        let doc = docuRef.data();
        if (!doc) throw new Error("This error should be unreachable and is to satisfy the Typescript Compiler")
        let cast = await resolveCast(doc.cast);
        doc.cast = cast;
        doc.id = docuRef.id;
        doc.topics = (await docuCol.collection('topics').orderBy('start', 'asc').get()).docs.map((d) => d.data());
        doc.transcript = (await docuCol.collection('transcript').get()).docs.map((d) => d.data())[0];


        timer.resolve(req, res, doc);
      } else {
        timer.reject(req, res, new ApiError(CommonError.EpisodeNotRecognized, []), 404);
      }
    } else {
      timer.reject(req, res, new ApiError(CommonError.MissingRequiredField, []), 400);
    }
  } catch (e: unknown) {
    timer.reject(req, res, new ApiError(CommonError.GENERAL, e), 500);
  }
}



const router = Router();
router.post('/', POST);

export default {
  path: '/player',
  operations: spec,
  router
}