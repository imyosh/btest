import { store } from '../redux/store/store'
import axios from 'axios'

import {
  addProject,
  updateProject,
  addSample,
  removeSample,
  addBounce,
  removeBounce,
  setLastModified,
  appendLocalProject,
  appendRemoteProject,
} from '../redux/components/projects/projectsSlice'

const setupFilesOperations = (homeFolderPath) => {
  let {
    user: { user },
    projects: { data },
  } = store.getState()

  let createdProjects = data
  let foldersCount = api.getFlodersCount(homeFolderPath)

  console.log(foldersCount)

  if (foldersCount === 0) {
    createdProjects.map((project) => {
      store.dispatch(
        updateProject({
          projectName: project.projectName,
          data: { isLocalFiles: false },
        })
      )
    })
    const { token } = store.getState().user
    console.log('getting remote projects')
    axios
      .get('/api/projects/GetAll', {
        headers: {
          'x-access-token': token,
        },
      })
      .then((res) => {
        console.log('get all projects', res.data)
        res.data.map((project) => store.dispatch(appendRemoteProject(project)))
      })
  }

  console.log(foldersCount)

  window.api.onAddDir(
    homeFolderPath,
    {
      ignored: /(^|[\/\\])\../, // ignore dotfiles
      depth: 1,
    },
    (path) => {
      if (path === homeFolderPath) return
      if ((path.replace(homeFolderPath, '').match(/\//g) || []).length !== 1)
        return
      console.log(path)
      foldersCount--

      let projectName = path.replace(/^.*[\\\/]/, '')
      // if (projectName === 'untitled folder') return
      window.api.createBouncesFolder(path)

      let {
        projects: { data },
      } = store.getState()

      createdProjects = data

      console.log('createdProjects', createdProjects)

      let project = createdProjects.find(
        (project) => project.projectName === projectName
      )

      if (project) {
        createdProjects = createdProjects.filter(
          (project) => project.projectName !== projectName
        )

        console.log('project exsit')

        window.api.wasFileModified(
          path,
          project.lastModified,
          (res, modificationDate) => {
            console.log('is folder modified : ', res)
            if (res) {
              // console.log(project.path, 'is modified')
              store.dispatch(
                appendLocalProject({
                  ...project,
                  isChanged: true,
                  lastModified: modificationDate,
                  samples: [],
                  bounces: [],
                })
              )
            } else store.dispatch(appendLocalProject(project))
            projectFilesOperations(path, homeFolderPath, projectName, !res)
          }
        )
      } else {
        console.log('create new project')
        store.dispatch(addProject({ projectName, user }))
        projectFilesOperations(path, homeFolderPath, projectName, false)
      }

      console.log(foldersCount)
      if (foldersCount === 0) {
        const { token } = store.getState().user
        console.log('getting remote projects')
        axios
          .get('/api/projects/GetAll', {
            headers: {
              'x-access-token': token,
            },
          })
          .then((res) => {
            console.log('get all projects', res.data)
            res.data.map((project) =>
              store.dispatch(appendRemoteProject(project))
            )
          })

        createdProjects.map((project) => {
          store.dispatch(
            updateProject({
              projectName: project.projectName,
              data: { isLocalFiles: false },
            })
          )
        })
      }
    }
  )

  window.api.onRemoveDir(homeFolderPath, { depth: 1 }, (path) => {
    store.dispatch(
      updateProject({
        projectName: path.match(/([^\/]*)\/*$/)[1],
        data: { isLocalFiles: false },
      })
    )
  })

  window.api.onDirRename(
    homeFolderPath,
    {},
    (directoryPath, directoryPathNext) => {
      console.log(directoryPath, directoryPathNext) // "directoryPath" got renamed to "directoryPathNext"
      let oldProjectName = directoryPath.replace(/^.*[\\\/]/, '')
      let newProjectName = directoryPathNext.replace(/^.*[\\\/]/, '')

      store.dispatch(
        updateProject({
          projectName: oldProjectName,
          data: { projectName: newProjectName },
        })
      )
    }
  )
}

const projectFilesOperations = (
  path,
  homeFolderPath,
  projectName,
  ignoreInitial
) =>
  window.api.onAllFilesChange(path, { ignoreInitial }, (event, nestedPath) => {
    if (path !== nestedPath) {
      window.api.getLastModificationDate(path, (modificationDate) => {
        store.dispatch(setLastModified({ projectName, data: modificationDate }))
      })
    }

    console.log(nestedPath)

    if (isAudioFile(nestedPath)) {
      if (event === 'add') {
        if (nestedPath.includes(path + '/Bounces'))
          store.dispatch(
            addBounce({
              projectName,
              path: nestedPath.replace(homeFolderPath, ''),
            })
          )
        else
          store.dispatch(
            addSample({
              projectName,
              path: nestedPath.replace(homeFolderPath, ''),
            })
          )
      }
      if (event === 'unlink') {
        if (nestedPath.includes(path + '/Bounces'))
          store.dispatch(
            removeBounce({
              projectName,
              path: nestedPath.replace(homeFolderPath, ''),
            })
          )
        else
          store.dispatch(
            removeSample({
              projectName,
              path: nestedPath.replace(homeFolderPath, ''),
            })
          )
      }
    }
  })

const isAudioFile = (path) =>
  /\.(3gp|aa|aac|aax|act|aif|ala|amr|ape|a|awb|dss|dvf|fla|gsm|ikl|ivs|m4a|m4b|m4p|mmf|mp3|mpc|msv|nmf|og|opu|ra|raw|rf6|sln|tta|voc|vox|wav|wma|wv|web|8sv|cda)$/i.test(
    path
  )

export default setupFilesOperations
