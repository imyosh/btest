import React, { useState } from 'react'
import './pusher.scss'

import {
  setIsProjectChanged,
  updateProject,
} from '../../redux/components/projects/projectsSlice'

import { connect } from 'react-redux'
import { useForm } from 'react-hook-form'
import axios from 'axios'

import { readLocalProject, linkVersions } from '../../funtions'

import RequstButton from '../requestButton/RequstButton'

const Pusher = ({
  activeProject,
  updateProject,
  setIsProjectChanged,
  userToken,
  userArtistName,
}) => {
  const [isPushing, setIspushing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const onSubmit = handleSubmit(async (data) => {
    if (!activeProject.artWork) {
      document
        .getElementsByClassName('artWork')[0]
        .classList.add('input--invalid')
      return
    }

    setIspushing(true)
    setIsSuccess(null)

    readLocalProject(activeProject.projectName)
      .then((files) => {
        console.log(files)

        if (files.length === 0) {
          setIspushing(false)
          setIsSuccess(false)
          return window.notify(
            'Create Project',
            'Add files to the project before pushing.'
          )
        }

        if (!activeProject.isRemoteFiles)
          axios
            .post(
              '/api/projects/Create',
              {
                projectName: activeProject.projectName,
                artistName: userArtistName,
                samples: files,
                tags: activeProject.tags,
                description: data.comment,
                artWork: [{ data: activeProject.artWork }],
              },
              {
                headers: {
                  'x-access-token': userToken,
                  'Content-Type': 'application/json',
                },
              }
            )
            .then(function (response) {
              console.log(response)
              updateProject({
                _id: activeProject._id,
                data: {
                  ...response.data.project,
                  activeVersion: response.data.version._id,
                  isRemoteFiles: true,
                },
              })
              setIspushing(false)
              setIsSuccess(true)
              reset()
              setIsProjectChanged({ path: activeProject.path, data: false })
            })
            .catch(function (error) {
              console.log(error)
              if (error.response.data.message)
                window.notify('Error', error.response.data.message)
              else window.notify()
              setIspushing(false)
              setIsSuccess(false)
            })
        else {
          axios
            .post(
              `/api/versions/Create/${activeProject._id}`,
              {
                artistName: userArtistName,
                comments: data.comment,
                versionName: activeProject.projectName,
                previousVersion_id: activeProject.activeVersion,
                samples: files,
              },
              {
                headers: {
                  'x-access-token': userToken,
                },
              }
            )
            .then(function (response) {
              console.log(response)
              updateProject({
                _id: activeProject._id,
                data: {
                  activeVersion: response.data.version._id,
                  versions: linkVersions([
                    ...activeProject.versions,
                    response.data.version,
                  ]),
                },
              })

              setIspushing(false)
              setIsSuccess(true)
              reset()
              setIsProjectChanged({ path: activeProject.path, data: false })
            })
            .catch(function (error) {
              console.log(error)
              window.notify()
              setIspushing(false)
              setIsSuccess(false)
            })
        }
      })
      .catch((err) => {
        window.notify()
      })
  })
  return (
    <form
      onSubmit={onSubmit}
      className={`pusher ${!activeProject.isChanged ? 'disable' : ''}`}
    >
      <input
        placeholder='Add comments'
        spellCheck={false}
        className={`pusher__input ${errors.comment && 'input--invalid'} ${
          isPushing ? 'disable' : ''
        }`}
        {...register('comment', {
          minLength: 4,
          maxLength: 250,
          required: true,
        })}
      ></input>

      <RequstButton
        isLoading={isPushing}
        isSuccess={isSuccess}
        label='Push'
        color={'#813efb'}
      />
    </form>
  )
}

const mapStateToProps = (state) => ({
  userToken: state.user.token,
  userArtistName: state.user.user.artistName,
})
const mapDispatchToProps = { updateProject, setIsProjectChanged }

export default connect(mapStateToProps, mapDispatchToProps)(Pusher)
