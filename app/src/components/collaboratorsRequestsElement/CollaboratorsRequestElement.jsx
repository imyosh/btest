import React, { useState, useRef } from 'react'
import './collaboratorsRequestElement.scss'

import Collaborator from '../collaborator/Collaborator'

import RequstButton from '../requestButton/RequstButton'

import { acceptRequest, rejectRequest } from '../../funtions/crud'

import { connect } from 'react-redux'
import { appendRemoteProject } from '../../redux/components/projects/projectsSlice'

const CollaboratorsRequestElement = ({
  item,
  updateRequest,
  appendRemoteProject,
}) => {
  const [acceptIsLoading, setAcceptIsLoading] = useState(false)
  const [acceptIsSuccess, setAcceptIsSuccess] = useState(null)

  const [rejectIsLoading, setRejectIsLoading] = useState(false)
  const [rejectIsSuccess, setRejectIsSuccess] = useState(null)

  const btnsRef = useRef(null)

  const acceptRequestFunc = () => {
    setAcceptIsLoading(true)
    acceptRequest(item._id)
      .then((res) => {
        setAcceptIsLoading(false)
        setAcceptIsSuccess(true)

        setTimeout(() => {
          btnsRef.current.style.opacity = 0
          setTimeout(() => {
            updateRequest(item._id, { status: 'accepted' })
            btnsRef.current.style.opacity = 1
          }, 300)
        }, 1500)
        console.log(res)
        appendRemoteProject(res.data)
      })
      .catch((err) => {
        setAcceptIsLoading(false)
        setAcceptIsSuccess(false)

        setTimeout(() => {
          setAcceptIsSuccess(null)
        }, 300)

        console.log(err)
      })
  }

  const rejectRequestFunc = () => {
    setRejectIsLoading(true)
    rejectRequest(item._id)
      .then((res) => {
        setRejectIsLoading(false)
        setRejectIsSuccess(true)

        setTimeout(() => {
          btnsRef.current.style.opacity = 0
          setTimeout(() => {
            updateRequest(item._id, { status: 'rejected' })
            btnsRef.current.style.opacity = 1
          }, 300)
        }, 1500)
        console.log(res)
      })
      .catch((err) => {
        setRejectIsLoading(false)
        setRejectIsSuccess(false)

        setTimeout(() => {
          setRejectIsSuccess(null)
        }, 300)

        console.log(err)
      })
  }

  return (
    <div className='collaboratorsRequestElement'>
      <div className='collaboratorsRequestElement__body'>
        <Collaborator
          id={1}
          width={'5.46rem'}
          height={'5.46rem'}
          img={item.senderImage}
        />
        <div className='collaboratorsRequestElement__container'>
          <div className='collaboratorsRequestElement__name'>
            {item.sender_artistName}
          </div>
          <div className='collaboratorsRequestElement__email'>
            {/* {item.email} */}
            {item.sender_email}
          </div>
        </div>
      </div>

      {item.status === 'pending' ? (
        <div ref={btnsRef} className='collaboratorsRequestElement__btns'>
          <RequstButton
            label='Accept'
            isSuccess={acceptIsSuccess}
            isLoading={acceptIsLoading}
            color='#1b998b'
            className={`collaboratorsRequestElement__btn ${
              rejectIsLoading || acceptIsSuccess || rejectIsSuccess
                ? 'disable'
                : ''
            }`}
            onClick={acceptRequestFunc}
          />

          <RequstButton
            label='Reject'
            isSuccess={rejectIsSuccess}
            isLoading={rejectIsLoading}
            color='#ff0b6d'
            className={`collaboratorsRequestElement__btn ${
              acceptIsLoading || acceptIsSuccess || rejectIsSuccess
                ? 'disable'
                : ''
            }`}
            onClick={rejectRequestFunc}
          />
        </div>
      ) : (
        <div className='collaboratorsRequestElement__status'>{item.status}</div>
      )}
    </div>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = { appendRemoteProject }

export default connect(null, mapDispatchToProps)(CollaboratorsRequestElement)
