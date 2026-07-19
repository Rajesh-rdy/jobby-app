import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'

import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorMessage: '',
  }

  onChangeUserName = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitForm = async event => {
    event.preventDefault()

    const {username, password} = this.state

    const userDetails = {
      username,
      password,
    }

    const response = await fetch('https://apis.ccbp.in/login', {
      method: 'POST',
      body: JSON.stringify(userDetails),
    })

    const data = await response.json()

    if (response.ok) {
      Cookies.set('jwt_token', data.jwt_token, {expires: 30})

      const {history} = this.props
      history.replace('/')
    } else {
      this.setState({
        errorMessage: data.error_msg,
      })
    }
  }

  render() {
    const {username, password, errorMessage} = this.state

    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-bg-container">
        <form className="login-form" onSubmit={this.onSubmitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="login-logo"
          />

          <label htmlFor="username" className="label">
            USERNAME
          </label>

          <input
            id="username"
            type="text"
            value={username}
            className="input"
            placeholder="Username"
            onChange={this.onChangeUserName}
          />

          <label htmlFor="password" className="label">
            PASSWORD
          </label>

          <input
            id="password"
            type="password"
            value={password}
            className="input"
            placeholder="Password"
            onChange={this.onChangePassword}
          />

          <button type="submit" className="login-btn">
            Login
          </button>

          {errorMessage && <p className="error-message">*{errorMessage}</p>}
        </form>
      </div>
    )
  }
}

export default Login
