import { createContext, useState } from "react";


export const AlertContext = createContext(null);

export const AlertProvider = ({children}) => {
    const [alert, setAlert] = useState({type: "success", message: ""});

    return (
        <AlertContext.Provider value={{ alert, setAlert }}>
            {children}
        </AlertContext.Provider>
    )
}