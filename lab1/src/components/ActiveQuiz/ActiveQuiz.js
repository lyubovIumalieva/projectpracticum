import React from 'react'
import classes from './ActiveQuiz.module.scss'
import AnswersList from './AnswersList/AnswersList'


const ActiveQuiz = props => (
	<div className={classes.ActiveQuiz}>
		<p className={classes.Question}>
			<span>
				{props.question}
			</span>

			
		</p>

		<AnswersList
			answers={props.answers}
		/>
	</div>
)

export default ActiveQuiz