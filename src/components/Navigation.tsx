
import React from 'react';
import { Home, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface NavigationSection {
  id: string;
  title: string;
  icon: LucideIcon;
  iconColor?: string;
}

interface NavigationProps {
  sections: NavigationSection[];
}

const Navigation: React.FC<NavigationProps> = ({ sections }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="w-full lg:w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl p-6 sticky top-0 lg:h-screen overflow-y-auto z-50 flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center">
          <Home className="w-8 h-8 mr-3" />
          Investment Memo
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Navigate through sections
        </p>
      </div>
      
      <div className="space-y-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Button
              key={section.id}
              variant="ghost"
              className="w-full justify-start p-3 h-auto text-left hover:bg-blue-50 dark:hover:bg-blue-900/20 group transition-all duration-200"
              onClick={() => scrollToSection(section.id)}
            >
              <Icon className={`w-5 h-5 mr-3 ${section.iconColor || 'text-blue-500 dark:text-blue-400'} group-hover:scale-110 transition-transform`} />
              <span className="text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {section.title.split('. ')[1] || section.title}
              </span>
            </Button>
          );
        })}
      </div>
      
      <Card className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
          <strong>Dynamic Capital Stack</strong><br />
          Interactive model available in Section V
        </p>
      </Card>
    </nav>
  );
};

export default Navigation;
