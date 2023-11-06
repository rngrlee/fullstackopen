import { useState } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/filter'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [idNum, setIdNum] = useState(5)
  const [filteredPersons, setFilteredPersons] = useState([])

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