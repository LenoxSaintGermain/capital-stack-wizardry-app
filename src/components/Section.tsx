
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  icon: LucideIcon;
  iconColor?: string;
}

const Section: React.FC<SectionProps> = ({ 
  id, 
  title, 
  children, 
  icon: Icon, 
  iconColor = 'text-blue-500' 
}) => {
  return (
    <section id={id} className="mb-16 scroll-mt-20">
      <Card className="shadow-lg border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader className="pb-6">
          <CardTitle className="text-3xl font-bold flex items-center text-gray-800 dark:text-gray-100">
            {Icon && <Icon className={`w-8 h-8 mr-4 ${iconColor}`} />}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-gray-700 dark:text-gray-300">
          {children}
        </CardContent>
      </Card>
    </section>
  );
};

export default Section;
