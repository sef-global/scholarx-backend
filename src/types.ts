interface Option {
// To be completed
}
interface Question {
    question: string
    answer: string
    // Types should be declared here
    type: "TYPES"
    options: Option
}

export interface MenteeApplication {
    answers: Question[]
    state: string
    mentor_id: bigint
}
