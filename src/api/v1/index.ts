import { Router } from "express";
import * as swagger from "swagger-ui-express";

import profile from "./profile";
import banners from "./banners";
import episodes from "./episodes";
import cast from "./cast";

const router = Router()

router.get('/', (_, res) => {
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

router.use('/api-docs', swagger.serve)
router.get('/api-docs', swagger.setup({
  openapi: "3.1.0",
  basePath: "/api/v1",
  info: {
    title: "The WAN Database API",
    version: "1.0.0",
  },
  definitions: {
    Todo: {
      type: "object",
      properties: {
        id: {
          type: "number",
        },
        message: {
          type: "string",
        },
      },
      required: ["id", "message"],
    },
  },
  paths: {
    '/profile': { ...profile.operations }
  },
}))

router.use(profile.path, profile.router);
router.use(banners.path, banners.router);
router.use(episodes.path, episodes.router);
router.use(cast.path, cast.router);

export default {
  path: '/v1',
  router
}