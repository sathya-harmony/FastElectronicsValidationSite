import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { motion } from "framer-motion";
import { TrendingUp, Users, MousePointer, Package, Store, Calendar } from "lucide-react";

interface AdminStats {
  totalClicks: number;
  topSearches: { query: string; count: number }[];
  signupCount: number;
  recentSignups: {
    id: number;
    name: string;
    email: string;
    phone: string;
    neighborhood: string;
    createdAt: string;
  }[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const appleEasing: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: appleEasing }
  },
};

export default function AdminDashboard() {
  const { data: stats, isLoading, error } = useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats");
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    refetchInterval: 30000,
  });

  const { data: products = [] } = useQuery<any[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const { data: stores = [] } = useQuery<any[]>({
    queryKey: ["stores"],
    queryFn: async () => {
      const res = await fetch("/api/stores");
      if (!res.ok) throw new Error("Failed to fetch stores");
      return res.json();
    },
  });

  const { data: offers = [] } = useQuery<any[]>({
    queryKey: ["offers"],
    queryFn: async () => {
      const res = await fetch("/api/offers");
      if (!res.ok) throw new Error("Failed to fetch offers");
      return res.json();
    },
  });

  const categoryData = products.reduce((acc: any[], product: any) => {
    const existing = acc.find(c => c.name === product.category);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ name: product.category, count: 1 });
    }
    return acc;
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 flex items-center justify-center">
          <motion.div
            className="h-8 w-8 border-2 border-black border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 text-center">
          <p className="text-red-500">Failed to load analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <motion.main 
        className="flex-1 pt-24 pb-12"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div variants={fadeInUp} className="mb-10">
            <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-2">Real-time insights for ThunderFast Electronics</p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp}>
              <Card className="border-black/5 premium-shadow hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
                  <MousePointer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold" data-testid="stat-total-clicks">
                    {stats?.totalClicks.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-green-500" /> User interactions
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card className="border-black/5 premium-shadow hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Pilot Signups</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold" data-testid="stat-signups">
                    {stats?.signupCount || 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Waitlist registrations</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card className="border-black/5 premium-shadow hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold" data-testid="stat-products">
                    {products.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">In catalog</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card className="border-black/5 premium-shadow hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Partner Stores</CardTitle>
                  <Store className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold" data-testid="stat-stores">
                    {stores.length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Active partners</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            <motion.div variants={fadeInUp}>
              <Card className="border-black/5 premium-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Top Searched Keywords</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats?.topSearches && stats.topSearches.length > 0 ? (
                    <div className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats.topSearches} layout="vertical" margin={{ left: 20, right: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                          <XAxis type="number" hide />
                          <YAxis 
                            dataKey="query" 
                            type="category" 
                            width={100} 
                            axisLine={false} 
                            tickLine={false}
                            tick={{ fontSize: 12 }}
                          />
                          <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                          />
                          <Bar 
                            dataKey="count" 
                            fill="#000" 
                            radius={[0, 4, 4, 0]} 
                            barSize={24}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                      <p>No search data yet. Users will generate data as they search.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <Card className="border-black/5 premium-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Products by Category</CardTitle>
                </CardHeader>
                <CardContent>
                  {categoryData.length > 0 ? (
                    <div className="h-[280px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="count"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            labelLine={false}
                          >
                            {categoryData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  ) : (
                    <div className="h-[280px] flex items-center justify-center text-muted-foreground">
                      <p>No products in catalog yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={fadeInUp}>
            <Card className="border-black/5 premium-shadow">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Recent Pilot Signups</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {stats?.recentSignups && stats.recentSignups.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-black/5">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Phone</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Area</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Signed Up</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentSignups.map((signup) => (
                          <motion.tr 
                            key={signup.id}
                            className="border-b border-black/5 hover:bg-secondary/50 transition-colors"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            data-testid={`signup-row-${signup.id}`}
                          >
                            <td className="py-3 px-4 font-medium">{signup.name}</td>
                            <td className="py-3 px-4 text-muted-foreground">{signup.email}</td>
                            <td className="py-3 px-4 text-muted-foreground">{signup.phone}</td>
                            <td className="py-3 px-4">{signup.neighborhood}</td>
                            <td className="py-3 px-4 text-muted-foreground">{formatDate(signup.createdAt)}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-12 text-center text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p>No pilot signups yet.</p>
                    <p className="text-sm mt-1">Signups will appear here as users register for the pilot program.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-black/5 premium-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Store Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stores.map((store: any) => {
                    const storeOffers = offers.filter((o: any) => o.storeId === store.id);
                    return (
                      <div 
                        key={store.id} 
                        className="flex items-center justify-between p-3 bg-secondary/30 rounded-xl"
                        data-testid={`store-perf-${store.id}`}
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={store.logo} 
                            alt={store.name} 
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                          <div>
                            <p className="font-medium">{store.name}</p>
                            <p className="text-xs text-muted-foreground">{store.neighborhood}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">{storeOffers.length}</p>
                          <p className="text-xs text-muted-foreground">offers</p>
                        </div>
                      </div>
                    );
                  })}
                  {stores.length === 0 && (
                    <p className="text-center text-muted-foreground py-6">No stores registered yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-black/5 premium-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-xl">
                    <span className="text-muted-foreground">Total Offers</span>
                    <span className="font-semibold" data-testid="stat-offers">{offers.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-xl">
                    <span className="text-muted-foreground">Avg. Products/Store</span>
                    <span className="font-semibold">
                      {stores.length > 0 ? (offers.length / stores.length).toFixed(1) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-xl">
                    <span className="text-muted-foreground">Categories</span>
                    <span className="font-semibold">{categoryData.length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-xl">
                    <span className="text-muted-foreground">Data Refresh</span>
                    <span className="font-semibold text-green-600">Live (30s)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.main>
      
      <Footer />
    </div>
  );
}
