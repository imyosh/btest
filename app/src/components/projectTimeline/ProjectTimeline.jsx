import React, { useEffect, useRef, useState } from 'react'
import './projectTimeline.scss'

import axios from 'axios'
import { connect } from 'react-redux'
import { updateProject } from '../../redux/components/projects/projectsSlice'

import { linkVersions } from '../../funtions'
import { downloadVersion, deleteVersion } from '../../funtions/crud'

import ConfirmModal from '../confrimModal/ConfirmModal'

import { ContextMenu, MenuItem } from 'react-contextmenu'
import TimeLineElement from '../timeLineElement/TimeLineElement'

// let data = [
//   { current: 1, last: 0 },
//   { current: 2, last: 1 },
//   { current: 3, last: 1 },
//   { current: 4, last: 3 },
//   { current: 5, last: 2 },
//   { current: 6, last: 5 },
// ]

let data = [
  {
    current: 1,
    last: 0,
    _id: '636d45251068522526f9eca7',
    versionName: 'Gold v1',
    project_id: '636d45251068522526f9eca5',
    previousVersion_id: null,
    version_comment: 'Initial version',
    Version_Bounces: [],
    Version_Samples: [],
    createdAt: '2022-11-10T18:38:29.295Z',
    updatedAt: '2022-11-10T18:38:29.295Z',
    __v: 0,
  },
  {
    current: 2,
    last: 1,
    _id: '636d45511068522526f9ecaf',
    versionName: 'Gold',
    project_id: '636d45251068522526f9eca5',
    previousVersion_id: '636d45251068522526f9eca7',
    version_comment: 'the second version ( with one file )',
    Version_Bounces: [
      {
        VersionId: 'RQ_k288vF_kwosY8tJiNjkhAGWqX0KCw',
        Location:
          'https://bouncebox-bucket.s3.us-east-2.amazonaws.com/636d45251068522526f9eca5/Gold/bounces//Post-Malone-13-Internet.mp3',
        Key: '636d45251068522526f9eca5/Gold/bounces//Post-Malone-13-Internet.mp3',
        Bucket: 'bouncebox-bucket',
        _id: '636d45511068522526f9ecb0',
      },
    ],
    Version_Samples: [
      {
        VersionId: 'pfn77tCKAnv7DXICcjSgHcPQe0Slg44T',
        Location:
          'https://bouncebox-bucket.s3.us-east-2.amazonaws.com/636d45251068522526f9eca5/Gold/samples//Post-Malone-13-Internet.mp3',
        Key: '636d45251068522526f9eca5/Gold/samples//Post-Malone-13-Internet.mp3',
        Bucket: 'bouncebox-bucket',
        _id: '636d45511068522526f9ecb1',
      },
    ],
    createdAt: '2022-11-10T18:39:13.722Z',
    updatedAt: '2022-11-10T18:39:13.722Z',
    __v: 0,
  },
  {
    current: 3,
    last: 1,
    _id: '636d45e71068522526f9ecc6',
    versionName: 'Gold',
    project_id: '636d45251068522526f9eca5',
    previousVersion_id: '636d45511068522526f9ecaf',
    version_comment: 'JUST FOR FUN',
    Version_Bounces: [
      {
        VersionId: 'fAmSUUxaGgTI01uWeVQme4wVZnfCtLAd',
        Location:
          'https://bouncebox-bucket.s3.us-east-2.amazonaws.com/636d45251068522526f9eca5/Gold/bounces//Post-Malone-13-Internet.mp3',
        Key: '636d45251068522526f9eca5/Gold/bounces//Post-Malone-13-Internet.mp3',
        Bucket: 'bouncebox-bucket',
        _id: '636d45e71068522526f9ecc7',
      },
    ],
    Version_Samples: [
      {
        VersionId: 'tmRtBHCI4CRMNyVzf4_kPyL.MbrfZnA0',
        Location:
          'https://bouncebox-bucket.s3.us-east-2.amazonaws.com/636d45251068522526f9eca5/Gold/samples//Post-Malone-13-Internet.mp3',
        Key: '636d45251068522526f9eca5/Gold/samples//Post-Malone-13-Internet.mp3',
        Bucket: 'bouncebox-bucket',
        _id: '636d45e71068522526f9ecc8',
      },
    ],
    createdAt: '2022-11-10T18:41:43.141Z',
    updatedAt: '2022-11-10T18:41:43.141Z',
    __v: 0,
  },

  {
    _id: '636d45e71068522526f9enew',
    previousVersion_id: '636d45251068522526f9eca7',
  },
]

