import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VibeRoute AI — Dynamic Journey Synthesizer',
  description: 'AI-powered multimodal journey planner, proactive discovery engine, and real-time waypoint injector.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
