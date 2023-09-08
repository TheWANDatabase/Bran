import { Request, Response, Router } from "express";
import firebase from "../../utilities/firebase"
import { Timer } from "../../utilities/performance"
import { ApiError, CommonError } from "../../utilities/error";
import spec from "./profile.spec";


// For documentaion see POST.apiDoc near bottom of file
async function POST(req: Request, res: Response) {
  const timer = new Timer();

  try {
    if ("id" in req.body) {
      let collection = firebase.db.collection('profiles');
      let ref = await collection.doc(req.body.id).get();
      let profile;
      if (!ref.exists) {
        let u = await firebase.auth.getUser(req.body.id);
        profile = {
          username: u.displayName || 'Name Unknown',
          avatar: u.photoURL || null,
          flags: {
            owner: false,
            isLMG: false,
            isParter: false,
            retired: false,
            earlyAccess: false
          },
          permissions: {
            owner: false,
            arbitrator: false,
            guildedEditor: false,
            editor: false,
            moderator: false,
            guest: true
          },
          partnership: null,
          banned: false,
          banExpires: null
        }
        await collection.doc(req.body.id).create(profile)

      } else {
        profile = ref.data()
      }

      if (profile) {
        timer.resolve(req, res, profile)
      } else {
        timer.reject(req, res, new ApiError(CommonError.ProfileCreationFailed), 500)
      }

    } else {
      timer.reject(req, res, new ApiError(CommonError.MissingRequiredField, { field: 'id', type: 'string' }), 400)
    }
  } catch (e: unknown) {
    timer.reject(req, res, new ApiError(CommonError.GENERAL, e), 500)
  }

}



const router = Router();
router.post('/', POST);

export default {
  path: '/profile',
  operations: spec,
  router
}