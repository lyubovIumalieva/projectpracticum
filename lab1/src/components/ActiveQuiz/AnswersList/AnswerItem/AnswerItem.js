import React from 'react'
import classes from './AnswerItem.module.scss'
import {Consumer} from '../../../../containers/Quiz/Quiz'


const AnswerItem = props => (
  <Consumer> 
    { ctx =>
      {
        const cls = [classes.AnswerItem]
        if (ctx.answerState){
          cls.push([classes[ctx.answerState[props.answer.id]]])
        } 
        return (
          <li
            onClick={() => ctx.onAnswerClickHandler(props.answer.id)} 
            className={cls.join(' ')}>
            { props.answer.text }
          </li>
        )
      }
    }
  </Consumer>
)


export default AnswerItem