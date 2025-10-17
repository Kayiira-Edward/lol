// src/app/auth/layout.tsx
export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
        {children}
      </div>
    );
  }