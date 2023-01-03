import { Input } from '../../components/Input'
import { Segment } from '../../components/Segment'
import { Textarea } from '../../components/Textarea'
import { useState } from 'react'

export const NewIdeaPage = () => {
  const [state, setState] = useState({
    name: '',
    nick: '',
    description: '',
    text: '',
  })

  return (
    <Segment title="New Idea">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          console.info('Submitted', state)
        }}
      >
        <Input label="Name" name="name" state={state} setState={setState} />
        <Input label="Nick" name="nick" state={state} setState={setState} />
        <Input label="Description" name="description" state={state} setState={setState} />
        <Textarea label="Text" name="text" state={state} setState={setState} />
        <button type="submit">Create Idea</button>
      </form>
    </Segment>
  )
}
