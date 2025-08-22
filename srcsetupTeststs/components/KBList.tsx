import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, BookOpen, ExternalLink } from 'lucide-react';

interface KBArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  relevanceScore?: number;
  updatedAt: string;
}

const KBList = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<KBArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock KB articles
  const mockArticles: KBArticle[] = [
    {
      id: '1',
      title: 'Getting Started with AI Automation',
      content: 'Learn the basics of implementing AI automation in your business workflows. This comprehensive guide covers setup, configuration, and best practices.',
      category: 'Getting Started',
      tags: ['automation', 'ai', 'setup'],
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'Custom AI Agent Configuration',
      content: 'Step-by-step instructions for configuring custom AI agents for your specific use case. Includes examples and troubleshooting tips.',
      category: 'AI Agents',
      tags: ['ai-agents', 'configuration', 'customization'],
      updatedAt: '2024-01-14T14:22:00Z'
    },
    {
      id: '3',
      title: 'Integration Best Practices',
      content: 'Best practices for integrating EcoNest AI with your existing tools and platforms. Learn about common patterns and potential pitfalls.',
      category: 'Integrations',
      tags: ['integrations', 'api', 'best-practices'],
      updatedAt: '2024-01-13T09:15:00Z'
    },
    {
      id: '4',
      title: 'Troubleshooting Common Issues',
      content: 'Solutions to the most frequently encountered issues when working with AI automation systems.',
      category: 'Troubleshooting',
      tags: ['troubleshooting', 'errors', 'solutions'],
      updatedAt: '2024-01-12T16:45:00Z'
    }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock search - filter articles based on query
    const filtered = mockArticles.filter(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    ).map(article => ({
      ...article,
      relevanceScore: Math.random() * 0.5 + 0.5 // Mock relevance score
    })).sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));

    setSearchResults(filtered);
    setIsSearching(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Getting Started': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'AI Agents': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Integrations': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Troubleshooting': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const articlesToShow = searchQuery ? searchResults : mockArticles.slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Search knowledge base..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button 
          onClick={handleSearch}
          disabled={isSearching}
          className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {articlesToShow.length === 0 && searchQuery ? (
        <Card className="border-accent/20">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2 text-foreground">No results found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or browse our categories below.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {articlesToShow.map((article) => (
            <Card key={article.id} className="border-accent/20 hover:border-accent/40 transition-colors">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-foreground hover:text-accent cursor-pointer">
                        {article.title}
                      </h3>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      {article.content}
                    </p>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getCategoryColor(article.category)}>
                        {article.category}
                      </Badge>
                      {article.relevanceScore && (
                        <Badge variant="outline">
                          {Math.round(article.relevanceScore * 100)}% match
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground ml-4">
                    Updated {formatDate(article.updatedAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!searchQuery && (
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="text-foreground">Browse Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Getting Started', 'AI Agents', 'Integrations', 'Troubleshooting'].map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  className="text-left justify-start h-auto p-3"
                  onClick={() => {
                    setSearchQuery(category);
                    handleSearch();
                  }}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default KBList;