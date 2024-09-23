'use client'

import { EditorBtns } from '@/lib/constants'
import { EditorElement, useEditor } from '@/providers/editor/editor-provider'
import clsx from 'clsx'
import { Trash } from 'lucide-react'
import React, { useState } from 'react'
import { UploadButton } from '@/utils/uploadthing'

type Props = {
  element: EditorElement
}

const AudioComponent = (props: Props) => {
  const { dispatch, state } = useEditor()
  const styles = props.element.styles
  const [audioUri, setAudioUri] = useState<string>("");


  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return
    e.dataTransfer.setData('componentType', type)
  }

  const handleOnClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch({
      type: 'CHANGE_CLICKED_ELEMENT',
      payload: {
        elementDetails: props.element,
      },
    })
  }

  const handleUpdateElement = (res: any) => {
    dispatch({
      type: 'UPDATE_ELEMENT',
      payload: {
        elementDetails: {
          content: {
            src: res?.[0]?.url,
          },
          id: props.element.id,
          name: 'Audio',
          styles: {},
          type: 'audio',
        },
      },
    });
    console.log('Updated element payload:', {
      elementDetails: {
      content: {
        src: res?.[0]?.url,
      },
      id: props.element.id,
      name: 'Audio',
      styles: {}, 
      type: 'audio',
      },
    });
  }

  const handleDeleteElement = () => {
    dispatch({
      type: 'DELETE_ELEMENT',
      payload: { elementDetails: props.element },
    })
  }

  return (
    <div
      style={styles}
      draggable
      onDragStart={(e) => handleDragStart(e, 'audio')}
      onClick={handleOnClick}
      className={clsx(
        'p-[2px] w-full m-[5px] relative text-[16px] transition-all flex items-center justify-center',
        {
          '!border-blue-500':
            state.editor.selectedElement.id === props.element.id,
          '!border-solid': state.editor.selectedElement.id === props.element.id,
          'border-dashed border-[1px] border-slate-300': !state.editor.liveMode,
        }
      )}
    >
      <div>
            {audioUri && <audio src={audioUri} controls />}
            <UploadButton endpoint="audioUploader" onClientUploadComplete = {
              (res) => {
                setAudioUri(res?.[0]?.url);
                handleUpdateElement(res);
              }
            }/>
      </div>
      <div className="absolute bg-black px-2.5 py-1 text-xs font-bold  -top-[25px] -right-[1px] rounded-none rounded-t-lg !text-white">
        <Trash
          className="cursor-pointer"
          size={16}
          onClick={handleDeleteElement}
        />
      </div>
    </div>
  )
}

export default AudioComponent
