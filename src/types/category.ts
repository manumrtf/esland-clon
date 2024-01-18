export interface Category {
    name: string,
    candidates: Candidate[]
}

export interface Candidate {
    name: string,
    clip_cover: string,
    clip_media: string
}

export interface Vote {
    id: string,
    user: string,
    votes: VoteItem[]
}

export interface VoteItem {
    candidate: string,
    category: string,
    position: number
}