const ProjectTimeline = ({ activeProject, updateProject, userToken }) => {
  const bodyRef = useRef(null)

  let activeCol = 1
  let versionsColumns = {}

  useEffect(() => {
    // console.log(activeProject)
    if (activeProject.isRemoteFiles) {
      axios
        .get(`/api/versions/GetAll/${activeProject._id}`, {
          headers: {
            'x-access-token': userToken,
          },
        })
        .then(function (response) {
          console.log(response)

          console.log(linkVersions(response.data))

          updateProject({
            _id: activeProject._id,
            data: { versions: linkVersions(response.data) },
          })
        })
        .catch(function (error) {
          console.log(error)
          window.api.send('show-error-message', {
            title: '',
            message: error.response.data.message,
          })
        })
    }
  }, [])

  return (
    <div className='projectTimeline'>
      <div ref={bodyRef} className='projectTimeline__body'>
        {!activeProject.versions
          ? null
          : activeProject.versions
              .map((version, id) => {
                if (version.last + 1 === version.current) {
                  // return activeCol
                } else {
                  activeCol = activeCol + 1
                  // return activeCol
                }

                versionsColumns[id + 1] = activeCol

                return (
                  <React.Fragment key={id}>
                    <ContextMenu id={`${id}`}>
                      <MenuItem
                        onClick={() =>
                          downloadVersion(
                            version,
                            activeProject.projectName,
                            activeProject._id
                          )
                        }
                      >
                        Download Version
                      </MenuItem>
                      <MenuItem
                        disabled={
                          activeProject.activeVersion === version._id
                            ? true
                            : false
                        }
                        className={
                          activeProject.activeVersion === version._id
                            ? 'disable'
                            : ''
                        }
                        onClick={() =>
                          window.testConfirm(
                            'Delete Version',
                            'Are you sure you want to delete this version ',
                            () => {
                              console.log(version._id)
                              window.loading(
                                'Delete',
                                'the version is getting deleted.',
                                'red'
                              )
                              deleteVersion(
                                activeProject,
                                version._id,
                                activeProject.versions
                              )
                                .then((res) => {
                                  console.log(res)
                                  window.finishLoading()
                                })
                                .catch((err) => {
                                  console.log(err)
                                  window.finishLoading()
                                  window.notify()
                                })
                            }
                          )
                        }
                      >
                        Delete Version
                      </MenuItem>
                    </ContextMenu>
                    {/* <ContextMenuTrigger id={id}> */}
                    <TimeLineElement
                      contextMenuTriggerId={id}
                      activeCol={activeCol}
                      data={version}
                    />
                    {/* </ContextMenuTrigger> */}

                    <div
                      className={`projectTimeline__version projectTimeline__version--col${activeCol} ${
                        activeProject.activeVersion === version._id
                          ? 'projectTimeline__version--active'
                          : ''
                      }`}
                      style={{
                        '--after-height': `${
                          (version.current - version.last) * 5.85
                        }rem`,
                        '--bottom': `-${
                          (version.current - version.last) * 5.85
                        }rem`,
                        '--before-width': `${
                          (activeCol - versionsColumns[version.last]) * 100
                        }%`,
                      }}
                    >
                      <div>V{version.current}</div>
                    </div>
                  </React.Fragment>
                )
              })
              .reverse()}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  userToken: state.user.token,
})

const mapDispatchToProps = { updateProject }

export default connect(mapStateToProps, mapDispatchToProps)(ProjectTimeline)
