const { useState, useEffect } = require("react")

const useFetch = (url) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)

        const fetchData = async () => {
            try {
                const response = await fetch(url);
                if(!response.ok) 
                { 
                    setError('Failed to fetch data, automatic redirect'); 
                    setTimeout(() => {
                        location.reload();
                    }, 10000);
                }

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