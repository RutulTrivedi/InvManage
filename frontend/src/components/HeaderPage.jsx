import { Bell, UserCircle, BellDot } from 'lucide-react';
import Logo from "../assets/logo.png";

const HeaderPage = () => {
  return (
    <header className="flex items-end justify-end px-6 py-4 bg-white shadow-md">
      <div className="flex items-center space-x-6">
        <BellDot className="text-black hover:text-[#F8486E] cursor-pointer" size={22} />
        <button onClick={() => console.log('Profile Button pressed')} className='flex justify-center p-2 rounded items-center border border-[#F8486E]/20 bg-[#F8486E]/20 text-black hover:bg-[#F8486E] hover:border hover:border-[#F8486E]'>
          <UserCircle className="text-black cursor-pointer" size={26} />
          <div className='ps-2'>Rutul Trivedi</div>
        </button>
      </div>
    </header>
  );
};

export default HeaderPage;