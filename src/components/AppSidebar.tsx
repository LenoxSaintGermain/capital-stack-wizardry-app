
import React from 'react';
import { Home, Building, Target, BarChart, HardHat, Clipboard, Layers, DollarSign, Plane, Users, GitBranch, ScrollText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface NavigationSection {
  id: string;
  title: string;
  icon: typeof Home;
  icon Color?: string;
  adminOnly?: boolean;
}

interface AppSidebarProps {
  sections: NavigationSection[];
  isAdmin: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ sections, isAdmin }) => {
  const scrollToSection = (id: string) => {
    // Handle tab switching for main sections
    const tabButtons = document.querySelectorAll('[data-tab-id]');
    tabButtons.forEach(button => {
      if (button.getAttribute('data-tab-id') === id) {
        (button as HTMLButtonElement).click();
      }
    });

    // Also scroll to section if it exists
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Filter sections based on admin status
  const visibleSections = sections.filter(section => !section.adminOnly || isAdmin);
  const adminSections = sections.filter(section => section.adminOnly);
  const regularSections = sections.filter(section => !section.adminOnly);

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="p-4">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2 flex items-center">
            <Building className="w-6 h-6 mr-2" />
            Project Million
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Business Acquisition Platform
          </p>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {isAdmin && adminSections.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin Controls</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <SidebarMenuItem key={section.id}>
                      <SidebarMenuButton onClick={() => scrollToSection(section.id)}>
                        <Icon className={`w-4 h-4 ${section.iconColor || 'text-blue-500 dark:text-blue-400'}`} />
                        <span className="text-sm">
                          {section.title.split('. ')[1] || section.title}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
        
        <SidebarGroup>
          <SidebarGroupLabel>Investment Analysis</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {regularSections.map((section) => {
                const Icon = section.icon;
                return (
                  <SidebarMenuItem key={section.id}>
                    <SidebarMenuButton 
                      onClick={() => scrollToSection(section.id)}
                      className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Icon className={`w-4 h-4 ${section.iconColor || 'text-blue-500 dark:text-blue-400'}`} />
                      <span className="text-sm">
                        {section.title.split('. ')[1] || section.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <div className="p-4">
        <Card className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
            <strong>AI-Powered Analysis</strong><br />
            Enhanced with automation insights
          </p>
        </Card>
      </div>
    </Sidebar>
  );
};

export default AppSidebar;
