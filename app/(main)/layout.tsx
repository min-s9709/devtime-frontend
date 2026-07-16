import NavBar from "@/components/common/nav-bar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-app-gradient min-h-screen">
      <div className="mx-auto w-full max-w-300">
        <NavBar />
        {children}
      </div>
    </div>
  );
}
