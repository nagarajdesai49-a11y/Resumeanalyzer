"use client";

import { useHistory } from '@/hooks/use-history';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { History, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { AnalysisResult } from '@/lib/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface HistoryPanelProps {
  onSelectHistory: (item: AnalysisResult) => void;
}

const HistoryPanel = ({ onSelectHistory }: HistoryPanelProps) => {
  const { history, clearHistory, isLoaded } = useHistory();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1.5">
          <CardTitle>Analysis History</CardTitle>
          <CardDescription>View your past analyses.</CardDescription>
        </div>
        {history.length > 0 && (
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Clear history">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your analysis history.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearHistory} className="bg-destructive hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </CardHeader>
      <CardContent>
        {isLoaded && history.length > 0 ? (
          <ul className="space-y-2">
            {history.map((item) => (
              <li key={item.id}>
                <Button
                  variant="ghost"
                  className="h-auto w-full justify-start p-2 text-left"
                  onClick={() => onSelectHistory(item)}
                >
                  <History className="mr-3 h-4 w-4 flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="font-semibold">Analysis from</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-2 rounded-md border border-dashed p-8 text-center">
            <History className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Your analysis history will appear here.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HistoryPanel;
