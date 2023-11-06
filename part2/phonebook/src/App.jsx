import { useState, useEffect } from 'react'
import axios from 'axios'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/filter'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [idNum, setIdNum] = useState(5)
  const [filteredPersons, setFilteredPersons] = useState([])

  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'persons')  

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  } 

  const addNewPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)

    const newPersonObject = {
      name: newName,
      number: newNumber,
      id: Math.max(persons.id) + 1
    }

    if (persons.map(object => object.name).includes(newName)) {
      alert(`${newName} is already in phonebook`)
      return
    }

    if (persons.map(object => object.number).includes(newNumber)) {
      alert(`${newNumber} is already in phonebook`)
      return
    }

    setPersons(persons.concat(newPersonObject))
    setNewNumber('')
    setNewName('')
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  } 

  const handleSearchTermChange = (event) => {
    console.log(event.target.value)
    setSearchTerm(event.target.value)
    const caseInsensitiveSearch = event.target.value.toLowerCase()
    setFilteredPersons(persons.filter(obj => obj.name.toLowerCase().includes(caseInsensitiveSearch)))
    console.log(filteredPersons)
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchTerm={searchTerm} handleSearchTermChange={handleSearchTermChange}/>
      <h2>add a new</h2>
      <PersonForm addNewPerson={addNewPerson} newName={newName} handleNameChange={handleNameChange}
      newNumber={newNumber} handleNumberChange={handleNumberChange}/>
      <h2>Numbers</h2>
      <Persons searchTerm={searchTerm} filteredPersons={filteredPersons} persons={persons}/>
      {/* for debugging */}
      {/* <div>debug name: {newName}</div>
      <div>debug number: {newNumber}</div>
      <div>debug search term: {searchTerm}</div> */}
    </div>
  )
}

export default App