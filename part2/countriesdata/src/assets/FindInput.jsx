const FindInput = ({ filter, handleFilterChange}) => {
    return (
        <>
            find countries <input value={filter}
                onChange={handleFilterChange}/>
        </>
    )
}

export default FindInput