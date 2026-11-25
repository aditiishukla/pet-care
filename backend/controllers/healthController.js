import HealthArticle from '../models/HealthArticle.js';
import asyncHandler from '../utils/asyncHandler.js';
import escapeRegex from '../utils/escapeRegex.js';

export const getArticles = asyncHandler(async (req, res) => {
  const { q, category } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (q && q.trim()) {
    const regex = new RegExp(escapeRegex(q.trim()), 'i');
    filter.$or = [{ title: regex }, { summary: regex }, { symptoms: regex }];
  }

  res.json(await HealthArticle.find(filter).sort({ title: 1 }));
});

export const getCategories = asyncHandler(async (req, res) => {
  res.json((await HealthArticle.distinct('category')).sort());
});

export const getArticleById = asyncHandler(async (req, res) => {
  const article = await HealthArticle.findById(req.params.id);
  if (!article) {
    res.status(404);
    throw new Error('Article not found');
  }
  res.json(article);
});