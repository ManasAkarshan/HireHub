import { useState } from "react"

const useFetch = (callback, options = {})=>{
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(null)

    const fn = async (...args)=>{
        setLoading(true);
        setError(null)
        try {
            const res = await callback(options, ...args)
            setData(res)
            setError(null)
        } catch (error) {
            setError(error)
        }finally{
            setLoading(false)
        }
    }

    return {data, loading, error, fn}
}

export default useFetch