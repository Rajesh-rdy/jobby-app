import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsStarFill, BsBriefcaseFill, BsBoxArrowUpRight} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    skills: [],
    lifeAtCompany: {},
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const {match} = this.props
    const {id} = match.params

    const url = `https://apis.ccbp.in/jobs/${id}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()

      const updatedJobDetails = {
        id: data.job_details.id,
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        jobDescription: data.job_details.job_description,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
      }

      const updatedSkills = data.job_details.skills.map(eachSkill => ({
        name: eachSkill.name,
        imageUrl: eachSkill.image_url,
      }))

      const updatedLifeAtCompany = {
        description: data.job_details.life_at_company.description,
        imageUrl: data.job_details.life_at_company.image_url,
      }

      const updatedSimilarJobs = data.similar_jobs.map(eachJob => ({
        id: eachJob.id,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        jobDetails: updatedJobDetails,
        skills: updatedSkills,
        lifeAtCompany: updatedLifeAtCompany,
        similarJobs: updatedSimilarJobs,
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

      <button
        type="button"
        className="retry-button"
        onClick={this.getJobDetails}
      >
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {jobDetails, skills, lifeAtCompany, similarJobs} = this.state

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails

    return (
      <>
        <div className="job-details-card">
          <div className="logo-title-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo"
            />

            <div className="title-rating-container">
              <h1 className="job-title">{title}</h1>

              <div className="rating-container">
                <BsStarFill className="star-icon" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>

          <div className="location-package-container">
            <div className="location-employment-container">
              <div className="icon-text-container">
                <MdLocationOn className="icon" />
                <p>{location}</p>
              </div>

              <div className="icon-text-container">
                <BsBriefcaseFill className="icon" />
                <p>{employmentType}</p>
              </div>
            </div>

            <p className="package">{packagePerAnnum}</p>
          </div>

          <hr className="line" />

          <div className="description-visit-container">
            <h1 className="description-heading">Description</h1>

            <a
              href={companyWebsiteUrl}
              target="_blank"
              rel="noreferrer"
              className="visit-link"
            >
              Visit
              <BsBoxArrowUpRight className="visit-icon" />
            </a>
          </div>

          <p className="description">{jobDescription}</p>

          <h1 className="skills-heading">Skills</h1>

          <ul className="skills-list">
            {skills.map(eachSkill => (
              <li className="skill-item" key={eachSkill.name}>
                <img
                  src={eachSkill.imageUrl}
                  alt={eachSkill.name}
                  className="skill-image"
                />
                <p className="skill-name">{eachSkill.name}</p>
              </li>
            ))}
          </ul>

          <h1 className="life-heading">Life at Company</h1>

          <div className="life-container">
            <p className="life-description">{lifeAtCompany.description}</p>

            <img
              src={lifeAtCompany.imageUrl}
              alt="life at company"
              className="life-image"
            />
          </div>
        </div>

        <h1 className="similar-heading">Similar Jobs</h1>

        <ul className="similar-jobs-list">
          {similarJobs.map(eachJob => (
            <li className="similar-job-card" key={eachJob.id}>
              <div className="logo-title-container">
                <img
                  src={eachJob.companyLogoUrl}
                  alt="similar job company logo"
                  className="company-logo"
                />

                <div className="title-rating-container">
                  <h1 className="job-title">{eachJob.title}</h1>

                  <div className="rating-container">
                    <BsStarFill className="star-icon" />
                    <p className="rating">{eachJob.rating}</p>
                  </div>
                </div>
              </div>

              <h1 className="description-heading">Description</h1>

              <p className="description">{eachJob.jobDescription}</p>

              <div className="location-employment-container">
                <div className="icon-text-container">
                  <MdLocationOn className="icon" />
                  <p>{eachJob.location}</p>
                </div>

                <div className="icon-text-container">
                  <BsBriefcaseFill className="icon" />
                  <p>{eachJob.employmentType}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderJobDetails = () => {
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
    return (
      <>
        <Header />

        <div className="job-details-container">{this.renderJobDetails()}</div>
      </>
    )
  }
}

export default JobItemDetails
