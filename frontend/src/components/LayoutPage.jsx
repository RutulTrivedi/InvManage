import HeaderPage from './HeaderPage';
import SidebarPage from './SidebarPage';
import { Outlet } from 'react-router-dom';

const LayoutPage = () => {
  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-auto">
      <SidebarPage />
      <div className="flex flex-col flex-1 overflow-hidden">
        <HeaderPage />
        <main className="p-6 overflow-y-auto h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutPage;