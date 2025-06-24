import React, { useId } from 'react'
import { useParams } from 'react-router-dom';


const JobDetail = () => {

  const id = useParams()
  console.log(id);
  

  return (
    <div>JobDetail</div>
  )
}

export default JobDetail