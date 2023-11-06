const Persons = ({ searchTerm, filteredPersons, persons }) => {
    return (
        <>
            {searchTerm.length > 0 ? 
            filteredPersons.map(person => <p>{person.name} {person.number}</p>) : 
            persons.map(person => <p>{person.name} {person.number}</p>)}
        </>
    )
}

export default Persons