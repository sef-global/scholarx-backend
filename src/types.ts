interface Option {
// todo: To be determined
}
interface Question {
    question: string
    answer: string
    // todo: Types should be declared here
    type: "TYPES"
    options: Option
}

export interface MenteeApplication {
    answers: Question[]
    state: string
    mentor_id: bigint
}
