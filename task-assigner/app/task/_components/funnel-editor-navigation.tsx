'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
// import { saveActivityLogsNotification, upsertFunnelPage } from '@/lib/queries'
import { DeviceTypes, useEditor } from '@/providers/editor/editor-provider'
// import { FunnelPage } from '@prisma/client'
import clsx from 'clsx'
import {
  ArrowLeftCircle,
  EyeIcon,
  Laptop,
  Redo2,
  Smartphone,
  Tablet,
  Undo2,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { FocusEventHandler, useEffect, useState } from 'react'
import { toast } from 'sonner'

type Props = {
  funnelId?: string
//   funnelPageDetails: FunnelPage
  subaccountId?: string
  projectId?: string
}

const FunnelEditorNavigation = ({
  funnelId,
  subaccountId,
  projectId
}: Props) => {
  const router = useRouter()
  const { state, dispatch } = useEditor()
  const [annotators, setAnnotators] = useState<any[]>([])
  const [annotator, setAnnotator] = useState<string>("");
  const [taskName, setTaskName] = useState<string>("");

//   useEffect(() => {
//     dispatch({
//       type: 'SET_FUNNELPAGE_ID',
//       payload: { funnelPageId: funnelPageDetails.id },
//     })
//   }, [funnelPageDetails])

//   const handleOnBlurTitleChange: FocusEventHandler<HTMLInputElement> = async (
//     event
//   ) => {
//     if (event.target.value === funnelPageDetails.name) return
//     if (event.target.value) {
//       await upsertFunnelPage(
//         subaccountId,
//         {
//           id: funnelPageDetails.id,
//           name: event.target.value,
//           order: funnelPageDetails.order,
//         },
//         funnelId
//       )

//       toast('Success', {
//         description: 'Saved Funnel Page title',
//       })
//       router.refresh()
//     } else {
//       toast('Oppse!', {
//         description: 'You need to have a title!',
//       })
//       event.target.value = funnelPageDetails.name
//     }
//   }

  const handlePreviewClick = () => {
    dispatch({ type: 'TOGGLE_PREVIEW_MODE' })
    dispatch({ type: 'TOGGLE_LIVE_MODE' })
  }

  const handleUndo = () => {
    dispatch({ type: 'UNDO' })
  }

  const handleRedo = () => {
    dispatch({ type: 'REDO' })
  }

  const handleOnSave = async () => {
    const content = {
      name: taskName,
      question: state.editor.elements,
      project: projectId,
      annotator: annotator,
    }
    console.log("content", content);
    try {

      if(!taskName) {
        alert("Task name is required");
        return;
      }

      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });

      const data = await response.json();

      console.log("Task created:", data);
      router.push(`/projects/${projectId}/tasks`);


    //   const response = await upsertFunnelPage(
    //     subaccountId,
    //     {
    //       ...funnelPageDetails,
    //       content,
    //     },
    //     funnelId
    //   )
    //   await saveActivityLogsNotification({
    //     agencyId: undefined,
    //     description: `Updated a funnel page | ${response?.name}`,
    //     subaccountId: subaccountId,
    //   })
    //   toast('Success', {
    //     description: 'Saved Editor',
    //   })
    } catch (error) {
      toast('Oppse!', {
        description: 'Could not save editor',
      })
    }
  }

  const fetchAnnotators = async () => {
    try {
      const res = await fetch(`/api/user?role=annotator`);
      const data = await res.json();
      setAnnotators(data.users);
      setAnnotator(data.users[0]._id);
    } catch (error) {
      console.error("Error fetching annotators:", error);
    }
  };

  useEffect(() => {
      fetchAnnotators();
  }, []);

  return (
    <TooltipProvider>
      <nav
        className={clsx(
          'border-b-[1px] flex items-center justify-between p-6 gap-2 transition-all',
          { '!h-0 !p-0 !overflow-hidden': state.editor.previewMode }
        )}
      >
        <aside className="flex items-center gap-4 max-w-[260px] w-[300px]">
          <Link href={`/projects/${projectId}/tasks`}>
            <ArrowLeftCircle />
          </Link>
          <div className="flex flex-col w-full ">
            <Input
            //   defaultValue={funnelPageDetails.name}
              className="border-none h-5 m-0 p-0 text-lg"
            //   onBlur={handleOnBlurTitleChange}
            />
            <span className="text-sm text-muted-foreground">
              {/* Path: / */}
              {/* {funnelPageDetails.pathName} */}
            </span>
          </div>
        </aside>
        <div>
          <input type="text" placeholder="Task Name" value={taskName} onChange={(e) => setTaskName(e.target.value)} />
        </div>
        <aside>
          <Tabs
            defaultValue="Desktop"
            className="w-fit "
            value={state.editor.device}
            onValueChange={(value: any) => {
              dispatch({
                type: 'CHANGE_DEVICE',
                payload: { device: value as DeviceTypes },
              })
            }}
          >
            <TabsList className="grid w-full grid-cols-3 bg-transparent h-fit">
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger
                    value="Desktop"
                    className="data-[state=active]:bg-muted w-10 h-10 p-0"
                  >
                    <Laptop />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Desktop</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger
                    value="Tablet"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <Tablet />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tablet</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <TabsTrigger
                    value="Mobile"
                    className="w-10 h-10 p-0 data-[state=active]:bg-muted"
                  >
                    <Smartphone />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Mobile</p>
                </TooltipContent>
              </Tooltip>
            </TabsList>
          </Tabs>
        </aside>
        <div className="flex flex-row items-center gap-4">
          <span>Annotator:</span>
          <select
            value={annotator}
            onChange={(e) => setAnnotator(e.target.value)}
            className="border p-2 w-full"
          >
            {annotators.map((annotator) => (
              <option key={annotator._id} value={annotator._id}>
                {annotator.name}
              </option>
            ))}
          </select>
        </div>
        <aside className="flex items-center gap-2">
          <Button
            variant={'ghost'}
            size={'icon'}
            className="hover:bg-slate-800"
            onClick={handlePreviewClick}
          >
            <EyeIcon />
          </Button>
          {/* <Button
            disabled={!(state.history.currentIndex > 0)}
            onClick={handleUndo}
            variant={'ghost'}
            size={'icon'}
            className="hover:bg-slate-800"
          >
            <Undo2 />
          </Button>
          <Button
            disabled={
              !(state.history.currentIndex < state.history.history.length - 1)
            }
            onClick={handleRedo}
            variant={'ghost'}
            size={'icon'}
            className="hover:bg-slate-800 mr-4"
          >
            <Redo2 />
          </Button> */}
          <div className="flex flex-col item-center mr-4">
            <div className="flex flex-row items-center gap-4">
              Draft
              <Switch
                disabled
                defaultChecked={true}
              />
              {/* Publish */}
            </div>
            <span className="text-muted-foreground text-sm">
              Last updated 
              {/* {funnelPageDetails.updatedAt.toLocaleDateString()} */}
            </span>
          </div>
          <Button className='hover:cursor-pointer' onClick={handleOnSave}>Create Task</Button>
        </aside>
      </nav>
    </TooltipProvider>
  )
}

export default FunnelEditorNavigation