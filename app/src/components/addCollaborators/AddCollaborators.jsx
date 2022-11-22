import React, { useState } from 'react'
import './addCollaborators.scss'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axios from 'axios'
import { connect } from 'react-redux'

import Modal from '../modal/Modal'
import BoxesSpinner from '../spinners/BoxesSpinner'
import RequstButton from '../requestButton/RequstButton'

const schema = yup
  .object({
    email: yup.string().email().required(),
  })
  .required()

const AddCollaborators = ({ isOpen, setIsOpen, projectId, userToken }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  React.useEffect(() => {
    // axios
    //   .post(
    //     `/api/versions/GetAll/?id=62f11de97e76852563a67c9a`,
    //     {},
    //     {
    //       headers: {
    //         'x-access-token': userToken,
    //       },
    //     }
    //   )
    //   .then(console.log)
    //   .catch(console.log)
  }, [])

  const onSubmit = handleSubmit((data) => {
    setIsLoading(true)
    setIsSuccess(null)

    axios
      .post(
        '/api/users/sendCollaboratorRequest',
        {
          receiver_email: data.email,
          project_id: projectId,
        },
        {
          headers: {
            'x-access-token': userToken,
          },
        }
      )
      .then(function (response) {
        console.log(response)
        setIsLoading(false)
        setIsSuccess(true)

        setTimeout(() => {
          setTimeout(() => {
            reset()
          }, 300)
          setIsSuccess(null)
          setIsOpen(false)
        }, 1500)
      })
      .catch(function (error) {
        console.log(error)
        setIsLoading(false)
        setIsSuccess(false)
        window.api.send('show-error-message', {
          title: '',
          message: error.response.data.message,
        })
        setTimeout(() => {
          setIsSuccess(null)
        }, 1500)
      })
  })

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <form onSubmit={onSubmit} className='modal__window addCollaborators'>
        <div className='addCollaborators__title'>Add Collaborator</div>
        <input
          {...register('email')}
          className={`addCollaborators__input ${
            errors.email && 'input--invalid'
          }`}
          placeholder='Email'
          spellCheck={false}
        ></input>

        <RequstButton
          className='addCollaborators__btn'
          isLoading={isLoading}
          isSuccess={isSuccess}
          label='Send Request'
          color='#813efb'
        />
      </form>
    </Modal>
  )
}

const mapStateToProps = (state) => ({
  userToken: state.user.token,
})

export default connect(mapStateToProps)(AddCollaborators)
