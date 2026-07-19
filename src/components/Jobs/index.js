import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import Profile from '../Profile'
import JobItem from '../JobItem'
import EmploymentFilter from '../EmploymentFilter'
import SalaryFilter from '../SalaryFilter'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    jobsList: [],
    searchInput: '',
    employmentType: [],
    salaryRange: '',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobs()
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchButton = () => {
    this.getJobs()
  }

  changeEmploymentType = value => {
    this.setState(prevState => {
      const {employmentType} = prevState

      if (employmentType.includes(value)) {
        return {
          employmentType: employmentType.filter(each => each !== value),
        }
      }

      return {
        employmentType: [...employmentType, value],
      }
    }, this.getJobs)
  }

  changeSalaryRange = value => {
    this.setState(
      {
        salaryRange: value,
      },
      this.getJobs,
    )
  }

  getJobs = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {searchInput, employmentType, salaryRange} = this.state

    const employment = employmentType.join(',')

    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/jobs?employment_type=${employment}&minimum_package=${salaryRange}&search=${searchInput}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()

      const updatedData = data.jobs.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={50} width={50} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-image"
      />

      <h1 className="failure-heading">Oops! Something Went Wrong</h1>

      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>

      <button type="button" className="retry-button" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderNoJobsView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-image"
      />

      <h1 className="no-jobs-heading">No Jobs Found</h1>

      <p className="no-jobs-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  renderSuccessView = () => {
    const {jobsList} = this.state

    if (jobsList.length === 0) {
      return this.renderNoJobsView()
    }

    return (
      <ul className="jobs-list">
        {jobsList.map(eachJob => (
          <JobItem key={eachJob.id} jobDetails={eachJob} />
        ))}
      </ul>
    )
  }

  renderJobs = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()

      case apiStatusConstants.success:
        return this.renderSuccessView()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />

        <div className="jobs-container">
          <div className="jobs-content">
            <div className="profile-container">
              <Profile />

              <hr className="line" />

              <EmploymentFilter
                employmentTypesList={employmentTypesList}
                changeEmploymentType={this.changeEmploymentType}
              />

              <hr className="line" />

              <SalaryFilter
                salaryRangesList={salaryRangesList}
                changeSalaryRange={this.changeSalaryRange}
              />
            </div>

            <div className="jobs-section">
              <div className="search-container">
                <input
                  type="search"
                  className="search-input"
                  placeholder="Search"
                  value={searchInput}
                  onChange={this.onChangeSearchInput}
                />

                <button
                  type="button"
                  data-testid="searchButton"
                  className="search-button"
                  onClick={this.onClickSearchButton}
                >
                  <BsSearch />
                </button>
              </div>

              {this.renderJobs()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
