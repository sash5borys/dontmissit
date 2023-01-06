import { useEffect, useState } from 'react'

export const useImage = (fileName) => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [image, setImage] = useState(null)
    
    const fetchImage = async () => {
        try {
            const response = await import(`../assets/${fileName}.png`);
            setImage(response.default);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchImage();
    }, [fileName])

    return {
        loading,
        error,
        image,
    }
}