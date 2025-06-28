import { Suspense } from "react"
import JournalForm from "./journal-form"

export default function NewJournalPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <JournalForm />
    </Suspense>
  )
}
