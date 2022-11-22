import React, { useState, useEffect } from 'react'
import './login.scss'

import axios from 'axios'
import { debounce } from 'lodash'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { connect } from 'react-redux'
import { setUser } from '../../redux/components/user/userSlice'
import { writeConfigRequest, readConfigRequest } from 'secure-electron-store'
import { useNavigate } from 'react-router-dom'

import Logo from '../../svg/login_logo.svg'
import BoxesSpinner from '../../components/spinners/BoxesSpinner'

const schema = yup
  .object({
    email: yup.string().required(),
    password: yup.string().required().min(4),
  })
  .required()

const Login = ({ setUser, setIsUserLogged }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('Invalid Credential')
  const [isError, setIsError] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    watch(
      debounce(
        (e) => {
          setIsError(false)
        },
        1000,
        { leading: true, trailing: false }
      )
    )
  }, [])

  const onSubmit = handleSubmit((data) => {
    setIsLoading(true)
    setIsError(false)
    console.log(data)

    axios
      .post('/api/users/login', data)
      .then(function (response) {
        console.log(response)

        setUser(response.data)
        window.api.store.send(writeConfigRequest, 'user', response.data)
        window.api.store.send(readConfigRequest, 'homeFolderPath')

        setIsUserLogged(true)
        navigate('/')
      })
      .catch(function (error) {
        if (error.code === 'ERR_NETWORK') setErrorMessage(error.message)
        else setErrorMessage(error.response.data.message)

        console.log('error-------------')
        console.log(error)

        setIsLoading(false)
        setIsError(true)
      })
  })

  return (
    <div className='login'>
      <form onSubmit={onSubmit} className='login__container'>
        <Logo />
        <div className={`login__btn__group ${isLoading ? 'disable' : ''}`}>
          <input
            {...register('email')}
            className={`login__input ${errors.email && 'input--invalid'}`}
            placeholder='Email'
            spellCheck={false}
          ></input>
          <input
            {...register('password')}
            type='password'
            className={`login__input ${errors.password && 'input--invalid'}`}
            placeholder='Password'
          ></input>
        </div>
        {isError ? <span className='login__error'>{errorMessage}</span> : null}

        <button className={`login__btn ${isLoading ? 'disable' : ''}`}>
          {isLoading ? <BoxesSpinner /> : 'Login'}
        </button>
      </form>
    </div>
  )
}

const mapDispatchToProps = { setUser }
export default connect(null, mapDispatchToProps)(Login)
