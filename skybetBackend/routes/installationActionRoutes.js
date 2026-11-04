import express from 'express';
import upload from '../middlewares/upload.js';
import uploadVideo from '../middlewares/uploadVideo.js';
import {
  getStats,
  createStats,
  updateStats,
  deleteStats,
  getHeroAction,
  createHeroAction,
  updateHeroAction,
  deleteHeroAction,
  getGalleryImgs,
  addGalleryImg,
  updateGalleryImg,
  deleteGalleryImg,
  getVideoBanner,
  createVideoBanner,
  updateVideoBanner,
  deleteVideoBanner
} from '../controllers/installationActionController.js';

const router = express.Router();


// Stats CRUD
router.get('/stats', getStats);
router.post('/stats', createStats);
router.put('/stats', updateStats);
router.delete('/stats', deleteStats);

// HeroAction CRUD
router.get('/hero-action', getHeroAction);
router.post('/hero-action', upload.single('img'), createHeroAction);
router.put('/hero-action', upload.single('img'), updateHeroAction);
router.delete('/hero-action', deleteHeroAction);

// GalleryImgs CRUD
router.get('/gallery-imgs', getGalleryImgs);
router.post('/gallery-imgs', upload.single('img'), addGalleryImg);
router.put('/gallery-imgs/:imgId', upload.single('img'), updateGalleryImg);
router.delete('/gallery-imgs/:imgId', deleteGalleryImg);

// VideoBanner CRUD
router.get('/video-banner', getVideoBanner);
router.post('/video-banner', uploadVideo.single('video'), createVideoBanner);
router.put('/video-banner', uploadVideo.single('video'), updateVideoBanner);
router.delete('/video-banner', deleteVideoBanner);

export default router;
