import Layout from "@/components/Layout";
import SOSButton from "@/components/SOSButton";
import MapView from "@/components/MapView";

export default function Index() {
  return (
    <Layout>
      <main className="min-h-[80vh]">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          
          <div className="container mx-auto px-6 lg:px-20 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-primary/20 rounded-lg">
                    <span className="text-3xl">🛡️</span>
                  </div>
                  <span className="text-primary font-bold">Personal Safety Platform</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
                  RAAH-SETU
                </h1>
                <p className="text-xl text-slate-300 mb-6">
                  YOUR SAFETY, OUR PATH — Instant SOS alerts, live location sharing, health monitoring, and trusted guardians to keep you safe 24/7.
                </p>

                <div className="flex flex-wrap gap-4 mb-10">
                  <SOSButton />
                  <a
                    href="/dashboard"
                    className="px-8 py-3 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition"
                  >
                    Enter Dashboard →
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl hover:border-white/40 transition">
                    <span className="text-2xl mb-2 block">📍</span>
                    <h3 className="font-bold mb-1">Live Location</h3>
                    <p className="text-xs text-slate-300">Real-time tracking with guardians</p>
                  </div>
                  <div className="p-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl hover:border-white/40 transition">
                    <span className="text-2xl mb-2 block">🚨</span>
                    <h3 className="font-bold mb-1">Instant SOS</h3>
                    <p className="text-xs text-slate-300">Emergency alerts in seconds</p>
                  </div>
                  <div className="p-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl hover:border-white/40 transition">
                    <span className="text-2xl mb-2 block">❤️</span>
                    <h3 className="font-bold mb-1">Health Tracking</h3>
                    <p className="text-xs text-slate-300">Monitor your wellness daily</p>
                  </div>
                  <div className="p-4 bg-white/10 backdrop-blur border border-white/20 rounded-xl hover:border-white/40 transition">
                    <span className="text-2xl mb-2 block">👥</span>
                    <h3 className="font-bold mb-1">Trusted Guardians</h3>
                    <p className="text-xs text-slate-300">Your personal safety network</p>
                  </div>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="bg-gradient-to-br from-primary/20 to-blue-600/20 rounded-2xl p-8 border border-white/20 backdrop-blur">
                  <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl overflow-hidden">
                    <MapView className="w-full h-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-slate-900">
          <div className="container mx-auto px-6 lg:px-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Comprehensive Safety Features</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to stay safe, connected, and informed
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: "📱", title: "Emergency Contacts", desc: "Quick access to important phone numbers" },
                { icon: "📊", title: "Analytics Dashboard", desc: "Track safety trends and statistics" },
                { icon: "📋", title: "Incident Reports", desc: "Document and report safety incidents" },
                { icon: "💡", title: "Safety Tips", desc: "Learn best practices for personal safety" },
                { icon: "❤️", title: "Health Monitoring", desc: "Track wellness and medical info" },
                { icon: "📍", title: "Location Sharing", desc: "Share location with trusted contacts" },
              ].map((feature, idx) => (
                <div key={idx} className="p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition">
                  <span className="text-4xl mb-4 block">{feature.icon}</span>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary to-blue-600 text-white">
          <div className="container mx-auto px-6 lg:px-20 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Stay Safe?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of users who trust RAAH-SETU for their personal safety
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/dashboard"
                className="px-8 py-3 bg-white text-primary rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition"
              >
                Get Started Now
              </a>
              <a
                href="/safety-tips"
                className="px-8 py-3 bg-white/20 backdrop-blur border border-white/40 rounded-xl font-semibold hover:bg-white/30 transition"
              >
                Learn Safety Tips
              </a>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-slate-50 dark:bg-slate-950">
          <div className="container mx-auto px-6 lg:px-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold text-primary mb-2">10K+</div>
                <p className="text-muted-foreground">Active Users</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">24/7</div>
                <p className="text-muted-foreground">Real-time Monitoring</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">50+</div>
                <p className="text-muted-foreground">Feature Modules</p>
              </div>
              <div>
                <div className="text-5xl font-bold text-primary mb-2">100%</div>
                <p className="text-muted-foreground">Free & Secure</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
