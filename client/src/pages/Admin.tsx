import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { offers, products } from "@/lib/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const data = [
  { name: 'Mon', clicks: 400 },
  { name: 'Tue', clicks: 300 },
  { name: 'Wed', clicks: 550 },
  { name: 'Thu', clicks: 450 },
  { name: 'Fri', clicks: 700 },
  { name: 'Sat', clicks: 900 },
  { name: 'Sun', clicks: 800 },
];

const topKeywords = [
  { name: 'Arduino', count: 1240 },
  { name: 'Raspberry Pi', count: 850 },
  { name: 'Drone Motor', count: 600 },
  { name: 'Lipo Battery', count: 450 },
  { name: 'Servo', count: 300 },
];

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-muted/10">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Pilot Analytics Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total 'Buy Now' Clicks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">4,100</div>
              <p className="text-xs text-muted-foreground mt-1">+20.1% from last week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">342</div>
              <p className="text-xs text-muted-foreground mt-1">Currently browsing in Bangalore</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Top Area</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold">Indiranagar</div>
              <p className="text-xs text-muted-foreground mt-1">32% of all traffic</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Interest Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="clicks" stroke="hsl(var(--primary))" strokeWidth={3} dot={{r: 4}} activeDot={{r: 6}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Searched Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topKeywords} layout="vertical" margin={{ left: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
