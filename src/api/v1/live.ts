import { Request, Response, Router } from "express";
import firebase from "../../utilities/firebase"
import { Timer } from "../../utilities/performance"
import { ApiError, CommonError } from "../../utilities/error";
import spec from "./profile.spec";
import { floatplane_video, youtube_video, twitch_video } from "../../utilities/notifications";



// For documentaion see POST.apiDoc near bottom of file
async function GET_FLOATPLANE(req: Request, res: Response) {
  const timer = new Timer();

  try {
    timer.resolve(req, res, floatplane_video)
  } catch (e: unknown) {
    timer.reject(req, res, new ApiError(CommonError.GENERAL, e), 500)
  }
}

// For documentaion see POST.apiDoc near bottom of file
async function GET_YOUTUBE(req: Request, res: Response) {
  const timer = new Timer();

  try {
    timer.resolve(req, res, youtube_video)
  } catch (e: unknown) {
    timer.reject(req, res, new ApiError(CommonError.GENERAL, e), 500)
  }
}

// For documentaion see POST.apiDoc near bottom of file
async function GET_TWITCH(req: Request, res: Response) {
  const timer = new Timer();

  try {
    timer.resolve(req, res, twitch_video)
  } catch (e: unknown) {
    timer.reject(req, res, new ApiError(CommonError.GENERAL, e), 500)
  }
}

async function GET(req: Request, res: Response) {
  const timer = new Timer();

  try {
    timer.resolve(req, res, {
      youtube: youtube_video,
      floatplan: floatplane_video,
      twitch: twitch_video,
      internal: (await firebase.db.collection('live').doc('live').get()).data()
    })
  } catch (e: unknown) {
    timer.reject(req, res, new ApiError(CommonError.GENERAL, e), 500)
  }
}

const router = Router();
router.get('/floatplane', GET_FLOATPLANE);
router.get('/youtube', GET_YOUTUBE);
router.get('/twitch', GET_TWITCH);
router.get('/', GET)

export default {
  path: '/live',
  operations: spec,
  router
}