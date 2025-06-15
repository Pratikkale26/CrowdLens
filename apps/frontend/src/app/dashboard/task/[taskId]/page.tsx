"use client"
import { Appbar } from '../../components/Appbar';
import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { use } from 'react';

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
            <div>
                <Appbar />
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="text-lg">Loading task details...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <Appbar />
                <div className="flex justify-center items-center min-h-[60vh]">
                    <div className="text-lg text-red-500">{error}</div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Appbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8">
                    {taskDetails.title || "Untitled Task"}
                </h1>
                
                {Object.keys(result).length === 0 ? (
                    <div className="text-center text-gray-500">
                        No options available for this task yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Object.entries(result).map(([optionId, data]) => (
                            <Task 
                                key={optionId}
                                imageUrl={data.option.imageUrl} 
                                votes={data.count} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function Task({imageUrl, votes}: {
    imageUrl: string;
    votes: number;
}) {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
                className="w-full h-64 object-cover" 
                src={imageUrl} 
                alt="Task option"
            />
            <div className="p-4 bg-gray-50 border-t">
                <div className="flex items-center justify-center gap-2">
                    <span className="text-lg font-semibold">{votes}</span>
                    <span className="text-gray-500">votes</span>
                </div>
            </div>
        </div>
    );
}