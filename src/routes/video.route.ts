import { NextFunction, Request, Response, Router } from "express";
import { IRoute } from "../interfaces";
import { VideoController } from "../controller";
import { isDefinedParamMiddleware } from "../middlewares";
import getAuthUserMiddleware from "../middlewares/getAuthUser";

/**
 *
 * Managament the routes of Video
 * @category Routes
 * @class VideoRouter
 * @implements {IRoute}
 */
class VideoRouter implements IRoute {
  public router = Router();

  public pathIdParam = "/:id";
  public pathAuthorParam = "/:author";

  constructor() {
    this.createRoutes();
  }

  createRoutes(): void {
    // list Videos
    this.router.get(
      this.pathAuthorParam,
      (req, res, next) => getAuthUserMiddleware(req, next),
      (req: Request, res: Response, next: NextFunction) =>
        VideoController.list(req, res, next)
    );

    // Share Video
    this.router.post(
      `/share${this.pathAuthorParam}`,
      isDefinedParamMiddleware("params", "author"),
      (req: Request, res: Response, next: NextFunction) =>
        VideoController.shareVideoWithUser(req, res, next)
    );

    this.router.get(
      `/download${this.pathIdParam}`,
      isDefinedParamMiddleware(),
      (req: Request, res: Response, next: NextFunction) =>
        VideoController.download(req, res, next)
    );

    // Remove Video synced
    this.router.delete(
      `/sync${this.pathAuthorParam}`,
      isDefinedParamMiddleware("params", "author"),
      (req: Request, res: Response, next: NextFunction) =>
        VideoController.removeVideoSyncedByPath(req, res, next)
    );

    // Remove Video
    this.router.delete(
      `${this.pathAuthorParam}`,
      isDefinedParamMiddleware("params", "author"),
      (req: Request, res: Response, next: NextFunction) =>
        VideoController.removeById(req, res, next)
    );
  }
}
export default new VideoRouter().router;
