import Cookies from 'js-cookie';
import { useEffect } from 'react';

const DashboardPage = () => {
  useEffect(() => {
    const userId = Cookies.get("userId");
    console.log("User ID from cookies:", userId);
  }, []);

    return (
      <div className="text-center mt-16">
        <h2 className="text-3xl font-bold text-[#F8486E]">Welcome to InvManage Dashboard</h2>
        <p className="text-gray-600 mt-4">Start by navigating from the sidebar options.</p>
      </div>
    );
  };
  
  export default DashboardPage;  