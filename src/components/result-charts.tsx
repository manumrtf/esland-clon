"use client"
import { VoteItem } from "@/types/category";
import { Doughnut } from "react-chartjs-2";
// Assuming `data` is your parsed JSON array from the image
import { Chart, ArcElement } from 'chart.js'
Chart.register(ArcElement);


interface Props {
    votes: VoteItem[];
}
export function ResultCharts({ votes }: Props) {
    const data = {
        labels: [
            'Red',
            'Blue',
            'Yellow'
        ],
        datasets: [{
            label: 'My First Dataset',
            data: [300, 50, 100],
            backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
            ],
            hoverOffset: 4
        }]
    };
    console.log(votes)
    const clip_del_año = votes.filter(v => v.category === 'clip del año')
    return (
        <div>
            <Doughnut className="max-w-[200px] max-h-[200px] mx-auto" data={data} />
        </div>
    )
}