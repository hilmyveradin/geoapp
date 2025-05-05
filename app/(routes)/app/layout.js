import AppSidebar from "@/app/_components/app/sidebar";

const AppLayout = ({ children }) => {
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0 flex mx-1 my-2">
      <AppSidebar />
      <div className="w-full h-full bg-blue-50">{children}</div>
    </div>
  );
};

export default AppLayout;
