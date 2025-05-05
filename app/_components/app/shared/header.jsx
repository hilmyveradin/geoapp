import DesktopHeader from "./desktop-header";
import MobileHeader from "./mobile-header";

const AppHeader = () => {
  return (
    <>
      <div className="block shadow-lg sm:hidden">
        <MobileHeader />
      </div>
      <div className="hidden shadow-lg sm:block">
        <DesktopHeader />
      </div>
    </>
  );
};

export default AppHeader;
