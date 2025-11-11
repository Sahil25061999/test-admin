
import React,{createContext,useContext,useState} from 'react';

const NavWidthContext = createContext(null);

export const NavWidthProvider = ({children})=>{
    const [displayNav,setDisplayNav] = useState(false)
    const handleToggleNavbar = () => {
        setDisplayNav((prev) => !prev);
      };
    return <NavWidthContext.Provider value={{displayNav,handleToggleNavbar}}>
        {children}
    </NavWidthContext.Provider>
}

export const useNavWidth = ()=>useContext(NavWidthContext);