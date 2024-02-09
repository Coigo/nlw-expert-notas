import * as Dialog from '@radix-ui/react-dialog'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { X } from 'lucide-react'


interface NoteCardProps {
    note: {
        id: string
        date: Date
        content: string
    }
    onNoteDelete: (id: string) => void
}

export function NoteCard ({note, onNoteDelete}: NoteCardProps) {

    return (
        <Dialog.Root> 
            <Dialog.Trigger className="rounded-md text-left flex flex-col bg-slate-800 p-5 space-y-3 overflow-hidden relative hover:ring-2 slate-600 ">
                <span className='text-sm font-medium text slate-400' > { formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true}) } </span>
                <p className='text-sm leading-6 text-slate-400' >
                    { note.content }
                </p>
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-slate-950/50 to-black/0 "></div>
            </Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className='inset-0 fixed bg-black/40' />
                <Dialog.Content className='fixed  md:left-1/2 md:top-1/2 inset-0 md:inset-auto md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] md:h-[60vh] w-full bg-slate-700 rounded-md flex flex-col outlite-none overflow-hidden' > 

                    <Dialog.Close className='absolute right-0 top-0 m-3' > <X className='hover:text-slate-500'/> </Dialog.Close>

                    <div className="flex flex-1 flex-col gap-3 p-5">
                    <span className='text-sm font-medium text slate-400' > { formatDistanceToNow(note.date, {locale: ptBR, addSuffix: true}) } </span>
                    <p className='text-sm leading-6 text-slate-400' >
                        { note.content }
                    </p>
                    </div>
                    <button onClick={() => onNoteDelete(note.id)} className='w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:bg-slate-600 ' >
                        Apagar Nota
                    </button>

                </Dialog.Content>
                </Dialog.Portal>
        </Dialog.Root>
    )

}