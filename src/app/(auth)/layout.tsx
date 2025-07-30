export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex justify-center items-center max-h-[80vh] overflow-auto">
      {children}
    </div>
  );
}
