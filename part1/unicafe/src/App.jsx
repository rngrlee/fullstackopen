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

const Text = (props) => {
  return (
  <>
    <p>{props.text} {props.number}</p>
  </>
  )
}

const Statistics = (props) => {
  if (props.good === 0 && props.neutral === 0 && props.bad === 0) {
    return (
      <>
        No feedback given
      </>
    )
  }
  return (
    <>
      <Text text='good' number={props.good} />
      <Text text='neutral' number={props.neutral} />
      <Text text='bad' number={props.bad} />
      <Text text='all' number={props.good + props.neutral + props.bad} />
      <Text text='average' number={(props.good - props.bad) / (props.good + props.neutral + props.bad)} />
      <Text text='positive' number={props.good / (props.good + props.neutral + props.bad)} />
    </>
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