import { useState, useEffect } from 'react'
import FindInput from './assets/FindInput.jsx'
import countryService from './services/axios.js'
import CountryText from './assets/CountryText.jsx'

function App() {
  // hooks
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    console.log('effect')
    countryService
      .getAll()
      .then(initialCountries => {
        console.log('promise fulfilled')
        setCountries(initialCountries)
      })
  }, [])
  console.log('render', countries.length, 'countries')  

  // handlers
  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  } 

  // misc

  const countriesDisplayed = filter
    ? countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))
    : countries

  console.log('countriesDisplayed', countriesDisplayed, countriesDisplayed.length)

  return (
    <>
      <FindInput filter={filter} handleFilterChange={handleFilterChange} />
      <CountryText countriesDisplayed={countriesDisplayed}/>
    </>
  )
}

export default App
