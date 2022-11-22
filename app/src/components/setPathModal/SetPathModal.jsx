import React, { useEffect } from 'react'
import './setPathModal.scss'

import { useForm } from 'react-hook-form'
import { connect } from 'react-redux'

import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

import Modal from '../modal/Modal'

import { writeConfigRequest } from 'secure-electron-store'

import { setHomeFolderPath } from '../../redux/components/homeFolder/homeFolderPathSlice'

import setupFilesOperations from '../../funtions/filesOperations'

const schema = yup.object({
  homeFolderPath: yup
    .string()
    .test('existsSync', 'does is existsSync', window.api.existsSync)
    .required(),
})

const SetPathModal = ({ isOpen, setIsOpen, setHomeFolderPath }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const onSubmit = handleSubmit((data) => {
    window.api.store.send(
      writeConfigRequest,
      'homeFolderPath',
      data.homeFolderPath
    )

    setHomeFolderPath(data.homeFolderPath)
    setupFilesOperations(data.homeFolderPath)

    setTimeout(() => {
      reset()
    }, 300)
    setIsOpen(false)
  })

  const openFilePicker = async () => {
    window.api.send('selectDirectory')
  }

  useEffect(() => {
    const reciever = (data) => {
      if (!data.canceled)
        setValue('homeFolderPath', data.filePaths[0].replaceAll('\\', '/'))
    }

    window.api.on('selectedDirectory', reciever)
    return () => window.api.clear('selectedDirectory', reciever)
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      isNotClosable={true}
    >
      <form onSubmit={onSubmit} className='modal__window setPathModal'>
        <div className='setPathModal__title'>
          Select your Bouncebox location
        </div>
        <div className='setPathModal__input__group'>
          <input
            {...register('homeFolderPath')}
            className={`setPathModal__input ${
              errors.homeFolderPath && 'input--invalid'
            }`}
            placeholder='Home Folder Path'
          ></input>

          <div
            onClick={openFilePicker}
            className='setPathModal__btn setPathModal__btn--browse'
          >
            Browse
          </div>
        </div>

        <button className={`setPathModal__btn`}>Confirm</button>
      </form>
    </Modal>
  )
}

const mapDispatchToProps = { setHomeFolderPath }

export default connect(null, mapDispatchToProps)(SetPathModal)
