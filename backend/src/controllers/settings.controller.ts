import { Request, Response, NextFunction } from 'express';
import * as settingsService from '../services/settings.service.js';

export async function getSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const settings = await settingsService.getSettings();
    res.json(settings);
  } catch (error) {
    next(error);
  }
}

export async function updateSettings(req: Request, res: Response, next: NextFunction) {
  try {
    const { reminderEnabled, reminderTime, darkMode, currency } = req.body;
    
    const settings = await settingsService.updateSettings({
      reminderEnabled,
      reminderTime,
      darkMode,
      currency,
    });
    
    res.json(settings);
  } catch (error) {
    next(error);
  }
}
