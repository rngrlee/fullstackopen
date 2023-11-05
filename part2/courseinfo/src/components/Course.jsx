const Subheader = ({ subhead }) => <h2>{subhead}</h2>

const Part = ({ name, exercises }) => <p>{name} {exercises}</p>

const Content = ({ parts }) => {
  return (
    <>
      {parts.map(item =>
        <Part key={item.id} name={item.name} exercises={item.exercises} />
        )}
    </>
  )
}

const Total = ({ parts }) => {
  const total = parts.reduce((acc, curr) => acc + curr.exercises, 0)
  return (
    <p><b>Total of {total} exercises</b></p>
  )
}

const Course = ({ courses }) => {

  return (
    <>
      <Subheader subhead={courses.name} />
      <Content parts={courses.parts} />
      <Total parts={courses.parts} />
    </>
  )
}

export default Course
