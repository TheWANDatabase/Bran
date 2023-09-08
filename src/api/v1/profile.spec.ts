// This file is dedicated to storing OpenAPI Spec information 
// about the routes described in a file named similarly
// Parent File: profile

export default {
  post: {
    summary: 'Fetch user profile by ID',
    operationId: 'fetchProfile',
    parameters: [
      {
        in: 'body',
        name: 'id',
        required: true,
        type: 'string'
      }

    ],
    requestBody: {
      description: 'user ID specifier',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              id: {
                type: 'string'
              }
            }
          }
        }
      }
    },
    responses: {
      '200': {
        description: 'Profile located',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {

              }
            }
          }
        }
      },
      '201': {
        description: 'Profile created - Only returned for a new user if their profile did not already get during authentication. Functionally the same as response code 200',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {

              }
            }
          }
        }
      },
      '401': {
        description: 'Malformed request',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string'
                    },
                    code: {
                      type: 'integer'
                    },
                    context: {
                      type: 'string|object|array'
                    }
                  }
                }
              }
            }
          }
        }
      },
      '404': {
        description: 'Profile not found not created'
      },
      '500': {
        description: 'Malformed request',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                error: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string'
                    },
                    code: {
                      type: 'integer'
                    },
                    context: {
                      type: 'object',
                      properties: {
                        field: {
                          type: 'string'
                        },
                        type: {
                          type: 'string'
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}