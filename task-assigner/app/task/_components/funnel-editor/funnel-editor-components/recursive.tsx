'use client'

import { EditorElement } from '@/providers/editor/editor-provider'
import React from 'react'
import TextComponent from './text'
import Container from './container'
import VideoComponent from './video'
import LinkComponent from './link-component'
import RadioButton from './radio-button'
import AudioComponent from './audio'
// import ContactFormComponent from './contact-form-component'
// import Checkout from './checkout'

type Props = {
  element: EditorElement
}

const Recursive = ({ element }: Props) => {
  switch (element.type) {
    case 'text':
      return <TextComponent element={element} />
    case 'container':
      return <Container element={element} />
    case 'video':
      return <VideoComponent element={element} />
    case 'audio':
      return <AudioComponent element={element} />
    case 'contactForm':
      // return <ContactFormComponent element={element} />
      return <div>Contact Form</div>
    case 'paymentForm':
      return <div>Payment Form</div>
    case '2Col':
      return <Container element={element} />
    case '__body':
      return <Container element={element} />
    case 'link':
      return <LinkComponent element={element} />
    case 'radioBtn':
      return <RadioButton element={element}/>

    default:
      return null
  }
}

export default Recursive
