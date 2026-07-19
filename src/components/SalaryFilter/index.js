import './index.css'

const SalaryFilter = props => {
  const {salaryRangesList, changeSalaryRange} = props

  const onChangeSalary = event => {
    changeSalaryRange(event.target.value)
  }

  return (
    <div className="filter-container">
      <h1 className="filter-heading">Salary Range</h1>

      <ul className="filter-list">
        {salaryRangesList.map(each => (
          <li key={each.salaryRangeId} className="filter-item">
            <input
              type="radio"
              id={each.salaryRangeId}
              name="salary"
              value={each.salaryRangeId}
              onChange={onChangeSalary}
            />

            <label htmlFor={each.salaryRangeId} className="filter-label">
              {each.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SalaryFilter
