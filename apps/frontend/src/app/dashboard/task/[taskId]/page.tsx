"use client"
import { Appbar } from '../../components/Appbar';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { use } from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL; 

export default function Page({params}: {params: Promise<{ taskId: string }>}) {
    const { taskId } = use(params);
    const [result, setResult] = useState<Record<string, {
        count: number;
        option: {
            imageUrl: string
        }
    }>>({});
    const [taskDetails, setTaskDetails] = useState<{
        title?: string
    }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchTaskDetails() {
            try {
                setLoading(true);
                setError(null);
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("Not authenticated");
                }

                const response = await axios.get(
                    `${NEXT_PUBLIC_BACKEND_URL}/api/v1/user/task?taskId=${taskId}`,
                    {
                        headers: {
                            "Authorization": token
                        }
                    }
                );

                if (response.data.result) {
                    setResult(response.data.result);
                }
                if (response.data.taskDetails) {
                    setTaskDetails(response.data.taskDetails);
                }
            } catch (err) {
                console.error("Failed to fetch task details:", err);
                setError(err instanceof Error ? err.message : "Failed to load task details");
                toast.error("Failed to load task details");
            } finally {
                setLoading(false);
            }
        }

        fetchTaskDetails();
    }, [taskId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950">
                <Appbar />
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
                        <div className="text-lg text-slate-400">Loading task details...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950">
                <Appbar />
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
                        <div className="text-lg text-red-400 mb-2">Error Loading Task</div>
                        <div className="text-sm text-red-300/80">{error}</div>
                    </div>
                </div>
            </div>
        );
    }

    const totalVotes = Object.values(result).reduce((sum, item) => sum + item.count, 0);

    return (
        <div className="min-h-screen bg-slate-950">
            <Appbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent mb-4">
                        {taskDetails.title || "Untitled Task"}
                    </h1>
                    {totalVotes > 0 && (
                        <div className="text-slate-400">
                            Total Votes: <span className="text-violet-400 font-semibold">{totalVotes}</span>
                        </div>
                    )}
                </div>
                
                {Object.keys(result).length === 0 ? (
                    <div className="text-center bg-slate-900/50 border border-slate-800 rounded-xl p-8">
                        <div className="text-slate-400 mb-2">No options available for this task yet.</div>
                        <div className="text-sm text-slate-500">Check back later for results.</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(result).map(([optionId, data]) => (
                            <Task 
                                key={optionId}
                                imageUrl={data.option.imageUrl} 
                                votes={data.count}
                                totalVotes={totalVotes}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function Task({imageUrl, votes, totalVotes}: {
    imageUrl: string;
    votes: number;
    totalVotes: number;
}) {
    const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
    
    return (
        <div className="group relative bg-slate-900/50 border border-slate-800 rounded-xl overflow-hidden transition-all duration-300 hover:border-slate-700 hover:shadow-lg hover:shadow-violet-500/5">
            <div className="relative aspect-[3/2] w-full">
                <Image 
                    src={imageUrl} 
                    alt="Task option"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    priority={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-semibold text-violet-400">{votes}</span>
                        <span className="text-slate-400">votes</span>
                    </div>
                    <div className="text-sm font-medium text-violet-400">
                        {percentage}%
                    </div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                    <div 
                        className="bg-gradient-to-r from-violet-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>
        </div>
    );
}