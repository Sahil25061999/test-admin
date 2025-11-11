
import React,{createContext,useContext,useState} from 'react';

const NavWidthContext = createContext();

export const NavWidthProvider = ({children})=>{
    const [navWidth,setNavWidth] = useState(false)
    return <NavWidthContext.Provider value={{navWidth,setNavWidth}}>
        {children}
    </NavWidthContext.Provider>
}

export const useNavWidth = ()=>useContext(NavWidthContext);