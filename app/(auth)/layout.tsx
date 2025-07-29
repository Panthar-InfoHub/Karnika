export default function AuthLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return <div className="w-full h-svh flex justify-center items-center">{children}</div>;
  }
  