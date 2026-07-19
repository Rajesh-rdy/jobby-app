import './index.css'

const EmploymentFilter = props => {
  const {employmentTypesList, changeEmploymentType} = props

  const onChangeEmployment = event => {
    changeEmploymentType(event.target.value)
  }

  return (
    <div className="filter-container">
      <h1 className="filter-heading">Type of Employment</h1>

      <ul className="filter-list">
        {employmentTypesList.map(each => (
          <li key={each.employmentTypeId} className="filter-item">
            <input
              type="checkbox"
              id={each.employmentTypeId}
              value={each.employmentTypeId}
              onChange={onChangeEmployment}
            />

            <label htmlFor={each.employmentTypeId} className="filter-label">
              {each.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EmploymentFilter
