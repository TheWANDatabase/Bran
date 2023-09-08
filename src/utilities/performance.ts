import { Request, Response } from "express";
import { ApiError } from "./error";

export class Timer {
  readonly start: number;

  constructor() {
    this.start = Date.now()
  }


  resolve(request: Request, response: Response, data: any, status: number = 200) {
    console.log(request.method, request.url)
    response.status(status).json({
      data,
      duration: Date.now() - this.start
    }).end()
  }

  reject(request: Request, response: Response, error: ApiError, status: number = 500) {
    console.log(request.method, request.url)
    response.status(status).json({
      error,
      duration: Date.now() - this.start
    }).end()
  }
}