'use client'

import React from 'react'
import Page from '@/app/task/[projectId]/page'

type Props = {
    params: {
        taskId: string,
        projectId: string
    }
}


const page = (props: Props) => {
    console.log('props:', props)
  return (
      <Page params={{ taskId: props.params.taskId, liveMode: true, projectId: props.params.projectId}} />
  )
}

export default page