import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Clock,
  Star,
  TrendingUp,
  Building,
  User,
  Search,
  Filter,
  Plus,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Users
} from 'lucide-react';
import { loadManusConsolidatedData } from '@/utils/manusDataAdapter';

interface Contact {
  id: string;
  type: 'broker' | 'seller';
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  location?: string;
  source?: string;
  status?: string;
  priority?: string;
  specialization?: string;
  last_contact?: string;
  next_follow_up?: string;
  notes?: string;
}

interface Opportunity {
  id: string;
  business_name: string;
  asking_price: number;
  cash_flow?: number;
  revenue?: number;
  location?: string;
  sector: string;
  source?: string;
  score?: number;
  stage?: string;
  probability?: number;
  status?: string;
  notes?: string;
}

export default function CRMPipeline() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'broker' | 'seller'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'high' | 'medium' | 'low'>('all');

  useEffect(() => {
    loadCRMData();
  }, []);

  const loadCRMData = async () => {
    try {
      setLoading(true);
      const manusData = await loadManusConsolidatedData();
      setContacts(manusData.crm_data.contacts || []);
      // Transform opportunities to match interface
      const transformedOpportunities = (manusData.business_opportunities.opportunities_pipeline || []).map(opp => ({
        ...opp,
        business_name: opp.business_name || opp.title || 'Unnamed Business'
      }));
      setOpportunities(transformedOpportunities);
    } catch (error) {
      console.error('Error loading CRM data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || contact.type === filterType;
    const matchesPriority = filterPriority === 'all' || contact.priority === filterPriority;
    
    return matchesSearch && matchesType && matchesPriority;
  });

  const getContactInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-purple-100 text-purple-800';
      case 'qualified': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const isOverdue = (date?: string) => {
    if (!date) return false;
    return new Date(date) < new Date();
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CRM Pipeline
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage contacts and track deal progression
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filter
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Contact
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              Total Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contacts.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {contacts.filter(c => c.type === 'broker').length} brokers, {contacts.filter(c => c.type === 'seller').length} sellers
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building className="h-4 w-4 text-green-600" />
              Active Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{opportunities.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatCurrency(opportunities.reduce((sum, opp) => sum + opp.asking_price, 0))} total value
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              Follow-ups Due
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.next_follow_up && isOverdue(c.next_follow_up)).length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Overdue contacts requiring attention
            </p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Star className="h-4 w-4 text-purple-600" />
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contacts.filter(c => c.priority === 'high').length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              High-priority contacts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="contacts" className="space-y-6">
        <TabsList>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="contacts" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="broker">Brokers</SelectItem>
                <SelectItem value="seller">Sellers</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={(value: any) => setFilterPriority(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Contacts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContacts.map((contact) => (
              <Card key={contact.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{getContactInitials(contact.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{contact.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1">
                          {contact.type === 'broker' ? <Building className="h-3 w-3" /> : <User className="h-3 w-3" />}
                          {contact.title || contact.type}
                        </CardDescription>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Contact Info */}
                  <div className="space-y-2 text-sm">
                    {contact.company && (
                      <div className="flex items-center gap-2">
                        <Building className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate">{contact.company}</span>
                      </div>
                    )}
                    {contact.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate">{contact.location}</span>
                      </div>
                    )}
                    {contact.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="truncate text-blue-600">{contact.email}</span>
                      </div>
                    )}
                    {contact.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span>{contact.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {contact.priority && (
                      <Badge variant="outline" className={getPriorityColor(contact.priority)}>
                        {contact.priority}
                      </Badge>
                    )}
                    {contact.status && (
                      <Badge className={getStatusColor(contact.status)}>
                        {contact.status}
                      </Badge>
                    )}
                  </div>

                  {/* Follow-up Info */}
                  {contact.next_follow_up && (
                    <div className={`p-2 rounded text-xs ${isOverdue(contact.next_follow_up) ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-blue-50 text-blue-800 border border-blue-200'}`}>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Follow-up: {new Date(contact.next_follow_up).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {contact.notes && (
                    <p className="text-xs text-muted-foreground truncate">
                      "{contact.notes}"
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredContacts.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No contacts found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || filterType !== 'all' || filterPriority !== 'all' 
                  ? 'Try adjusting your filters' 
                  : 'Start by adding your first contact'}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {opportunities.map((opportunity) => (
              <Card key={opportunity.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{opportunity.business_name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Badge variant="secondary">{opportunity.sector.replace(/_/g, ' ')}</Badge>
                    {opportunity.location && (
                      <span className="flex items-center gap-1 text-xs">
                        <MapPin className="h-3 w-3" />
                        {opportunity.location}
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Asking Price</p>
                      <p className="font-medium">{formatCurrency(opportunity.asking_price)}</p>
                    </div>
                    {opportunity.cash_flow && (
                      <div>
                        <p className="text-muted-foreground">Cash Flow</p>
                        <p className="font-medium">{formatCurrency(opportunity.cash_flow)}</p>
                      </div>
                    )}
                  </div>
                  
                  {opportunity.score && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Score</span>
                        <span className="font-medium">{(opportunity.score * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" 
                          style={{ width: `${opportunity.score * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      Contact
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {opportunities.length === 0 && (
            <div className="text-center py-12">
              <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No opportunities in pipeline</h3>
              <p className="text-muted-foreground">
                Opportunities will appear here as they're identified
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Upcoming Follow-ups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contacts
                  .filter(c => c.next_follow_up)
                  .sort((a, b) => new Date(a.next_follow_up!).getTime() - new Date(b.next_follow_up!).getTime())
                  .map((contact) => (
                    <div key={contact.id} className={`p-4 rounded-lg border ${isOverdue(contact.next_follow_up) ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{contact.name}</p>
                          <p className="text-sm text-muted-foreground">{contact.company}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {new Date(contact.next_follow_up!).toLocaleDateString()}
                          </p>
                          <p className={`text-xs ${isOverdue(contact.next_follow_up) ? 'text-red-600' : 'text-blue-600'}`}>
                            {isOverdue(contact.next_follow_up) ? 'Overdue' : 'Upcoming'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                {contacts.filter(c => c.next_follow_up).length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No follow-ups scheduled
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}