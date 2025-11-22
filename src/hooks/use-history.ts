"use client";

import { useState, useEffect, useCallback } from 'react';
import type { AnalysisResult } from '@/lib/types';

const HISTORY_KEY = 'resuai-history';

export function useHistory() {
  const [history, setHistory] = useState<AnalysisResult[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(HISTORY_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
      setHistory([]);
    }
    setIsLoaded(true);
  }, []);

  const addHistoryItem = useCallback((item: AnalysisResult) => {
    setHistory(prevHistory => {
      const newHistory = [item, ...prevHistory];
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      } catch (error) {
        console.error("Failed to save history to localStorage", error);
      }
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (error) {
      console.error("Failed to clear history from localStorage", error);
    }
  }, []);
  
  return { history, addHistoryItem, clearHistory, isLoaded };
}
