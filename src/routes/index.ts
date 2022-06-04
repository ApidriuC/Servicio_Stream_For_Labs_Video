import { Router } from 'express';
import VideoRouter from './video.route';

const router = Router();
const prefix: string = '/api';

router.use(`${prefix}/video`, VideoRouter);

export default router;
