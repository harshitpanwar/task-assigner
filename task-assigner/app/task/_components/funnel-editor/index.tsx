'use client'
import { Button } from '@/components/ui/button'
// import { getFunnelPageDetails } from '@/lib/queries'
import { useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { EyeOff } from 'lucide-react'
import React, { useEffect } from 'react'
import Recursive from './funnel-editor-components/recursive'

type Props = { funnelPageId?: string; taskId?: string; liveMode?: boolean }

const FunnelEditor = ({ funnelPageId, liveMode, taskId }: Props) => {
  const { dispatch, state } = useEditor();
  console.log('state:', state);

  useEffect(() => {
    if (liveMode) {
      console.log('liveMode:', liveMode);
      dispatch({
        type: 'TOGGLE_LIVE_MODE',
        payload: { value: true },
      });
    }
  }, [liveMode, dispatch]);

  const getTaskDetails = async () => {
    const url = `/api/tasks/task?taskId=${taskId}`;
    const response = await fetch(url);
    const data = await response.json();
    return data;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTaskDetails();
        if (!response) return;

        const elements = Array.isArray(response.tasks[0].question)
          ? response.tasks[0].question
          : [];


        dispatch({
          type: 'LOAD_DATA',
          payload: {
            elements: elements.length > 0 ? elements : '',
            withLive: !!liveMode,
          },
        });
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    if (taskId) {
      fetchData();
    }
  }, [taskId, liveMode, dispatch]);

  const handleClick = () => {
    dispatch({
      type: 'CHANGE_CLICKED_ELEMENT',
      payload: {},
    })
  }

  const handleUnpreview = () => {
    dispatch({ type: 'TOGGLE_PREVIEW_MODE' })
    dispatch({ type: 'TOGGLE_LIVE_MODE' })
  }
  return (
    <div
      className={clsx(
        'use-automation-zoom-in h-full overflow-scroll mr-[385px] bg-background transition-all rounded-md',
        {
          '!p-0 !mr-0':
            state.editor.previewMode === true || state.editor.liveMode === true,
          '!w-[850px]': state.editor.device === 'Tablet',
          '!w-[420px]': state.editor.device === 'Mobile',
          'w-full': state.editor.device === 'Desktop',
        }
      )}
      onClick={handleClick}
    >
      {state.editor.previewMode && state.editor.liveMode && (
        <Button
          variant={'ghost'}
          size={'icon'}
          className="w-6 h-6 bg-slate-600 p-[2px] fixed top-0 left-0 z-[100]"
          onClick={handleUnpreview}
        >
          <EyeOff />
        </Button>
      )}
      {Array.isArray(state.editor.elements) &&
        state.editor.elements.map((childElement) => (
          <Recursive
            key={childElement.id}
            element={childElement}
          />
        ))}
    </div>
  )
}

export default FunnelEditor
