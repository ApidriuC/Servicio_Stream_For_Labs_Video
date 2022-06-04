/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import { NextFunction, Response, Request } from "express";
import { IVideo } from "../interfaces";
import { HttpException } from "../exceptions";
import { VideoService } from "../services";
import path from "path";
import fs from "fs";
import { decryptVideo } from "../utils/encrypt";
var stream = require('stream');

/**
 *
 * The Videocontroller
 * @category Controllers
 * @class VideoController
 */
class VideoController {
  /**
   *
   * List all Videos
   * @static
   * @param {Request} req - The request
   * @param {Response} res - The response
   * @param {NextFunction} next - The next middleware in queue
   * @return {JSON} - A list of Videos
   * @memberof VideoController
   */
  public static async list(req: Request, res: Response, next: NextFunction) {
    try {
      const author = req.params.author;
      const ownVideos: Array<IVideo> = await VideoService.getVideos(author);
      const sharedVideos: Array<IVideo> = await VideoService.getShareVideos(
        author
      );
      res.json([...ownVideos, ...sharedVideos]);
    } catch (error) {
      console.log("Lis error: ", error);
      
      return next(new HttpException(error.status || 500, error.message));
    }
  }

  /**
   *
   * Share Video
   * @static
   * @param {Request} req - The request
   * @param {Response} res - The response
   * @param {NextFunction} next - The next middleware in queue
   * @return {Number} - A status request
   * @memberof VideoController
   */
  public static async shareVideoWithUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { videoId, userToShareId } = req.body;
      const { author } = req.params;
      const VideoShared: IVideo | null = await VideoService.shareVideoWithUser(
        userToShareId,
        videoId
      );

      if (!VideoShared) throw new HttpException(404, "Video not found");
      if (author != VideoShared?.author)
        throw new HttpException(403, "Forbidden");

      res.sendStatus(200);
    } catch (error) {
      return next(new HttpException(error.status || 500, error.message));
    }
  }

  public static async download(req: any, res: Response, next: NextFunction) {
    try {
      // Ensure there is a range given for the video
      const range = req.headers.range;

      const { id } = req.params;
      const video: IVideo | null = await VideoService.getById(id);

      if (!video) throw new HttpException(404, "Video not found");

      const location = video.path;
      decryptVideo(location, range, res);

    } catch (error) {
      return next(new HttpException(error.status || 500, error.message));
    }
  }


/**
   *
   * Remove Video synced by id 
   * @static
   * @param {Request} req - The request
   * @param {Response} res - The response
   * @param {NextFunction} next - The next middleware in queue
   * @return {JSON} - A Video removed
   * @memberof VideoController
   */
 public static async removeVideoSyncedByPath(req: Request, res: Response, next: NextFunction) {
  try {
    const {author } = req.params;
    const { pathToRemove } = req.body
    
      const file: IVideo | null = await VideoService.removeByPath(pathToRemove);
      if (!file) throw new HttpException(404, 'Video not found');
      if( author != file.author) throw new HttpException(403, 'Forbidden: The file is not his authorship.');
      console.log(`Video ${file.name} deleted`);
      res.sendStatus(200)
  } catch (error) {
    console.log(error);
    return next(new HttpException(error.status || 500, error.message));
  }
}

  /**
   *
   * Remove Video by id
   * @static
   * @param {Request} req - The request
   * @param {Response} res - The response
   * @param {NextFunction} next - The next middleware in queue
   * @return {JSON} - A list of VideoS
   * @memberof VideoController
   */
  public static async removeById(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { author } = req.params;
      const VideosToRemove = req.body.files;
      console.log("Videos received: ", VideosToRemove);

      // If have one Videoto remove
      if (VideosToRemove.length === 1) {
        const id = VideosToRemove[0];
        const Video: IVideo | null = await VideoService.removeById(id);
        if (!Video) throw new HttpException(404, "Videonot found");
        if (author != Video.author)
          throw new HttpException(
            403,
            "Forbidden: The Videois not his authorship."
          );

        const location = Video.path;
        fs.unlinkSync(path.resolve(location));
        console.log(`Video${Video.name} deleted`);
      } else {
        // If have multiple Videos to remove
        VideosToRemove.forEach(async (VideoId: string) => {
          const Video: IVideo | null = await VideoService.removeById(VideoId);
          if (!Video) throw new HttpException(404, "Videonot found");
          if (author != Video.author)
            throw new HttpException(
              403,
              "Forbidden: The Videois not his authorship."
            );

          const location = Video.path;
          fs.unlinkSync(path.resolve(location));
          console.log(`Video${Video.name} deleted`);
        });
      }

      res.sendStatus(200);
    } catch (error) {
      return next(new HttpException(error.status || 500, error.message));
    }
  }
}
export default VideoController;
