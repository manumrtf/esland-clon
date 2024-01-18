"use client"
import { Candidate, Category } from "@/types/category"
import Image from "next/image"
import { useEffect, useState } from "react"
import { gsap } from "gsap"

interface Props {
    categories: Category[]

}

export function CandidatesGrid({ categories }: Props) {
    const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0)
    const currentCategory = categories[currentCategoryIndex]
    const [selectedCandidates, setSelectedCandidates] = useState<{ category: string, candidate: string }[]>([])
    const [currentCategoryText, setCurrentCategoryText] = useState(currentCategory.name)

    function toggleCandidateSelect(category: string, candidate: string) {
        setSelectedCandidates((prev) => {
            const categoryCandidates = prev.filter((c) => c.category === category)
            // the category has already 4 candidates and the candidate is not selected
            if (categoryCandidates.length >= 4 && !categoryCandidates.find((c) => c.candidate === candidate)) {
                return prev // leave the state as it is
            }
            // the candidate is already selected for the current category
            if (prev.find((c) => c.category === category && c.candidate === candidate)) {
                return prev.filter((c) => !(c.category === category && c.candidate === candidate)) // deselect the candidate
            }
            // the category has less than 4 candidates and the candidate is not selected
            else {
                return [...prev, { category, candidate }] // select the candidate
            }
        })
    }

    function isCandidateSelected(candidate: string) {
        // check if the candidate is selected for the current category
        return selectedCandidates.some((c) => c.candidate === candidate)
    }


    function nextCategory() {
        //prevent animation if it's already running

        if (gsap.isTweening("#logo-text")) {
            return
        }
        // if it's the last category, send the results
        if (currentCategoryIndex === categories.length - 1) {

            return submitVotes()
        }
        setCurrentCategoryIndex((prev) => prev + 1)
    }

    function prevCategory() {
        //prevent animation if it's already running
        if (gsap.isTweening("#logo-text")) {
            return
        }
        if (currentCategoryIndex === 0) {
            return
        }
        setCurrentCategoryIndex((prev) => prev - 1)
    }


    function getCurrentVotes() {
        // get the number of selected candidates for the current category
        return selectedCandidates.filter((c) => c.category === currentCategory.name).length
    }


    function getSelectedCandidatePosition(candidate: Candidate) {
        // get the index of the candidate in the selected candidates array
        return selectedCandidates.filter((c) => c.category === currentCategory.name).findIndex((c) => c.candidate === candidate.name) + 1
    }

    function submitVotes() {
        /*   const data = categories.map(category => {
              const categoryCandidates = selectedCandidates.filter(candidate => candidate.category === category.name);
              return {
                  user: "user1",
                  category: category.name,
                  candidates: categoryCandidates.map((candidate, index) => ({ candidate: candidate.candidate, position: index + 1 }))
              };
          }); */

        const categoryPositions: { [key: string]: number } = {};

        const data = selectedCandidates.reduce((acc: { candidate: string; category: string; position: number }[], candidate) => {
            // Initialize or increment the position for the current category
            categoryPositions[candidate.category] = (categoryPositions[candidate.category] || 0) + 1;

            // Add the candidate with the updated position to the accumulator
            acc.push({
                candidate: candidate.candidate,
                category: candidate.category,
                position: categoryPositions[candidate.category]
            });

            return acc;
        }, []);

        fetch("http://localhost:4000/votes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user: "user1",
                votes: data
            })
        })

    }


    useEffect(() => {
        // Animation for the candidates cards

        gsap.fromTo("#candidate", {
            opacity: 0,
            y: 100,
            scale: 0.5
        }, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            scale: 1
        })

        // Timeline for the logo text

        const tl = gsap.timeline()

        // Blinking animation: 3 times
        tl.to("#logo-text", {
            duration: 0.1, // Duration for one phase of blinking
            opacity: 0,
            ease: "power2.inOut",
            repeat: 2, // Repeat the animation 2 more times (total 3 blinks)
            yoyo: true, // Go back to the initial state after each animation
            // at the end of this, the text will be hidden because of the opacity: 0
        }).then(() => {
            //when the text is hidden, change the text
            setCurrentCategoryText(currentCategory.name)
        }).then(() => {
            //when the text is already changed, proceed with the animation to show the text again

            // First step: modify the width of the text to 0
            tl.to("#logo-text", {
                duration: 0.5,
                width: 0,
                ease: "power2.out",
            })
            // Second step: take the text width back to auto
            tl.to("#logo-text", {
                duration: 0.5,
                width: "auto",
                ease: "power2.out",
            })
            // Third step: take the text opacity back to 1
            tl.to("#logo-text", {
                opacity: 1,
                duration: 0.5,
                ease: "power2.out",
            }, ">")


        });





    }, [currentCategoryIndex, currentCategory.name])

    return (
        <main className={`min-h-screen bg-[position:55%,30%] bg-[length:150%] bg-no-repeat bg-esland-light-blue xl:bg-esland-cover`}>
            <div className="flex flex-col items-center py-3 sm:py-12">
                <Image src={'/assets/corona-top.svg'} alt="" width={312} height={62.5} className="w-[262px] h-[40px] sm:h-[62px]" />
                <div className="flex justify-center items-center gap-12 ">
                    <Image src={'/assets/corona-left.svg'} alt="" width={90} height={240} className="w-[45px] h-[120px] sm:w-[90px] sm:h-[240px]" />
                    <h2 className="text-xl uppercase  font-bold sm:text-2xl sm:tracking-[15px] mx-auto sm:text-center sm:font-light sm:max-w-[312px] sm:leading-relaxed" id="logo-text">
                        {currentCategoryText}
                    </h2>
                    <Image src={'/assets/corona-right.svg'} alt="" width={90} height={240} className="w-[45px] h-[120px] sm:w-[90px] sm:h-[240px]" />

                </div>
            </div>
            <div className="grid justify-center grid-cols-2 gap-3 mx-auto max-w-[672px] xl:grid-cols-5 xl:max-w-none xl:w-3/4 px-4">

                {
                    currentCategory.candidates.map((candidate) => (
                        <div id="candidate"
                            key={candidate.name}
                            className="bg-esland-light-blue w-full relative"
                            onClick={() => toggleCandidateSelect(currentCategory.name, candidate.name)}
                        >
                            <Image src={`/assets/${candidate.clip_cover}`} alt="" width={191} height={107} className={`${isCandidateSelected(candidate.name) ? "mix-blend-normal" : "mix-blend-luminosity"} w-full hover:mix-blend-normal hover:shadow-candidate-card`} />
                            <div className="bg-[#1682c7] py-3 text-sm text-center">
                                <p>{candidate.name}</p>
                            </div>
                            {
                                isCandidateSelected(candidate.name) && (
                                    <span className="bg-esland-light-blue text-white text-xl absolute top-1 left-1 px-2 font-bold">
                                        {getSelectedCandidatePosition(candidate)}
                                    </span>
                                )
                            }
                        </div>
                    ))
                }

            </div>
            <div className="flex flex-col items-center mt-6 gap-8">
                <div className="flex items-center gap-4">
                    {currentCategoryIndex !== 0 && <button onClick={prevCategory} className="border-2 px-3 py-1 text-md font-bold">{"<"}</button>}
                    <p className="text-lg font-bold">CATEGORÍA <span className="text-2xl">{currentCategoryIndex + 1}/{categories.length}</span></p>
                    <button className="border-2 px-3 py-1 text-md font-bold"
                        onClick={nextCategory}
                    >{'>'}</button>
                </div>
                <p className="text-lg font-bold">VOTOS REALIZADOS <span className="text-2xl">{getCurrentVotes()}/4</span></p>

            </div>
        </main>
    )
}