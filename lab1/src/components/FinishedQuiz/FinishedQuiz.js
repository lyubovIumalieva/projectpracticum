import React from 'react'
import cls from './FinishedQuiz.module.scss'


const FinishedQuiz = props => {
  console.log(props.result)
  return (
    <div className={cls.FinishedQuiz}>
      <p>{props.result[0].lifeForm} {props.result[0].name}</p>
      <button onClick={props.onRetry}>Заново</button>
    </div> 
  )
}

export default FinishedQuiz