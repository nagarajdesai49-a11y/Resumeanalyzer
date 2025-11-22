import { FileText } from 'lucide-react';
import type { FC } from 'react';

const Header: FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-14 max-w-7xl items-center">
        <div className="flex items-center">
          <FileText className="h-6 w-6 text-primary" />
          <h1 className="ml-3 text-2xl font-bold tracking-tight text-foreground">
            ResuAI
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
