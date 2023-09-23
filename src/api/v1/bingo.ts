import { Request, Response, Router } from "express";
import { Timer } from "../../utilities/performance"
import { ApiError, CommonError } from "../../utilities/error";
import spec from "./profile.spec";
import { transmit } from "../../utilities/amqp";

let video: any = null;

interface RequestBody {
  tile: string
}

function isValid(body: RequestBody | any): body is RequestBody {
  return body.tile !== undefined
}

// For documentaion see POST.apiDoc near bottom of file
async function POST(req: Request, res: Response) {
  const timer = new Timer();

  try {
    if (isValid(req.body)) {
      video.tiles.push({
        // Tile name as seen in WSB
        name: req.body.tile,

        // Unix timestamp of tile confirmation (roughly)
        timestamp: Date.now(),

        // Relative timestamp of tile confirmation (for VOD playback later)
        relative: (Date.now() - video.startTime) / 1000
      })
      transmit('ui.notifications', '', JSON.stringify({
        "title": "Bingo Tile Confirmed",
        "description": req.body.tile,
        "avatar": {
          "src": "https://wanshow.bingo/resources/images/favicon-32x32.png"
        },
        "color": "green"
      }))
      timer.resolve(req, res, video)
    } else {
      timer.reject(req, res, new ApiError(CommonError.MissingRequiredField, []), 400);
    }
  } catch (e: unknown) {
    timer.reject(req, res, new ApiError(CommonError.GENERAL, e), 500);
  }
}

// For documentaion see POST.apiDoc near bottom of file
async function POST_START(req: Request, res: Response) {
  const timer = new Timer();

  try {
    video = {
      startTime: Date.now(),
      tiles: []
    };
    transmit('ui.notifications', '', JSON.stringify({
      "title": "Bingo Session Started",
      "description": "A new bingo session has been started!",
      "avatar": {
        "src": "https://wanshow.bingo/resources/images/favicon-32x32.png"
      },
      "color": "green"
    }))
    timer.resolve(req, res, video)
  } catch (e: unknown) {
    timer.reject(req, res, new ApiError(CommonError.GENERAL, e), 500);
  }
}
// For documentaion see POST.apiDoc near bottom of file
async function POST_STOP(req: Request, res: Response) {
  const timer = new Timer();

  try {
    transmit('ui.notifications', '', JSON.stringify({
      "title": "Bingo Session Finished",
      "description": "Sorry folks, the fun is over.",
      "avatar": {
        "src": "https://wanshow.bingo/resources/images/favicon-32x32.png"
      },
      "color": "red"
    }))
    timer.resolve(req, res, video)
  } catch (e: unknown) {
    timer.reject(req, res, new ApiError(CommonError.GENERAL, e), 500);
  }
}


const router = Router();
router.post('/confirm', POST);
router.post('/start', POST_START)
router.post('/stop', POST_STOP)

export default {
  path: '/bingo',
  operations: spec,
  router
}