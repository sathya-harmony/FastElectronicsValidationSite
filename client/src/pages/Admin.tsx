import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from "framer-motion";
import { TrendingUp, Users, MousePointer, Package, Store, Calendar, ShoppingCart, Lock, RotateCcw, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
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
} from "@/components/ui/alert-dialog";
import { useQueryClient } from "@tanstack/react-query";

interface AdminStats {
  totalClicks: number;
  checkoutClicks: number;
  topSearches: { query: string; count: number }[];
  paymentMethods: { method: string; count: number }[];
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

function LoginForm({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (password: string) => {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Invalid password");
      }
      return res.json();
    },
    onSuccess: (data) => {
      localStorage.setItem("adminToken", data.token);
      onLogin(data.token);
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate(password);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-16">
        <motion.div
          className="w-full max-w-md mx-4"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: appleEasing }}
        >
          <Card className="border-black/5 premium-shadow rounded-3xl">
            <CardHeader className="text-center pb-2">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              >
                <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              </motion.div>
              <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
              <p className="text-muted-foreground mt-2">Enter your admin password to continue</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-black/10"
                  data-testid="input-admin-password"
                />
                {error && (
                  <motion.p
                    className="text-red-500 text-sm text-center"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.p>
                )}
                <Button
                  type="submit"
                  className="w-full h-12 rounded-xl bg-black hover:bg-black/90"
                  disabled={loginMutation.isPending || !password}
                  data-testid="button-admin-login"
                >
                  {loginMutation.isPending ? "Verifying..." : "Login"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

export default function AdminDashboard() {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      fetch("/api/admin/verify", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (res.ok) {
            setAuthToken(token);
          } else {
            localStorage.removeItem("adminToken");
          }
        })
        .catch(() => {
          localStorage.removeItem("adminToken");
        })
        .finally(() => {
          setIsCheckingAuth(false);
        });
    } else {
      setIsCheckingAuth(false);
    }
  }, []);

  const { data: stats, isLoading, error } = useQuery<AdminStats>({
    queryKey: ["admin-stats", authToken],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats", {
        headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      return res.json();
    },
    refetchInterval: 30000,
    enabled: !!authToken,
  });

  const { data: products = [] } = useQuery<any[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
    enabled: !!authToken,
  });

  const { data: stores = [] } = useQuery<any[]>({
    queryKey: ["stores"],
    queryFn: async () => {
      const res = await fetch("/api/stores");
      if (!res.ok) throw new Error("Failed to fetch stores");
      return res.json();
    },
    enabled: !!authToken,
  });

  const { data: offers = [] } = useQuery<any[]>({
    queryKey: ["offers"],
    queryFn: async () => {
      const res = await fetch("/api/offers");
      if (!res.ok) throw new Error("Failed to fetch offers");
      return res.json();
    },
    enabled: !!authToken,
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

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setAuthToken(null);
  };

  if (isCheckingAuth) {
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

  if (!authToken) {
    return <LoginForm onLogin={setAuthToken} />;
  }

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
          <motion.div variants={fadeInUp} className="mb-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
              <p className="text-muted-foreground mt-2">Real-time insights for ThunderFast Electronics</p>
              <p className="text-muted-foreground mt-2">Real-time insights for ThunderFast Electronics</p>
            </div>
            <div className="flex gap-3">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="rounded-full gap-2">
                    <RotateCcw className="h-4 w-4" /> Reset Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all analytics data, including click events, payment attempts, and pilot signups from the database.
                      <br /><br />
                      This is intended for resetting data after testing, before a fresh marketing campaign.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      onClick={async () => {
                        if (!authToken) return;
                        try {
                          await fetch("/api/admin/stats", {
                            method: "DELETE",
                            headers: { Authorization: `Bearer ${authToken}` },
                          });
                          // Invalidate queries to refresh UI
                          window.location.reload();
                        } catch (e) {
                          console.error("Failed to reset", e);
                        }
                      }}
                    >
                      Yes, Delete Everything
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button
                variant="outline"
                onClick={handleLogout}
                className="rounded-full"
                data-testid="button-logout"
              >
                Logout
              </Button>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10"
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
              <Card className="border-black/5 premium-shadow hover:shadow-lg transition-shadow bg-gradient-to-br from-emerald-50 to-white">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-emerald-700">Checkout Clicks</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-700" data-testid="stat-checkout-clicks">
                    {stats?.checkoutClicks?.toLocaleString() || 0}
                  </div>
                  <p className="text-xs text-emerald-600 mt-1">Proceed to checkout</p>
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
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="count"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
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

          <motion.div variants={fadeInUp} className="mb-10">
            <Card className="border-black/5 premium-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Payment Method Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.paymentMethods && stats.paymentMethods.length > 0 ? (
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.paymentMethods} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                          dataKey="method"
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(value) => value.toUpperCase()}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip
                          cursor={{ fill: '#f4f4f5' }}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} barSize={50}>
                          {stats.paymentMethods.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.method === 'upi' ? '#3b82f6' : entry.method === 'card' ? '#8b5cf6' : '#10b981'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    <p>No payment attempts recorded yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

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
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Email</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Phone</th>
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
                            <td className="py-3 px-4">{signup.email || "-"}</td>
                            <td className="py-3 px-4 text-muted-foreground">{signup.phone || "-"}</td>
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
                  <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-xl">
                    <span className="text-emerald-700">Checkout Rate</span>
                    <span className="font-semibold text-emerald-700">
                      {stats?.totalClicks ? ((stats.checkoutClicks / stats.totalClicks) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-secondary/30 rounded-xl">
                    <span className="text-muted-foreground">Avg. Products/Store</span>
                    <span className="font-semibold">
                      {stores.length > 0 ? (offers.length / stores.length).toFixed(1) : 0}
                    </span>
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
