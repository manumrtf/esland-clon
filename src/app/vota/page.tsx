import { CandidatesGrid } from "@/components/candidates-grid"
import { Category } from "@/types/category"
import Image from "next/image"
import { useState } from "react"

async function getCategories() {
    const res = await fetch('http://localhost:4000/categories', { next: { revalidate: 1 } })
    const data = await res.json() as Category[]
    return data

}

export default async function Page() {
    const categories = await getCategories()
    return (
        <div>
            <header className="h-[91px] bg-esland-dark-blue">

            </header>
            <CandidatesGrid categories={categories} />
        </div>
    )
}