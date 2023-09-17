import { Request, Response, Router } from "express";
import firebase from "../../utilities/firebase"
import { Timer } from "../../utilities/performance"
import { ApiError, CommonError } from "../../utilities/error";
import spec from "./profile.spec";

interface SearchRequestBody {
  episodes: string[]
}

function isValid(body: SearchRequestBody | any): body is SearchRequestBody {
  return body.episodes !== undefined
}

// For documentaion see POST.apiDoc near bottom of file
async function POST(req: Request, res: Response) {
  const timer = new Timer();

  try {
    if (isValid(req.body)) {
      let x: any = {};
      let core: string[] = [];
      
      while (req.body.episodes.length > 0) {
        core.push(req.body.episodes.pop() || '');
        if (core.length > 20) {
          let docs = await filterBy(core);

          for (let i = 0; i < docs.length; i++) {
            x[docs[i].id] = docs[i]
          }

          core = []
        }
      }

      if (core.length > 0) {
        let docs = await filterBy(core);

        for (let i = 0; i < docs.length; i++) {
          x[docs[i].id] = docs[i]
        }
      }

      timer.resolve(req, res, x);
    } else {
      timer.reject(req, res, new ApiError(CommonError.MissingRequiredField, []), 400);
    }
  } catch (e: unknown) {
    timer.reject(req, res, new ApiError(CommonError.GENERAL, e), 500);
  }
}


async function filterBy(ids: string[]) {
  let ref = await firebase.db.collection('episodes')
    .where('__name__', 'in', ids)
    .get();
  return ref.docs.map((d: any) => {
    return {
      id: d.id,
      ...d.data()
    }
  })
}


const router = Router();
router.post('/', POST);

export default {
  path: '/search',
  operations: spec,
  router
}