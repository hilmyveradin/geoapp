import DesktopHeader from "./desktop-header";
import MobileHeader from "./mobile-header";

const AppHeader = () => {
  return (
    <>
      <div className="block sm:hidden">
        <MobileHeader />
      </div>
      <div className="hidden sm:block">
        <DesktopHeader />
      </div>
    </>
  );
};

export default AppHeader;
