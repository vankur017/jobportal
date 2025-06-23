
export const getJobs = async (url) => {


    try{

        const response = await fetch(url,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })


        if(!response.ok){
            throw new Error('Network response was not ok')
        }

        const data = await response.json()
        return data || [] // Assuming the API returns an object with a 'jobs' array

    }
    catch(err){
        console.error('Fetch error:', err)
        return []
    }

}