import {Link} from 'react-router-dom'
import {BsStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const JobItem = props => {
  const {jobDetails} = props

  const {
    id,
    companyLogoUrl,
    title,
    rating,
    location,
    employmentType,
    packagePerAnnum,
    jobDescription,
  } = jobDetails

  return (
    <li className="job-item">
      <Link to={`/jobs/${id}`} className="job-link">
        <div className="logo-title-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
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
              <p className="details">{location}</p>
            </div>

            <div className="icon-text-container">
              <BsBriefcaseFill className="icon" />
              <p className="details">{employmentType}</p>
            </div>
          </div>

          <p className="package">{packagePerAnnum}</p>
        </div>

        <hr className="line" />

        <h1 className="description-heading">Description</h1>

        <p className="description">{jobDescription}</p>
      </Link>
    </li>
  )
}

export default JobItem
