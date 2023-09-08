import { Request, Response, Router } from "express";
import firebase from "../../utilities/firebase"
import { Timer } from "../../utilities/performance"
import { ApiError, CommonError } from "../../utilities/error";
import spec from "./profile.spec";
import { resolveCast } from "../../utilities/entities/cast";

interface EpisodePostRequestBody {
  limit: number;
  offset: number;
  filters: {
    startDate: string;
    endDate: string;
    hideCW: boolean;
    hideCorrupt: boolean;
    members: Array<string>;
    order: {
      id: string;
      label: string;
    }
  }
}

function isValid(body: EpisodePostRequestBody | any): body is EpisodePostRequestBody {
  return body.filters.order.label !== undefined
}

// For documentaion see POST.apiDoc near bottom of file
async function POST(req: Request, res: Response) {
  const timer = new Timer();

  try {
    if (isValid(req.body)) {
      let collection = firebase.db.collection('episodes');
      let query = collection
        .where('aired', '!=', null)
        .where('aired', '>=', new Date(req.body.filters.startDate).toISOString())
        .where('aired', '<=', new Date(req.body.filters.endDate).toISOString())

      if (req.body.filters.members.length > 0) {
        query = query.where('cast', 'array-contains-any', req.body.filters.members)
      }

      if (req.body.filters.hideCW) query = query.where('flags.cw', '==', false)
      if (req.body.filters.hideCorrupt) query = query.where('flags.corrupt', '==', false)

      switch (req.body.filters.order.id) {
        case 'release':
          query = query.orderBy('aired', 'asc')
          break
        case 'release-desc':
          query = query.orderBy('aired', 'desc')
          break
        case 'title':
          query = query.orderBy('title', 'asc')
          break
        case 'title-desc':
          query = query.orderBy('title', 'desc')
          break
        case 'duration':
          query = query.orderBy('duration', 'asc')
          break
        case 'duration-desc':
          query = query.orderBy('duration', 'desc')
          break
      }

      let q2 = query;

      query = query.limit(req.body.limit)
        .offset(req.body.offset)

      let ref = await query.get();
      let ref2 = await q2.count().get();
      let results: any = ref.docs.map((m) => {
        return {
          id: m.id,
          ...m.data()
        }
      });

      for (let i = 0; i < results.length; i++) {
        let ep = results[i];
        let cast = await resolveCast(ep.cast);
        ep.cast = cast;
        results[i] = ep
      }
      
      timer.resolve(req, res, {
        episodes: results,
        stats: ref2.data().count
      })
    } else {
      timer.reject(req, res, new ApiError(CommonError.MissingRequiredField, []), 400)
    }
  } catch (e: unknown) {
    timer.reject(req, res, new ApiError(CommonError.GENERAL, e), 500)
  }

}



const router = Router();
router.post('/', POST);

export default {
  path: '/episodes',
  operations: spec,
  router
}