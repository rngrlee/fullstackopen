import { useState } from 'react'

const Header = (props) => {
  return (
    <>
      <h1>{props.header}</h1>
    </>
  )
}

const Button = (props) => {
  return (
    <>
      <button onClick={props.handleClick}>{props.text}</button>
    </>
  )
}

const StatisticLine = (props) => {
  return (
  <tr>
    <td>{props.text}</td>
    <td>{props.number}</td>
  </tr>
  )
}

const Statistics = ({ good, neutral, bad }) => {
  if (good === 0 && neutral === 0 && bad === 0) {
    return (
      <>
        <p>No feedback given</p>
      </>
    )
  }

  const average = (good - bad) / (good + neutral + bad)
  const positive = good / (good + neutral + bad) * 100 + ' %'

  return (
    <table>
      <StatisticLine text='good' number={good} />
      <StatisticLine text='neutral' number={neutral} />
      <StatisticLine text='bad' number={bad} />
      <StatisticLine text='all' number={good + neutral + bad} />
      <StatisticLine text='average' number={average} />
      <StatisticLine text='positive' number={positive} />
    </table>
  )
}

const App = () => {
  const header = 'give feedback'
  const statistics = 'statistics'
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Header header={header} />
      <Button handleClick={() => setGood(good + 1)} text='good' />
      <Button handleClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button handleClick={() => setBad(bad + 1)} text='bad' />
      <Header header={statistics} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App