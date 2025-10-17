const { useState, useEffect } = require("react")

const useFetch = (url, contentType, authorize) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)

        const fetchData = async () => {
            try {
                const response = await fetch(url, authorize ? {
                    headers: {
                        "Content-Type": contentType,
                        "Authorization": authorize
                    }
                } : null);
                if(!response.ok) return

                const result = await response.json();
                setData(result);
            } catch (err) {
                setError(error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [url])

    return { data, loading, error }
}

export default useFetch;