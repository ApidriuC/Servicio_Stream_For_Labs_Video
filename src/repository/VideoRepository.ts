/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import { ICrud, IVideo } from '../interfaces';
import { Video } from '../models';
import mongoose from 'mongoose'
/**
 *
 * The Video repository 
 * @category Repositorys
 * @class VideoRepository
 * @implements {ICrud<IVideo, string>}
 */
class VideoRepository implements ICrud<IVideo, string> {
  /**
   *
   *
   * @param {IVideo} Video - The Video to create
   * @return {Promise<IVideo>}  A Video created
   * @memberof VideoRepository
   */
  async create(Video: IVideo): Promise<IVideo> {
    return Video.save();
  }

  /**
   *
   *
   * @return {Promise<Array<IVideo>>}  A list of Videos
   * @memberof VideoRepository
   */
  async list(): Promise<Array<IVideo>> {
    return Video.find({});
  }

  /**
   *
   *
   * @param {string} id - The id to find
   * @return {Promise<IVideo>}  A Video
   * @memberof VideoRepository
   */
  async getById(id: string): Promise<IVideo | null> {
    return Video.findById(id);
  }

  /**
   *
   *
   * @param {IVideo} Video - The Video to remove
   * @return {Promise<IVideo>}  A Video removed
   * @memberof VideoRepository
   */
  async remove(Video: IVideo): Promise<IVideo> {
    if (Video._id) await Video.remove();
    return Video;
  }

  /**
   *
   *
   * @param {string} id - The id to find
   * @return {Promise<IVideo>}  A Video removed
   * @memberof VideoRepository
   */
  async removeById(id: string): Promise<IVideo | null> {
    const VideoToDelete = await this.getById(id);
    if (VideoToDelete) await VideoToDelete.remove();
    return VideoToDelete;
  }


 /**
   *
   *
   * @param {string} path - The path to find
   * @return {Promise<IVideo>}  A Video
   * @memberof Videoepository
   */
  async getByPath(path: string): Promise<IVideo | null> {
    return Video.findOne({ path });
  }

  /**
   *
   *
   * @param {IVideo} Video - The Video to updated
   * @return {Promise<IVideo>}  A Video updated
   * @memberof VideoRepository
   */
  async update(Video: IVideo): Promise<IVideo> {
    if (Video._id) await Video.update();
    return Video;
  }

  /**
   *
   *
   * @param {string} id - The id to find
   * @param {IVideo} Video - The Video to updated
   * @return {Promise<IVideo>} A Video updated
   * @memberof VideoRepository
   */
  async updateById(id: string, Video: IVideo):
  Promise<IVideo | null > {
    const VideoToUpdate = await this.getById(id);
    if (VideoToUpdate) {
      VideoToUpdate.name = Video.name;
      VideoToUpdate.path = Video.path;
      VideoToUpdate.weight = Video.weight;
      VideoToUpdate.upload_at = Video.upload_at;
      VideoToUpdate.author = Video.author;
      VideoToUpdate.shared_users = Video.shared_users;
      await VideoToUpdate.update();
    }
    return VideoToUpdate;
  }

   /**
   *
   *
   * @return {Promise<Array<IVideo>>} List of shared Videos
   * @memberof VideoRepository
   */
  async getSharedVideos(user: string): Promise<Array<IVideo>> {
    return Video.find({ shared_users: new mongoose.Types.ObjectId(user) }).populate('author');
  }

  /**
   *
   *
   * @return {Promise<Video>} Share Video with a user
   * @memberof VideoRepository
   */
   async shareVideoWithUser(userToShare: string, _id: String): Promise<IVideo | null> {
    return Video.findByIdAndUpdate(_id, { $addToSet: { shared_users: new mongoose.Types.ObjectId(userToShare)} })
  }

  /**
   *
   *
   * @return {Promise<Array<Video>>} List videos
   * @memberof VideoRepository
   */
  async getVideos(author: string): Promise<Array<IVideo>> {
    return Video.find({ author });
  }
}
export default new VideoRepository();
