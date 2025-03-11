"use client";

import React from 'react';
import { Button } from '../ui/button';
import Lottie from 'lottie-react';
import deleteLottie from '@/Lottie/deleteLottie.json';

interface DeleteConfirmProps {
    element: string;
    onDelete: () => void;
    onCancel: () => void;
    isOpen: boolean;
}

const DeleteConfirm: React.FC<DeleteConfirmProps> = ({ element, onDelete, onCancel, isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="w-full max-w-md p-6 text-center bg-white rounded-lg shadow-lg">
                <div className="flex justify-center mb-4">
                    <Lottie animationData={deleteLottie} loop autoplay className="w-36 h-36" />
                </div>

                <h4 className="mb-6 -mt-5 text-lg font-semibold text-center text-gray-800">Are you sure you want to delete {element}?</h4>

                <div className="flex justify-center gap-4">
                    <Button onClick={onCancel} className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 border rounded-lg hover:bg-gray-200">
                        Cancel
                    </Button>
                    <Button onClick={onDelete} className="flex-1 px-4 py-2 text-white bg-red-600 border rounded-lg shadow-sm hover:bg-red-700">
                        Delete
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirm;
