// src/app/share/layout.tsx
export default function ShareLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div className="min-h-screen">
        {children}
      </div>
    );
  }