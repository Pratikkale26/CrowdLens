"use client"
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react"

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

interface Task {
    id: number;
    amount: number;
    title: string;
    options: {
        id: number;
        image_url: string;
        task_id: number;
    }[];
}

interface ApiResponse<T> {
    task?: T;
    nextTask?: T;
    error?: string;
}

// CSR
export const NextTask = () => {
    const [currentTask, setCurrentTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchNextTask = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication token not found, connect wallet and sign in");
            }

            const response = await axios.get<ApiResponse<Task>>(`${NEXT_PUBLIC_BACKEND_URL}/api/v1/worker/nextTask`, {
                headers: { "Authorization": token }
            });

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            setCurrentTask(response.data.task || null);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to fetch next task";
            setError(errorMessage);
            setCurrentTask(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNextTask();
    }, []);

    const handleSubmission = async (optionId: number) => {
        try {
            setSubmitting(true);
            setError(null);
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication token not found, connect wallet and sign in");
            }

            const response = await axios.post<ApiResponse<Task>>(
                `${NEXT_PUBLIC_BACKEND_URL}/api/v1/worker/submission`,
                {
                    taskId: currentTask?.id.toString(),
                    selection: optionId.toString()
                },
                {
                    headers: { "Authorization": token }
                }
            );

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            setCurrentTask(response.data.nextTask || null);
            // TODO: Add a callback to refresh user balance in the appbar
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to submit task";
            setError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex justify-center items-center">
                <div className="text-2xl font-semibold text-gray-600">
                    Loading your next task...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex justify-center items-center">
                <div className="text-center">
                    <div className="text-2xl font-semibold text-red-600 mb-4">
                        {error}
                    </div>
                    <button
                        onClick={fetchNextTask}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!currentTask) {
        return (
            <div className="h-screen flex justify-center items-center">
                <div className="text-2xl font-semibold text-gray-600">
                    Please check back in some time, there are no pending tasks at the moment
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-2xl pt-20 flex justify-center items-center gap-4">
                <h1 className="font-semibold">{currentTask.title}</h1>
                {submitting && (
                    <span className="text-blue-500 animate-pulse">Submitting...</span>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
                {currentTask.options.map(option => (
                    <Option
                        key={option.id}
                        imageUrl={option.image_url}
                        onSelect={() => handleSubmission(option.id)}
                        disabled={submitting}
                    />
                ))}
            </div>
        </div>
    );
};

interface OptionProps {
    imageUrl: string;
    onSelect: () => void;
    disabled?: boolean;
}

function Option({ imageUrl, onSelect, disabled }: OptionProps) {
    return (
        <div className="relative group aspect-[4/3]">
            <Image
                onClick={disabled ? undefined : onSelect}
                className={`p-2 w-full h-full object-contain rounded-lg transition-transform cursor-pointer
                    ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'}`}
                src={imageUrl}
                alt="Task option image"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
            />
        </div>
    );
}