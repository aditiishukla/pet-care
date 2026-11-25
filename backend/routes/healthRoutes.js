import { Router } from 'express';
import { getArticles, getCategories, getArticleById } from '../controllers/healthController.js';

const router = Router();

router.get('/', getArticles);
router.get('/categories', getCategories); // must stay above '/:id'
router.get('/:id', getArticleById);

export default router;