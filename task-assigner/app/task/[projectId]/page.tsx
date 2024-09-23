// import { db } from '@/lib/db'
'use client'
import EditorProvider from '@/providers/editor/editor-provider'
import React from 'react'
import FunnelEditorNavigation from '../_components/funnel-editor-navigation'
import FunnelEditorSidebar from '../_components/funnel-editor-sidebar'
import FunnelEditor from '../_components/funnel-editor'

type Props = {
  params: {
    subaccountId?: string
    funnelId?: string
    funnelPageId?: string
    projectId?: string
    taskId?: string
    liveMode?: boolean
  }
}

const Page = async ({ params }: Props) => {

//   const funnelPageDetails = await db.funnelPage.findFirst({
//     where: {
//       id: params.funnelPageId,
//     },
//   })
//   if (!funnelPageDetails) {
//     return redirect(
//       `/subaccount/${params.subaccountId}/funnels/${params.funnelId}`
//     )
//   }
  console.log('params:', params)
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-[20] bg-background overflow-hidden">
      <EditorProvider
        subaccountId={params.subaccountId}
        funnelId={params.funnelId}
        projectId={params.projectId}
        // pageDetails={funnelPageDetails}
      >
        <FunnelEditorNavigation
          funnelId={params.funnelId}
          // funnelPageDetails={funnelPageDetails}
          subaccountId={params.subaccountId}
          projectId={params.projectId}
        />
        <div className="h-full flex justify-center">
          {
          params.liveMode && params.taskId? (
            <FunnelEditor funnelPageId={params.funnelPageId} taskId={params.taskId} />
          ):(
            <FunnelEditor funnelPageId={params.funnelPageId} />
          )}
        </div>

        <FunnelEditorSidebar subaccountId={params.subaccountId} />
      </EditorProvider>
    </div>
  )
}

export default Page