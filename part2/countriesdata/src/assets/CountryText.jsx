const CountryText = ({ countriesDisplayed }) => {

    if (countriesDisplayed.length > 10) {
      return <><p>Too many matches, specify another filter</p></>
    } else if (countriesDisplayed.length === 1) {
      const firstIndex = countriesDisplayed[0]
      const languages = Object.values(firstIndex.languages)
      return (
        <>
          <h1>{firstIndex.name.common}</h1>
          <p>capital {firstIndex.capital}</p>
          <p>area {firstIndex.area}</p>
          <p><b>languages:</b></p>
          <ul>
            {languages.map(language => <li>{language}</li>)}
          </ul>
          <img src={firstIndex.flags.png} alt={`flag of ${firstIndex.name.common}`} />
        </>
      )
    }
    return (
      <>
        {countriesDisplayed.map(country => <p>{country.name.common}</p>)}
      </>
    )
  }

  export default CountryText