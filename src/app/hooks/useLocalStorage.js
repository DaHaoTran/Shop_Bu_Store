import secureLocalStorage from "react-secure-storage"

const { useEffect, useState } = require("react")

const useLocalStorage = (name, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            var session = secureLocalStorage.getItem(name)
            return session ? JSON.parse(session) : initialValue
        } catch (ex) {
            console.log(ex)
            return initialValue;
        }
    })

    useEffect(() => {
        try {
            if(!initialValue) return
            
            secureLocalStorage.setItem(name, JSON.stringify(initialValue))
        } catch (ex) {
            console.log(ex)
        }
    }, [name, initialValue])

    return storedValue;
}

export default useLocalStorage;