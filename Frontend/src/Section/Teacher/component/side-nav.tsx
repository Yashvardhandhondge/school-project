import { Link, useNavigate } from 'react-router-dom';
import { Users, LogOut,X,MenuIcon} from 'lucide-react';
// import { ClipboardIcon} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/teachers/viewstudent', label: 'Students', icon: Users },
  // { href: '/teachers/viewforms', label: 'Manage Points', icon: ClipboardIcon },
  // { href: '/teachers/pointhistory', label: 'Point History', icon: ClipboardIcon },
];

export function TeacherSideNav() {
  const navigate = useNavigate();
  const[toogle,Settoogle] = useState(false);

  const toogleX = () =>{
    Settoogle(!toogle);
  }

  const handleLogout = () => {
    
    localStorage.removeItem('token'); 
    sessionStorage.removeItem('token'); 

    
    navigate('/');
  };

  return (
    <>
    <div className='bg-white md:hidden'>
      {
        !toogle ? <Button variant={"ghost"} onClick={()=> toogleX()}><MenuIcon /></Button>:<Button variant={"ghost"} onClick={()=> toogleX()}><X /></Button>
      }
    </div>
    
    {
      toogle && <nav className={`w-64 bg-white shadow-lg  ${!toogle ? "max-md:hidden":""}`}>
      <div className="p-4">
      <img src="/logo2.png" alt="" className='w-14  h-14' />
      </div>
      <ul className="space-y-2 py-4">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link to={item.href} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
              <item.icon className="h-5 w-5 mr-2" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      {/* Logout Button */}
      <div className="px-4 py-2 mt-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </button>
      </div>
    </nav>
    }

<nav className={`w-64 bg-white shadow-lg max-md:hidden`}>
      <div className="p-4">
      <img src="/logo2.png" alt="" className='w-14  h-14' />
      </div>
      <ul className="space-y-2 py-4">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link to={item.href} className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100">
              <item.icon className="h-5 w-5 mr-2" />
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="px-4 py-2 mt-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Logout
        </button>
      </div>
    </nav>

    </>
  );
}
