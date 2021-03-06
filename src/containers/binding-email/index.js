import React, { Component, PropTypes } from 'react'
import { Link, browserHistory } from 'react-router'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { getProfile } from '../../reducers/user'
import { bindingEmail } from '../../actions/account'
import { loadUserInfo } from '../../actions/user'

import Shell from '../../shell'
import Subnav from '../../components/subnav'
import CaptchaButton from '../../components/captcha-button'

export class BindingEmail extends Component {
  
  constructor(props) {
    super(props)
    this.submit = this.submit.bind(this)
    this.sendCaptcha = this.sendCaptcha.bind(this)
  }

  componentWillMount() {
    const { me } = this.props
    if (me.email) {
      browserHistory.push('/')
    }
  }

  componentDidMount() {
    const { email } = this.refs
    email.focus()
  }



  submit() {

    const self = this
    const { bindingEmail, loadUserInfo } = this.props
    const { code, email, password } = this.refs

    if (!code.value) {
      code.focus()
      return
    }

    if (!email.value) {
      email.focus()
      return
    }

    if (!password.value) {
      password.focus()
      return
    }

    bindingEmail({
      captcha: code.value,
      email: email.value,
      password: password.value,
      callback: function(result){
        alert(result.success ? '绑定成功' : '绑定失败')
        loadUserInfo({})
      }
    })

  }

  sendCaptcha(callback) {
    const { email } = this.refs

    if (!email.value) {
      email.focus()
      return
    }

    callback({ email: email.value, type: 'binding-email' })
  }

  render() {

    return (
      <div>
        <Subnav middle="验证码邮箱" />
        <div className="container">

          <div className="list">
            <input type="text" placeholder="请输入你要绑定的邮箱" ref="email" />
          </div>

          <div className="list">
            <div>
              <input type="text" placeholder="输入6位数验证码" ref="code" />
              <CaptchaButton onClick={this.sendCaptcha} />
            </div>
          </div>

          <div className="list">
            <input type="password" placeholder="请输入密码" ref="password" />
          </div>

          <div className="list">
            <input type="submit" className="button center" onClick={this.submit} value="提交" />
          </div>

        </div>
      </div>
    )

  }

}

BindingEmail.contextTypes = {
  router: PropTypes.object.isRequired
}

BindingEmail.propTypes = {
  me: PropTypes.object.isRequired,
  bindingEmail: PropTypes.func.isRequired,
  loadUserInfo: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  return {
    me: getProfile(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    bindingEmail: bindActionCreators(bindingEmail, dispatch),
    loadUserInfo: bindActionCreators(loadUserInfo, dispatch)
  }
}

BindingEmail = connect(mapStateToProps, mapDispatchToProps)(BindingEmail)

export default Shell(BindingEmail)
