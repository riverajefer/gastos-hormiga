import { Request, Response, NextFunction } from 'express';
import * as statsService from '../services/stats.service.js';

export async function getMonthlyStats(req: Request, res: Response, next: NextFunction) {
  try {
    const { year, month } = req.params;
    
    const stats = await statsService.getMonthlyStats(
      parseInt(year),
      parseInt(month)
    );
    
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

export async function getYearlyStats(req: Request, res: Response, next: NextFunction) {
  try {
    const { year } = req.params;
    
    const stats = await statsService.getYearlyStats(parseInt(year));
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

export async function getComparisonStats(req: Request, res: Response, next: NextFunction) {
  try {
    const { year, month } = req.query;
    
    const currentDate = new Date();
    const targetYear = year ? parseInt(year as string) : currentDate.getFullYear();
    const targetMonth = month ? parseInt(month as string) : currentDate.getMonth() + 1;
    
    const stats = await statsService.getComparisonStats(targetYear, targetMonth);
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

export async function getStatsByCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { year, month } = req.query;
    
    const currentDate = new Date();
    const targetYear = year ? parseInt(year as string) : currentDate.getFullYear();
    const targetMonth = month ? parseInt(month as string) : undefined;
    
    const stats = await statsService.getStatsByCategory(targetYear, targetMonth);
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

export async function getStatsByWeekday(req: Request, res: Response, next: NextFunction) {
  try {
    const { year, month } = req.query;
    
    const currentDate = new Date();
    const targetYear = year ? parseInt(year as string) : currentDate.getFullYear();
    const targetMonth = month ? parseInt(month as string) : undefined;
    
    const stats = await statsService.getStatsByWeekday(targetYear, targetMonth);
    res.json(stats);
  } catch (error) {
    next(error);
  }
}

export async function setBudget(req: Request, res: Response, next: NextFunction) {
  try {
    const { year, month, limit } = req.body;
    
    if (!year || !month || limit === undefined) {
      res.status(400).json({ error: 'Year, month, and limit are required' });
      return;
    }
    
    const budget = await statsService.setBudget(year, month, limit);
    res.json(budget);
  } catch (error) {
    next(error);
  }
}

export async function getBudget(req: Request, res: Response, next: NextFunction) {
  try {
    const { year, month } = req.params;
    
    const budget = await statsService.getBudget(
      parseInt(year),
      parseInt(month)
    );
    
    res.json(budget);
  } catch (error) {
    next(error);
  }
}
