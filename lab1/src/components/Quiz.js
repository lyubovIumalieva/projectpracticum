import React, {Component} from 'react'
import classes from './Quiz.module.scss'
import ActiveQuiz from '../../components/ActiveQuiz/ActiveQuiz'
import FinishedQuiz from '../../components/FinishedQuiz/FinishedQuiz'
import { DecisionTree } from '../containers/Quiz/decision-tree';

const answerClickContext = React.createContext({})

class Quiz extends Component{
  state = {
    decisiontree: DecisionTree,
    currentQuiz: 0,
    countQuestions: 0,
    result: {},
    results: {},
    answers: {},
    isFinished: false,
    plants: [
      {
        id : 1,
        lifeForm : 'Травянистое',
        leafColor : 'пестрая',
        leafForm : 'Овальная',
        area: 'Опушенная',
        leafSize: '5-10см',
        flowerSize: '1-5см',
        name: 'Марранта'
      },
      {
        id : 2,
        lifeForm : 'Травянистое',
        leafColor : 'зеленая',
        leafForm : 'Ремневидная',
        area: 'Обычная',
        leafSize: '10-15см',
        flowerSize: '1-5см',
        name: 'Криптанус'
      },
      {
        id : 3,
        lifeForm : 'Травянистое',
        leafColor : 'зеленая',
        leafForm : 'Ремневидная',
        area: 'Обычная',
        leafSize: '15-30см',
        flowerSize: '1-5см',
        name: 'Сансеверия'
      },
      {
        id : 4,
        lifeForm : 'Луковичное',
        leafColor : 'зеленая',
        leafForm : 'Линейная',
        area: 'Опушенная',
        leafSize: '15-30см',
        flowerSize: '5-10см',
        name: 'Гемантус'
      },
      {
        id : 5,
        lifeForm : 'Луковичное',
        leafColor : 'зеленая',
        leafForm : 'Ланцетная',
        area: 'Складчатая',
        leafSize: '15-30см',
        flowerSize: '5-10см',
        name: 'Эухарис'
      },
      {
        id : 6,
        lifeForm : 'Луковичное',
        leafColor : 'пестрая',
        leafForm : 'Ланцетная',
        area: 'Обычная',
        leafSize: '15-30см',
        flowerSize: '5-10см',
        name: 'Лахеналия'
      },
      {
        id : 7,
        lifeForm : 'Пальма',
        leafColor : 'зеленая',
        leafForm : 'Ланцетная',
        area: 'Обычная',
        leafSize: '15-30см',
        flowerSize: '0-1см',
        name: 'Хамеропс'
      },
      {
        id : 8,
        lifeForm : 'Пальма',
        leafColor : 'пестрая',
        leafForm : 'Ланцетная',
        area: 'Складчатая',
        leafSize: '5-10см',
        flowerSize: '0-1см',
        name: 'Птерис'
      },
    ],
    quiz: [
    ]
  }

  onAnswerClickHandler = (answerId) => {
    const quizItem = this.state.quiz[this.state.currentQuiz]
    const results = this.state.results
    const answers = this.state.answers
    let result = ''
    results[quizItem.type] = quizItem.value
    answers[quizItem.type] = answerId
    if (quizItem.id === 1) {
      answerId === 1 
        ? this.setState({ currentQuiz: this.state.currentQuiz + 1, }) 
        : this.setState({ currentQuiz: this.state.currentQuiz + 3, })
    } else{
      this.setState({ currentQuiz: this.state.currentQuiz + 1, })
    }
    this.setState({
      results,
      answers
    })

    if (this.isQuizFinished()) {
      var config = {
        trainingSet: data, 
        categoryAttr: 'lifeform' 
      };
      var decisionTree = new dt.DecisionTree(config);
      var comic = {answers};

      var decisionTreePrediction = decisionTree.predict(comic);
      } else{
        this.setState({
          result: decisionTreePrediction,
          countQuestions: this.state.countQuestions + 1,
        })
      }
 
  }

  onRetry = () => {
    this.setState({
      isFinished: false,
      currentQuiz: 0,
      countQuestions: 0,
      result: {},
      results: {},
      answers: {},
    })
  }

  isQuizFinished () {
    return this.state.countQuestions + 1 === 3
  }

  searchByAnswer = (elem, answer, result, param) =>{
    switch (param) {
      case 'leafForm':
        return answer['leafForm'] === 1 
        ? elem.leafForm === result['leafForm'] 
        : elem.leafForm !== result['leafForm']
      case 'lifeForm':
        return answer['lifeForm']  === 1 
        ? elem.lifeForm === result['lifeForm'] 
        : elem.lifeForm !== result['lifeForm']
      case 'leafColor':
        return answer['leafColor'] === 1 
        ? elem.leafColor === result['leafColor'] 
        : elem.leafColor !== result['leafColor']
      case 'leafSize':
          return answer['leafSize'] === 1 
          ? elem.leafSize === result['leafSize'] 
          : elem.leafSize !== result['leafSize']
      case 'area':
          return answer['area'] === 1 
          ? elem.area === result['area'] 
          : elem.area !== result['area']
      default:
        return null
    }
  }

  render(){
    return(
      <div className={classes.Quiz}>
        <div className={classes.QuizWrapper}>
          <h1>Ответьте на все вопросы</h1>
          <answerClickContext.Provider
            value = {{
              onAnswerClickHandler: this.onAnswerClickHandler,
              answerState: this.state.answerState,
            }}
          >
          { 
            this.state.isFinished 
            ? <FinishedQuiz
              result = {this.state.result}
              onRetry = {this.onRetry}
             /> 
            : <ActiveQuiz
              answers = {this.state.quiz[this.state.currentQuiz].answers}
              question = {this.state.quiz[this.state.currentQuiz].question}
              quizLength = {this.state.quiz.length}
              answerNumber = {this.state.currentQuiz + 1}
            />
          }
          </answerClickContext.Provider>
          
        </div>
      </div>
    )
  }
}
export const Consumer = answerClickContext.Consumer;
export default Quiz
