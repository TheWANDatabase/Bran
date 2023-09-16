import { Router } from "express";
import * as swagger from "swagger-ui-express";

import profile from "./profile";
import banners from "./banners";
import episodes from "./episodes";
import cast from "./cast";
import player from "./player";
import search from "./search";

const router = Router()

router.get('/', (_: any, res: any) => {
  res.json({
    notes: "This endpoint is an index endpoint, it does not serve any purpose except metadata dissemination",
    metadata: {
      apiVersion: '1.0.0',
      retiring: false,
      messages: [
        {
          message: 'This API version is unfinished, and likely won\'t be ready for production for a while'
        }
      ]
    }
  })
})

router.use('/swagger', swagger.serve)
router.get('/swagger', swagger.setup({
  openapi: "3.1.0",
  basePath: "/api/v1",
  info: {
    title: "The WAN Database API",
    version: "1.0.0",
  },
  paths: {
    '/profile': { ...profile.operations },
    '/banners': { ...banners.operations },
    '/episodes': { ...episodes.operations },
    '/cast': { ...cast.operations },
    '/player': { ...player.operations }
  },
}))

router.use(profile.path, profile.router);
router.use(banners.path, banners.router);
router.use(episodes.path, episodes.router);
router.use(cast.path, cast.router);
router.use(player.path, player.router);
router.use(search.path, search.router);

export default {
  path: '/v1',
  router
}