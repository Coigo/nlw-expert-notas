import './index.css'
import logo from './assets/Logo.svg'
import { NoteCard } from './components/Note-card'
import { NewNoteCard } from './components/New-note-card'
import { ChangeEvent, useState } from 'react'

interface Note {
  id:string
  date: Date
  content: string
}

export function App() {

  const [search, setSearch] = useState('')
  const [notes, setNotes] =  useState<Note[]>(() => {

    const notesStorage = localStorage.getItem('notes')
    if (notesStorage) {
      return JSON.parse(notesStorage)
    }
    return []

  })


function handleSearch (event: ChangeEvent<HTMLInputElement>) {
  const query = event.target.value
  setSearch(query)
}

function onNoteDelete (id: string) {
  const notesArr = notes.filter(note => {
    return note.id !== id
  })
  setNotes(notesArr)
}

const filteredNotes = search !== ''
  ? notes.filter(note => note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
  : notes 

function onCreateNote(content:string) {
  const newNote = {
    id: crypto.randomUUID(),
    date: new Date(),
    content
  }

  const notesArr = [newNote, ...notes]

  setNotes([newNote, ...notes])
  localStorage.setItem('notes', JSON.stringify(notesArr))
}

  return (
    <div className='mx-auto max-w-6xl my-12 space-y-6 px-5'>
        <img src={logo} alt="nlw expert"/>

        <form className="w-full">

            <input type="text" 
                placeholder='Busque suas notas' 
                className='w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500'
                onChange={handleSearch}
            />

        </form>

        <div className="h-px bg-slate-700"></div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">

        <NewNoteCard onNoteCreated={onCreateNote}/>

        { filteredNotes.map(note => {
          return <NoteCard onNoteDelete={onNoteDelete} key={note.id}note={note} />
        }) 
        }




        </div>

    </div>

    
  )
}

 