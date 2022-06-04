/* eslint-disable class-methods-use-this */
import { ICrud, IVideo} from '../interfaces';
import { VideoRepository } from '../repository';
import { Video } from '../models';

/**
 *
 * The Video service,layer of repository pattern
 * @category Services
 * @class VideoService
 * @implements {ICrud<IVideo, string>}
 */
class VideoService implements ICrud<IVideo, string> {
  /**
   *
   * Create a Video
   * @param {IVideo} Video - The Video to create
   * @return {Promise<IVideo>}  A Video created
   * @memberof VideoService
   */
  async create(Video: IVideo): Promise<IVideo> {
    return VideoRepository.create(Video);
  }

  /**
   *
   * List all Video
   * @return {Promise<Array<IVideo>>}  A list of tasks
   * @memberof VideoService
   */
  async list(): Promise<Array<IVideo>> {
    return VideoRepository.list();
  }


 /**
   *
   * Find by path a Video
   * @param {string} path - The path to find
   * @return {Promise<IVideo>}  A Video
   */
  async getByPath(path: string): Promise<IVideo| null> {
    return VideoRepository.getByPath(path);
  }

     /**
   *
   * Remove by path a video synced
   * @param {string} path - The path to find
   * @return {Promise<IVideo>}  A Video removed
   * @memberof FileService
   */
      async removeByPath(path: string): Promise<IVideo| null> {
        const taskToDelete = await this.getByPath(path);
        if (taskToDelete) await taskToDelete.remove();
        return taskToDelete;
      }

  /**
   *
   * Find by id a Video
   * @param {string} id - The id to find
   * @return {Promise<IVideo>}  A Video
   * @memberof VideoService
   */
  async getById(id: string): Promise<IVideo| null> {
    return VideoRepository.getById(id);
  }

  /**
   *
   * Remove a Video
   * @param {IVideo} Video - The Video to remove
   * @return {Promise<IVideo>}  A Video removed
   * @memberof VideoService
   */
  async remove(Video: IVideo): Promise<IVideo> {
    return VideoRepository.remove(Video);
  }

  /**
   *
   * Remove by id a Video
   * @param {string} id - The id to find
   * @return {Promise<IVideo>}  A Video removed
   * @memberof VideoService
   */
  async removeById(id: string): Promise<IVideo| null> {
    const taskToDelete = await this.getById(id);
    if (taskToDelete) await taskToDelete.remove();
    return taskToDelete;
  }

  /**
   *
   * Update a Video
   * @param {IVideo} Video - The Video to updated
   * @return {Promise<IVideo>}  A Video updated
   * @memberof VideoService
   */
  async update(Video: IVideo): Promise<IVideo> {
    return VideoRepository.update(Video);
  }

  /**
   *
   * Update by id a Video
   * @param {string} id - The id to find
   * @param {IVideo} Video - The Video to updated
   * @return {Promise<IVideo>} A Video updated
   * @memberof VideoService
   */
  async updateById(id: string, body: Object): Promise<IVideo| null > {
    // eslint-disable-next-line no-unused-vars
    return new Promise<IVideo| null>((resolve, _) => {
      Video.findOneAndUpdate({ _id: id }, { ...body }, { new: true },
        (error, task: IVideo| null) => resolve(task));
    });
  }

  async getVideos(author: string): Promise<Array<IVideo>> {
    return VideoRepository.getVideos(author);
  }

  async getShareVideos(author: string): Promise<Array<IVideo>> {
    return VideoRepository.getSharedVideos(author);
  }

   /**
   *
   *
   * @return {Promise<IVideo>} Share Video with a user
   * @memberof VideoService
   */
    async shareVideoWithUser(userToShare: string, _id: String): Promise<IVideo | null> {
      return VideoRepository.shareVideoWithUser(userToShare, _id)
    }
}

export default new VideoService();
