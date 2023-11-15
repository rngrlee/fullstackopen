import { useState, useEffect } from 'react'
import personService from './services/personService'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/filter'
import Notification from './services/errorMessage'

const App = () => {

  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(initialPersons => {
        console.log('promise fulfilled')
        setPersons(initialPersons)
      })
  }, [])
  console.log('render', persons.length, 'persons')  

  const addNewPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)

    if (persons.map(object => object.name).includes(newName) && 
    !persons.map(object => object.number).includes(newNumber)) {
      if (confirm(`${newName} is already in phonebook, replace number with new one?`)) {
        const person = persons.find(person => person.name === newName)
        const changedPerson = {...person, number: newNumber}
        personService
          .update(person.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.name !== newName ? person : returnedPerson))
          })
          .catch(error => {
            setErrorMessage(
            `Person ${person.name} was already removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
        setErrorMessage(`${person.name}'s number has been updated`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
          return 
      }
    }

    const newPersonObject = {
      name: newName,
      number: newNumber,
    }

    if (persons.map(object => object.name).includes(newName)) {
      alert(`${newName} is already in phonebook`)
      return
    }

    if (persons.map(object => object.number).includes(newNumber)) {
      alert(`${newNumber} is already in phonebook`)
      return
    }

    personService
      .create(newPersonObject)
      .then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
    })
    .catch(error => {
      setErrorMessage(error.response.data.error)
      console.log(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    })

    setNewNumber('')
    setNewName('')
    setErrorMessage(`${newPersonObject.name} has been added to the server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (confirm(`Delete ${person.name}?`)) {
      personService
        .axiosDelete(id)
        .then(() => {
          console.log(`Deleted ${person.name}, id ${id}`)
        })
        setPersons(persons.filter(person => person.id !== id))
        setErrorMessage(`${person.name} has been deleted from the server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  } 

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  } 

  const handleSearchTermChange = (event) => {
    console.log(event.target.value)
    setSearchTerm(event.target.value)
  }

  const personsDisplayed = searchTerm 
    ? persons.filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : persons

  console.log('personsDisplayed', personsDisplayed)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter searchTerm={searchTerm} handleSearchTermChange={handleSearchTermChange}/>
      <h2>add a new</h2>
      <PersonForm addNewPerson={addNewPerson} newName={newName} handleNameChange={handleNameChange}
      newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      {personsDisplayed.map(person =>
        <Persons
        key={person.id}
        person={person}
        deletePerson={() => deletePerson(person.id)} />
      )}
      {/* for debugging */}
      {/* <div>debug name: {newName}</div>
      <div>debug number: {newNumber}</div>
      <div>debug search term: {searchTerm}</div> */}
    </div>
  )
}

export default App