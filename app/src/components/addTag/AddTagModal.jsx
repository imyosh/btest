import React from 'react'
import './addTagModal.scss'

import { useForm } from 'react-hook-form'
import { connect } from 'react-redux'
import { addTagName } from '../../redux/components/projects/projectsSlice'

import Modal from '../modal/Modal'

const addTagModal = ({ isOpen, setIsOpen, projectId, addTagName }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = handleSubmit((data) => {
    addTagName({ id: projectId, value: data })
    setTimeout(() => {
      reset()
    }, 300)
    setIsOpen(false)
  })

  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <form onSubmit={onSubmit} className='modal__window addTagModal'>
        <div className='addTagModal__title'>Add Tag</div>
        <input
          {...register('name', { required: true })}
          className={`addTagModal__input ${errors.name && 'input--invalid'}`}
          placeholder='Name'
        ></input>

        <div className='addTagModal__radio__group'>
          <input
            className='addTagModal__radio addTagModal__radio--1'
            {...register('color')}
            type='radio'
            name='color'
            value='#1B998B'
            defaultChecked
          ></input>
          <input
            className='addTagModal__radio addTagModal__radio--2'
            {...register('color')}
            type='radio'
            name='color'
            value='#F39237'
          ></input>
          <input
            className='addTagModal__radio addTagModal__radio--3'
            {...register('color')}
            type='radio'
            name='color'
            value='#FF0B6D'
          ></input>
          <input
            className='addTagModal__radio addTagModal__radio--4'
            {...register('color')}
            type='radio'
            name='color'
            value='#813EFB'
          ></input>
          <input
            className='addTagModal__radio addTagModal__radio--5'
            {...register('color')}
            type='radio'
            name='color'
            value='#00A8E8'
          ></input>
        </div>
        <button className={`addTagModal__btn`}>Add Tag</button>
      </form>
    </Modal>
  )
}

const mapDispatchToProps = { addTagName }

export default connect(null, mapDispatchToProps)(addTagModal)
